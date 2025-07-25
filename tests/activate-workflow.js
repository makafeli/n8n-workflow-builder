#!/usr/bin/env node

/**
 * Script to activate a specific workflow via MCP server
 */

const { spawn } = require('child_process');

class WorkflowActivator {
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

  async activateWorkflow(workflowId) {
    try {
      console.log(`🔄 Activating workflow ID: ${workflowId}...`);
      
      const response = await this.sendMCPRequest('tools/call', {
        name: 'activate_workflow',
        arguments: { id: workflowId }
      });

      if (response.error) {
        console.log('❌ Workflow activation failed:', response.error.message);
        return false;
      } else {
        console.log('✅ Workflow activated successfully!');
        
        try {
          const result = JSON.parse(response.result.content[0].text);
          console.log('📊 Workflow Details:');
          console.log(`   - ID: ${result.id}`);
          console.log(`   - Name: ${result.name}`);
          console.log(`   - Active: ${result.active}`);
          console.log(`   - Updated: ${result.updatedAt}`);
          
          if (result.nodes && result.nodes.length > 0) {
            console.log(`   - Nodes: ${result.nodes.length}`);
            
            // Check for trigger nodes
            const triggerNodes = result.nodes.filter(node => 
              node.type.includes('trigger') || 
              node.type.includes('webhook') || 
              node.type.includes('cron') ||
              node.type.includes('schedule')
            );
            
            if (triggerNodes.length > 0) {
              console.log(`   - Trigger Nodes: ${triggerNodes.length}`);
              triggerNodes.forEach(node => {
                console.log(`     • ${node.name} (${node.type})`);
              });
            }
          }
          
        } catch (parseError) {
          console.log('⚠️  Workflow activated but could not parse details');
          console.log('Raw response:', response.result.content[0].text.substring(0, 200) + '...');
        }
        
        return true;
      }
    } catch (error) {
      console.error('❌ Activation error:', error.message);
      return false;
    }
  }

  async run(workflowId) {
    try {
      await this.startServer();
      
      console.log(`\n🎯 Activating workflow: ${workflowId}\n`);
      
      const success = await this.activateWorkflow(workflowId);
      
      if (success) {
        console.log('\n🎉 Workflow activation completed successfully!');
        console.log('📝 The workflow is now active and will execute based on its trigger configuration.');
      } else {
        console.log('\n❌ Workflow activation failed. Please check the error messages above.');
      }
      
      return success;
      
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

console.log('🔧 n8n Workflow Activator');
console.log('========================');

const activator = new WorkflowActivator();
activator.run(workflowId).then(success => {
  if (success) {
    console.log(`\n✅ Workflow ${workflowId} is now active!`);
    process.exit(0);
  } else {
    console.log(`\n❌ Failed to activate workflow ${workflowId}.`);
    process.exit(1);
  }
}).catch(console.error);
