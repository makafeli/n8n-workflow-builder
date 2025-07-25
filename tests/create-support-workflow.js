#!/usr/bin/env node

/**
 * Script to create the comprehensive Support Optimization System workflow
 */

const { spawn } = require('child_process');

class WorkflowCreator {
  constructor() {
    this.serverProcess = null;
  }

  async startServer() {
    console.log('🚀 Starting n8n MCP server...');
    
    this.serverProcess = spawn('npx', ['.'], {
      cwd: '/Users/yasinboelhouwer/n8n-workflow-builder',
      env: {
        ...process.env,
        N8N_HOST: 'https://n8n.yasin.nu/api/v1',
        N8N_API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMmE2NzM0NC05ZWI1LTQ0NmMtODczNi1lNWYyOGE4MjY4NTIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUzMzQzODU5fQ.PhpEIzzSGROy9Kok26SXmj9RRH1K3ArahexaVbQ2-Ho'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    return new Promise((resolve, reject) => {
      let output = '';
      
      this.serverProcess.stderr.on('data', (data) => {
        output += data.toString();
        if (output.includes('N8N Workflow Builder MCP server running on stdio')) {
          console.log('✅ Server started successfully');
          resolve();
        }
      });

      this.serverProcess.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
        reject(error);
      });

      setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 10000);
    });
  }

  async sendMCPRequest(method, params = {}) {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: method,
        params: params
      };

      let response = '';
      let timeout;

      const onData = (data) => {
        response += data.toString();
        try {
          const parsed = JSON.parse(response);
          clearTimeout(timeout);
          this.serverProcess.stdout.removeListener('data', onData);
          resolve(parsed);
        } catch (e) {
          // Continue collecting data
        }
      };

      this.serverProcess.stdout.on('data', onData);
      
      timeout = setTimeout(() => {
        this.serverProcess.stdout.removeListener('data', onData);
        reject(new Error(`Timeout waiting for response to ${method}`));
      }, 10000);

      this.serverProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  getSupportOptimizationWorkflow() {
    return {
      name: "Support Optimization System - HelpScout AI Analysis",
      nodes: [
        {
          id: "schedule-trigger",
          name: "Schedule Trigger",
          type: "n8n-nodes-base.scheduleTrigger",
          typeVersion: 1,
          position: [240, 300],
          parameters: {
            interval: [
              {
                field: "unit",
                value: "hours"
              },
              {
                field: "intervalValue",
                value: 6
              }
            ]
          }
        },
        {
          id: "helpscout-fetch",
          name: "HelpScout - Fetch Messages",
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4,
          position: [460, 300],
          parameters: {
            url: "https://api.helpscout.net/v2/conversations",
            method: "GET",
            sendQuery: true,
            queryParameters: {
              parameters: [
                { name: "status", value: "all" },
                { name: "embed", value: "threads" },
                { name: "page", value: "1" },
                { name: "sortField", value: "modifiedAt" },
                { name: "sortOrder", value: "desc" }
              ]
            },
            sendHeaders: true,
            headerParameters: {
              parameters: [
                { name: "Authorization", value: "Bearer YOUR_HELPSCOUT_API_TOKEN" },
                { name: "Content-Type", value: "application/json" }
              ]
            },
            options: {
              timeout: 30000
            }
          }
        },
        {
          id: "data-processor",
          name: "Process Support Data",
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [680, 300],
          parameters: {
            mode: "runOnceForAllItems",
            jsCode: "// Process HelpScout data\nconst data = $input.all();\nconsole.log('Processing', data.length, 'items');\nreturn data;"
          }
        }
      ],
      connections: {
        "Schedule Trigger": {
          "main": [
            [
              {
                "node": "HelpScout - Fetch Messages",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "HelpScout - Fetch Messages": {
          "main": [
            [
              {
                "node": "Process Support Data",
                "type": "main",
                "index": 0
              }
            ]
          ]
        }
      },
      settings: {
        saveExecutionProgress: true,
        saveManualExecutions: true,
        saveDataErrorExecution: "all",
        saveDataSuccessExecution: "all",
        executionTimeout: 3600,
        timezone: "America/New_York"
      },
      tags: [
        {
          name: "Support Optimization"
        },
        {
          name: "AI Analysis"
        },
        {
          name: "HelpScout"
        }
      ]
    };
  }

  async createWorkflow() {
    try {
      await this.startServer();
      
      console.log('📋 Creating Support Optimization System workflow...\n');

      const workflow = this.getSupportOptimizationWorkflow();
      
      const response = await this.sendMCPRequest('tools/call', {
        name: 'create_workflow',
        arguments: { workflow }
      });

      if (response.error) {
        console.log('❌ Workflow creation failed:', response.error.message);
        return false;
      } else {
        console.log('✅ Support Optimization System workflow created successfully!');
        console.log('📊 Workflow Details:');
        
        try {
          const responseText = response.result.content[0].text;
          console.log('Raw response:', responseText.substring(0, 200) + '...');
          
          const result = JSON.parse(responseText);
          console.log(`   - ID: ${result.id}`);
          console.log(`   - Name: ${result.name}`);
          console.log(`   - Nodes: ${result.nodes.length}`);
          console.log(`   - Active: ${result.active}`);
        } catch (parseError) {
          console.log('⚠️  Could not parse workflow details, but creation succeeded');
          console.log('Response:', response.result.content[0].text.substring(0, 500));
        }
        
        return true;
      }
    } catch (error) {
      console.error('❌ Workflow creation error:', error.message);
      return false;
    } finally {
      this.cleanup();
    }
  }

  cleanup() {
    if (this.serverProcess) {
      console.log('\n🧹 Cleaning up server process...');
      this.serverProcess.kill();
    }
  }
}

// Create the workflow
const creator = new WorkflowCreator();
creator.createWorkflow().then(success => {
  if (success) {
    console.log('\n🎉 Support Optimization System workflow is ready!');
    console.log('📝 Next steps:');
    console.log('   1. Configure HelpScout API credentials in n8n');
    console.log('   2. Add AI analysis nodes (OpenAI, Claude, etc.)');
    console.log('   3. Configure output nodes (Slack, Google Sheets)');
    console.log('   4. Test and activate the workflow');
    process.exit(0);
  } else {
    console.log('\n❌ Failed to create workflow. Check the errors above.');
    process.exit(1);
  }
}).catch(console.error);
