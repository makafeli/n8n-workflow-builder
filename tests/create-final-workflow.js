#!/usr/bin/env node

/**
 * Create the final Support Optimization System workflow
 */

const { spawn } = require('child_process');

class FinalWorkflowCreator {
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
          name: "HelpScout API Request",
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4,
          position: [460, 300],
          parameters: {
            url: "https://api.helpscout.net/v2/conversations",
            method: "GET"
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
        },
        {
          id: "ai-analysis",
          name: "AI Analysis Placeholder",
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [900, 300],
          parameters: {
            mode: "runOnceForAllItems",
            jsCode: "// AI Analysis placeholder\nconst analysisResults = {\n  summary: 'Analysis complete',\n  insights: ['Insight 1', 'Insight 2'],\n  recommendations: ['Recommendation 1', 'Recommendation 2']\n};\nreturn [{ json: analysisResults }];"
          }
        },
        {
          id: "output-results",
          name: "Output Results",
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [1120, 300],
          parameters: {
            mode: "runOnceForAllItems",
            jsCode: "// Format and output results\nconst results = $input.all();\nconsole.log('Support optimization analysis complete:', JSON.stringify(results, null, 2));\nreturn results;"
          }
        }
      ],
      connections: {
        "Schedule Trigger": {
          "main": [
            [
              {
                "node": "HelpScout API Request",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "HelpScout API Request": {
          "main": [
            [
              {
                "node": "Process Support Data",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Process Support Data": {
          "main": [
            [
              {
                "node": "AI Analysis Placeholder",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "AI Analysis Placeholder": {
          "main": [
            [
              {
                "node": "Output Results",
                "type": "main",
                "index": 0
              }
            ]
          ]
        }
      }
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
        
        try {
          const result = JSON.parse(response.result.content[0].text);
          console.log('📊 Workflow Details:');
          console.log(`   - ID: ${result.id}`);
          console.log(`   - Name: ${result.name}`);
          console.log(`   - Nodes: ${result.nodes.length}`);
          console.log(`   - Active: ${result.active}`);
          console.log(`   - Created: ${result.createdAt}`);
        } catch (parseError) {
          console.log('⚠️  Workflow created but could not parse details');
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
const creator = new FinalWorkflowCreator();
creator.createWorkflow().then(success => {
  if (success) {
    console.log('\n🎉 Support Optimization System workflow created successfully!');
    console.log('\n📝 Workflow Components:');
    console.log('   ✅ Schedule Trigger (runs every 6 hours)');
    console.log('   ✅ HelpScout API Request node');
    console.log('   ✅ Data Processing node');
    console.log('   ✅ AI Analysis placeholder node');
    console.log('   ✅ Output Results node');
    console.log('\n🔧 Next Steps:');
    console.log('   1. Configure HelpScout API credentials');
    console.log('   2. Replace AI Analysis placeholder with OpenAI/Claude node');
    console.log('   3. Add Slack/Email notification nodes');
    console.log('   4. Add Google Sheets storage node');
    console.log('   5. Test and activate the workflow');
    process.exit(0);
  } else {
    console.log('\n❌ Failed to create workflow. Check the errors above.');
    process.exit(1);
  }
}).catch(console.error);
