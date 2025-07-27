# Smithery.ai Deployment Guide

This guide explains how to deploy the n8n-workflow-builder MCP server to Smithery.ai for hosted access.

## 🎯 Overview

Smithery.ai is a hosting platform for Model Context Protocol (MCP) servers that provides:
- **Hosted MCP Servers**: No local installation required
- **Tool Playground**: Interactive testing interface
- **Unified Gateway**: Single API endpoint for multiple MCP servers
- **Managed Authentication**: Simplified configuration management

## 📋 Prerequisites

1. **GitHub Repository**: Your MCP server code must be in a GitHub repository
2. **Smithery Account**: Sign up at [smithery.ai](https://smithery.ai)
3. **Proper Configuration**: `smithery.yaml` and compatible server structure

## 🚀 Deployment Steps

### Step 1: Verify Configuration

Ensure your repository has the required files:

```
├── smithery.yaml          # Smithery configuration
├── src/
│   ├── index.ts          # Smithery-compatible entry point
│   └── server.ts         # Original CLI server (optional)
├── package.json          # Node.js dependencies
└── tsconfig.json         # TypeScript configuration
```

### Step 2: Deploy to Smithery

1. **Go to Smithery**: Visit [smithery.ai/new](https://smithery.ai/new)

2. **Connect GitHub**: 
   - Click "Connect GitHub Repository"
   - Select `makafeli/n8n-workflow-builder`
   - Grant necessary permissions

3. **Configure Deployment**:
   - Smithery will automatically detect your `smithery.yaml`
   - Review the configuration schema
   - Set up example configuration values

4. **Deploy**:
   - Click "Deploy" button
   - Wait for build and deployment to complete
   - Your MCP server will be available at a Smithery URL

### Step 3: Test Your Deployment

1. **Tool Playground**: Use Smithery's built-in playground to test your tools
2. **Configuration**: Test with different n8n host and API key configurations
3. **Integration**: Connect to your hosted MCP server from AI agents

## 🔧 Configuration Schema

Your MCP server accepts the following configuration:

```yaml
configSchema:
  type: "object"
  properties:
    n8nHost:
      type: "string"
      description: "n8n instance URL (e.g., http://localhost:5678)"
      default: "http://localhost:5678"
    n8nApiKey:
      type: "string"
      description: "n8n API key for authentication"
  required: ["n8nHost", "n8nApiKey"]
```

## 🛠️ Available Tools

Once deployed, your MCP server provides these tools:

### Workflow Management
- `list_workflows` - List all workflows from n8n instance
- `create_workflow` - Create a new workflow in n8n
- `get_workflow` - Get a workflow by ID
- `update_workflow` - Update an existing workflow by ID
- `delete_workflow` - Delete a workflow by ID

### Workflow Control
- `execute_workflow` - Execute a workflow by ID
- `activate_workflow` - Activate a workflow by ID
- `deactivate_workflow` - Deactivate a workflow by ID

## 🔗 Usage Examples

### Connect from Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "n8n-workflow-builder": {
      "command": "smithery",
      "args": ["run", "@makafeli/n8n-workflow-builder"],
      "env": {
        "N8N_HOST": "http://your-n8n-instance:5678",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Connect via Smithery API

```bash
curl -X POST https://api.smithery.ai/v1/servers/@makafeli/n8n-workflow-builder/tools/list_workflows \
  -H "Authorization: Bearer YOUR_SMITHERY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "n8nHost": "http://your-n8n-instance:5678",
      "n8nApiKey": "your-api-key"
    }
  }'
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that `smithery.yaml` is properly formatted
   - Ensure `src/index.ts` exports the required function
   - Verify TypeScript compilation succeeds locally

2. **Configuration Errors**:
   - Validate your configuration schema matches the expected format
   - Test configuration values with your n8n instance

3. **Tool Execution Errors**:
   - Verify n8n API key has proper permissions
   - Check n8n instance is accessible from Smithery's servers
   - Review tool parameter validation

### Getting Help

- **Smithery Documentation**: [smithery.ai/docs](https://smithery.ai/docs)
- **Discord Community**: [discord.gg/Afd38S5p9A](https://discord.gg/Afd38S5p9A)
- **GitHub Issues**: [github.com/makafeli/n8n-workflow-builder/issues](https://github.com/makafeli/n8n-workflow-builder/issues)

## 🎉 Benefits of Smithery Hosting

- **No Installation**: Users don't need to install or run your MCP server locally
- **Security**: Smithery handles secure execution and isolation
- **Discovery**: Your server appears in Smithery's marketplace
- **Reliability**: Professional hosting with uptime monitoring
- **Scalability**: Automatic scaling based on usage

## 📊 Monitoring

Once deployed, you can monitor your MCP server:
- **Usage Analytics**: View tool usage statistics
- **Error Logs**: Monitor and debug issues
- **Performance Metrics**: Track response times and success rates

Your n8n-workflow-builder MCP server is now ready for global access via Smithery.ai! 🚀
