#!/usr/bin/env node

/**
 * Script to check if a workflow exists and get its details
 */

const { spawn } = require('child_process');

class WorkflowChecker {
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

  async listWorkflows() {
    try {
      console.log('📋 Listing all available workflows...');
      
      const response = await this.sendMCPRequest('tools/call', {
        name: 'list_workflows',
        arguments: {}
      });

      if (response.error) {
        console.log('❌ Failed to list workflows:', response.error.message);
        return null;
      }
      
      const result = JSON.parse(response.result.content[0].text);
      const workflows = result.data || [];
      
      console.log(`\n📊 Found ${workflows.length} workflows:`);
      console.log('================================');
      
      workflows.forEach((workflow, index) => {
        console.log(`${index + 1}. ${workflow.name}`);
        console.log(`   ID: ${workflow.id}`);
        console.log(`   Active: ${workflow.active ? '✅ Yes' : '❌ No'}`);
        console.log(`   Created: ${workflow.createdAt}`);
        console.log(`   Updated: ${workflow.updatedAt}`);
        console.log('');
      });
      
      return workflows;
      
    } catch (error) {
      console.error('❌ Error listing workflows:', error.message);
      return null;
    }
  }

  async getWorkflow(workflowId) {
    try {
      console.log(`🔍 Checking workflow ID: ${workflowId}...`);
      
      const response = await this.sendMCPRequest('tools/call', {
        name: 'get_workflow',
        arguments: { id: workflowId }
      });

      if (response.error) {
        console.log(`❌ Workflow ${workflowId} not found:`, response.error.message);
        return null;
      }
      
      const workflow = JSON.parse(response.result.content[0].text);
      
      console.log('✅ Workflow found!');
      console.log('📊 Workflow Details:');
      console.log(`   - ID: ${workflow.id}`);
      console.log(`   - Name: ${workflow.name}`);
      console.log(`   - Active: ${workflow.active ? '✅ Yes' : '❌ No'}`);
      console.log(`   - Nodes: ${workflow.nodes?.length || 0}`);
      console.log(`   - Created: ${workflow.createdAt}`);
      console.log(`   - Updated: ${workflow.updatedAt}`);
      
      if (workflow.nodes && workflow.nodes.length > 0) {
        console.log('\n🔧 Nodes:');
        workflow.nodes.forEach(node => {
          console.log(`   • ${node.name} (${node.type})`);
        });
      }
      
      return workflow;
      
    } catch (error) {
      console.error('❌ Error getting workflow:', error.message);
      return null;
    }
  }

  async run(workflowId) {
    try {
      await this.startServer();
      
      console.log(`\n🔍 Checking workflow: ${workflowId}\n`);
      
      // First, try to get the specific workflow
      const workflow = await this.getWorkflow(workflowId);
      
      if (!workflow) {
        console.log('\n📋 Let me show you all available workflows instead:\n');
        await this.listWorkflows();
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Script execution failed:', error);
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

// Get workflow ID from command line argument or use the specified one
const workflowId = process.argv[2] || '1753360799340';

console.log('🔍 n8n Workflow Checker');
console.log('=======================');

const checker = new WorkflowChecker();
checker.run(workflowId).then(success => {
  if (success) {
    console.log(`\n✅ Workflow ${workflowId} exists and details shown above.`);
  } else {
    console.log(`\n❌ Workflow ${workflowId} was not found.`);
    console.log('💡 Please check the workflow ID and try again with a valid ID from the list above.');
  }
}).catch(console.error);
