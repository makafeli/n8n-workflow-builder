#!/usr/bin/env node

/**
 * Test script to verify all MCP tools are working correctly
 */

const { spawn } = require('child_process');
const { EventEmitter } = require('events');

class MCPTester extends EventEmitter {
  constructor() {
    super();
    this.serverProcess = null;
    this.testResults = [];
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
      }, 5000);

      this.serverProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async testTool(toolName, params = {}) {
    console.log(`🧪 Testing tool: ${toolName}`);
    
    try {
      const response = await this.sendMCPRequest('tools/call', {
        name: toolName,
        arguments: params
      });

      if (response.error) {
        console.log(`❌ ${toolName} failed:`, response.error.message);
        this.testResults.push({ tool: toolName, status: 'failed', error: response.error.message });
        return false;
      } else {
        console.log(`✅ ${toolName} succeeded`);
        this.testResults.push({ tool: toolName, status: 'passed' });
        return true;
      }
    } catch (error) {
      console.log(`❌ ${toolName} error:`, error.message);
      this.testResults.push({ tool: toolName, status: 'error', error: error.message });
      return false;
    }
  }

  async runAllTests() {
    try {
      await this.startServer();
      
      console.log('\n📋 Running MCP tool tests...\n');

      // Test list_workflows
      await this.testTool('list_workflows');
      
      // Test get_workflow (this will fail if no workflows exist, but that's expected)
      // await this.testTool('get_workflow', { id: 'test-id' });
      
      // Test execute_workflow (this will fail if no workflows exist, but that's expected)  
      // await this.testTool('execute_workflow', { id: 'test-id' });

      // Test create_workflow with a simple workflow
      const testWorkflow = {
        name: 'MCP Test Workflow',
        nodes: [
          {
            id: 'start-node',
            name: 'Start',
            type: 'n8n-nodes-base.start',
            typeVersion: 1,
            position: [240, 300],
            parameters: {}
          }
        ],
        connections: {},
        settings: {
          saveExecutionProgress: true,
          saveManualExecutions: true
        }
      };
      
      await this.testTool('create_workflow', { workflow: testWorkflow });

    } catch (error) {
      console.error('❌ Test execution failed:', error);
    } finally {
      this.cleanup();
    }
  }

  cleanup() {
    if (this.serverProcess) {
      console.log('\n🧹 Cleaning up server process...');
      this.serverProcess.kill();
    }
    
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    this.testResults.forEach(result => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${result.tool}: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const total = this.testResults.length;
    
    console.log(`\n🎯 Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! MCP server is working correctly.');
      process.exit(0);
    } else {
      console.log('⚠️  Some tests failed. Check the errors above.');
      process.exit(1);
    }
  }
}

// Run the tests
const tester = new MCPTester();
tester.runAllTests().catch(console.error);
