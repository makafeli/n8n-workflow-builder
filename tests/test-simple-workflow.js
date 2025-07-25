#!/usr/bin/env node

/**
 * Test script to create a simple workflow and debug the 400 error
 */

const { spawn } = require('child_process');

class SimpleWorkflowTester {
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

  getSimpleWorkflow() {
    return {
      name: "Simple Test Workflow",
      nodes: [
        {
          id: "start-node",
          name: "Start",
          type: "n8n-nodes-base.start",
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        },
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
                value: "seconds"
              },
              {
                field: "intervalValue",
                value: 10
              }
            ]
          }
        }
      ],
      connections: {},
      settings: {
        saveExecutionProgress: true,
        saveManualExecutions: true
      }
    };
  }

  async testWorkflow() {
    try {
      await this.startServer();
      
      console.log('📋 Creating simple test workflow...\n');

      const workflow = this.getSimpleWorkflow();
      console.log('Workflow payload:', JSON.stringify(workflow, null, 2));
      
      const response = await this.sendMCPRequest('tools/call', {
        name: 'create_workflow',
        arguments: { workflow }
      });

      console.log('Full response:', JSON.stringify(response, null, 2));

      if (response.error) {
        console.log('❌ Workflow creation failed:', response.error.message);
        return false;
      } else {
        console.log('✅ Simple workflow created successfully!');
        return true;
      }
    } catch (error) {
      console.error('❌ Test error:', error.message);
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

// Run the test
const tester = new SimpleWorkflowTester();
tester.testWorkflow().then(success => {
  if (success) {
    console.log('\n🎉 Simple workflow test passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Simple workflow test failed.');
    process.exit(1);
  }
}).catch(console.error);
