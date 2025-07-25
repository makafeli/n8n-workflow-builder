#!/usr/bin/env node

/**
 * Comprehensive test script for all n8n MCP workflow management tools
 */

const { spawn } = require('child_process');

class ComprehensiveMCPTester {
  constructor() {
    this.serverProcess = null;
    this.testResults = [];
    this.createdWorkflowId = null;
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

  async testTool(toolName, params = {}, expectSuccess = true) {
    console.log(`🧪 Testing tool: ${toolName}`);
    
    try {
      const response = await this.sendMCPRequest('tools/call', {
        name: toolName,
        arguments: params
      });

      if (response.error) {
        if (expectSuccess) {
          console.log(`❌ ${toolName} failed:`, response.error.message);
          this.testResults.push({ tool: toolName, status: 'failed', error: response.error.message });
          return { success: false, data: null };
        } else {
          console.log(`✅ ${toolName} failed as expected:`, response.error.message);
          this.testResults.push({ tool: toolName, status: 'passed', note: 'Expected failure' });
          return { success: true, data: null };
        }
      } else {
        console.log(`✅ ${toolName} succeeded`);
        this.testResults.push({ tool: toolName, status: 'passed' });
        
        // Extract workflow ID if this was a create operation
        if (toolName.includes('create') && response.result?.content?.[0]?.text) {
          try {
            const result = JSON.parse(response.result.content[0].text);
            if (result.id) {
              this.createdWorkflowId = result.id;
              console.log(`   📝 Created workflow ID: ${this.createdWorkflowId}`);
            } else if (result.created?.id) {
              this.createdWorkflowId = result.created.id;
              console.log(`   📝 Created workflow ID: ${this.createdWorkflowId}`);
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
        
        return { success: true, data: response.result };
      }
    } catch (error) {
      console.log(`❌ ${toolName} error:`, error.message);
      this.testResults.push({ tool: toolName, status: 'error', error: error.message });
      return { success: false, data: null };
    }
  }

  getTestWorkflow() {
    return {
      name: `MCP Test Workflow ${Date.now()}`,
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
                value: 24
              }
            ]
          }
        }
      ],
      connections: {}
    };
  }

  async runAllTests() {
    try {
      await this.startServer();
      
      console.log('\n📋 Running comprehensive MCP tool tests...\n');

      // Test all 9 workflow management tools
      await this.testTool('list_workflows');
      
      const testWorkflow = this.getTestWorkflow();
      await this.testTool('create_workflow', { workflow: testWorkflow });
      
      if (this.createdWorkflowId) {
        await this.testTool('get_workflow', { id: this.createdWorkflowId });
        await this.testTool('update_workflow', { id: this.createdWorkflowId, workflow: { name: `Updated ${testWorkflow.name}` } });
        await this.testTool('activate_workflow', { id: this.createdWorkflowId });
        await this.testTool('deactivate_workflow', { id: this.createdWorkflowId });
        await this.testTool('execute_workflow', { id: this.createdWorkflowId });
        await this.testTool('delete_workflow', { id: this.createdWorkflowId });
      }
      
      // Test create and activate
      const createActivateWorkflow = { ...this.getTestWorkflow(), name: `MCP Create+Activate Test ${Date.now()}` };
      const createActivateResult = await this.testTool('create_workflow_and_activate', { workflow: createActivateWorkflow });
      
      // Cleanup
      if (createActivateResult.success && createActivateResult.data) {
        try {
          const result = JSON.parse(createActivateResult.data.content[0].text);
          const workflowId = result.created?.id;
          if (workflowId) {
            await this.testTool('delete_workflow', { id: workflowId });
          }
        } catch (e) {
          console.log('⚠️  Could not extract workflow ID for cleanup');
        }
      }

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
    
    const toolCategories = {
      'Basic Operations': ['list_workflows', 'get_workflow'],
      'Workflow Creation': ['create_workflow', 'create_workflow_and_activate'],
      'Workflow Management': ['update_workflow', 'activate_workflow', 'deactivate_workflow'],
      'Workflow Execution': ['execute_workflow'],
      'Workflow Deletion': ['delete_workflow']
    };
    
    Object.entries(toolCategories).forEach(([category, tools]) => {
      console.log(`\n${category}:`);
      tools.forEach(tool => {
        const result = this.testResults.find(r => r.tool === tool);
        if (result) {
          const status = result.status === 'passed' ? '✅' : '❌';
          console.log(`  ${status} ${tool}: ${result.status}`);
          if (result.error) {
            console.log(`     Error: ${result.error}`);
          }
          if (result.note) {
            console.log(`     Note: ${result.note}`);
          }
        } else {
          console.log(`  ⚪ ${tool}: not tested`);
        }
      });
    });
    
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const total = this.testResults.length;
    
    console.log(`\n🎯 Overall Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! Complete n8n workflow management is working correctly.');
      process.exit(0);
    } else {
      console.log('⚠️  Some tests failed. Check the errors above.');
      process.exit(1);
    }
  }
}

// Run the comprehensive tests
const tester = new ComprehensiveMCPTester();
tester.runAllTests().catch(console.error);
