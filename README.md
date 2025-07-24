# n8n Workflow Builder MCP Server

<div align="center">
  <a href="https://glama.ai/mcp/servers/fhoynrlnpp">
    <img width="380" height="200" src="https://glama.ai/mcp/servers/fhoynrlnpp/badge" alt="n8n Workflow Builder Server MCP server" />
  </a>
  <a href="https://mseep.ai/app/makafeli-n8n-workflow-builder">
    <img width="380" height="200" src="https://mseep.net/pr/makafeli-n8n-workflow-builder-badge.png" alt="MseeP.ai Security Assessment Badge" />
  </a>
</div>

A powerful Model Context Protocol (MCP) server that enables AI assistants to manage n8n workflows seamlessly. Connect your AI tools directly to n8n for automated workflow creation, execution, and management.

## 🎯 What is this?

The n8n Workflow Builder MCP Server bridges the gap between AI assistants (like Claude Desktop, Cline, or any MCP-compatible client) and your n8n automation platform. It provides a comprehensive set of tools that allow AI assistants to:

- **List and browse** your existing n8n workflows
- **Create new workflows** with complex node configurations
- **Execute workflows** on demand
- **Manage workflow lifecycle** (activate, deactivate, update, delete)
- **Monitor workflow status** and retrieve detailed information

Perfect for teams using n8n who want to leverage AI assistants for workflow automation and management.

## ✨ Key Features

- 🔧 **Complete Workflow Management** - Full CRUD operations for n8n workflows
- 🤖 **AI-First Design** - Built specifically for AI assistant integration
- 🚀 **Zero Configuration** - Works out of the box with NPX
- 🔒 **Secure** - Uses n8n's official API with proper authentication
- 📦 **Modern Architecture** - Built with TypeScript and latest MCP SDK
- ⚡ **High Performance** - Optimized for fast response times

## 📋 Requirements

- **Node.js** v18.0.0 or higher
- **n8n instance** (self-hosted or cloud)
- **n8n API key** with appropriate permissions

## 🚀 Installation

### Method 1: NPX (Recommended)

The fastest way to get started:

```bash
npx @makafeli/n8n-workflow-builder
```

### Method 2: Manual Installation

For development or customization:

```bash
# Clone the repository
git clone https://github.com/makafeli/n8n-workflow-builder.git
cd n8n-workflow-builder

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## ⚙️ Configuration

### Environment Variables

Configure the following environment variables to connect to your n8n instance:

| Variable | Description | Example |
|----------|-------------|---------|
| `N8N_HOST` | Your n8n instance URL | `http://localhost:5678` or `https://your-n8n.com/api/v1` |
| `N8N_API_KEY` | Your n8n API key | `n8n_api_1234567890abcdef...` |

### Getting Your n8n API Key

1. Open your n8n instance
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the generated key

### Setting Environment Variables

```bash
# For local testing
export N8N_HOST="http://localhost:5678"
export N8N_API_KEY="your-api-key-here"

# Then run the server
npx @makafeli/n8n-workflow-builder
```

## 🔧 MCP Client Setup

### Claude Desktop

Add this configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "n8n-workflow-builder": {
      "command": "npx",
      "args": ["@makafeli/n8n-workflow-builder"],
      "env": {
        "N8N_HOST": "http://localhost:5678",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Cline (VS Code Extension)

Add this to your Cline MCP settings:

```json
{
  "mcpServers": {
    "n8n-workflow-builder": {
      "command": "npx",
      "args": ["@makafeli/n8n-workflow-builder"],
      "env": {
        "N8N_HOST": "http://localhost:5678",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Other MCP Clients

The server works with any MCP-compatible client. Use the same configuration pattern with your client's specific setup method.

## 🛠️ Available Tools

The MCP server provides 15 comprehensive tools for complete n8n workflow and execution management:

### Core Workflow Operations

| Tool | Description | Parameters |
|------|-------------|------------|
| `list_workflows` | List all workflows from your n8n instance | None |
| `get_workflow` | Retrieve detailed information about a specific workflow | `id`: Workflow ID (string) |
| `create_workflow` | Create a new workflow with nodes and connections | `workflow`: Workflow object |
| `execute_workflow` | Manually execute a workflow | `id`: Workflow ID (string) |

### Workflow Lifecycle Management

| Tool | Description | Parameters |
|------|-------------|------------|
| `update_workflow` | Update an existing workflow's configuration | `id`: Workflow ID, `workflow`: Updated workflow object |
| `activate_workflow` | Activate a workflow to enable automatic execution | `id`: Workflow ID (string) |
| `deactivate_workflow` | Deactivate a workflow to stop automatic execution | `id`: Workflow ID (string) |
| `delete_workflow` | Permanently delete a workflow | `id`: Workflow ID (string) |

### Advanced Operations

| Tool | Description | Parameters |
|------|-------------|------------|
| `create_workflow_and_activate` | Create a new workflow and immediately activate it | `workflow`: Workflow object |

### Execution Management ⭐ NEW

| Tool | Description | Parameters |
|------|-------------|------------|
| `list_executions` | List workflow executions with filtering and pagination | `includeData`, `status`, `workflowId`, `projectId`, `limit`, `cursor` |
| `get_execution` | Get detailed information about a specific execution | `id`: Execution ID, `includeData`: Include detailed data |
| `delete_execution` | Delete a workflow execution record | `id`: Execution ID |

### Tag Management ⭐ NEW

| Tool | Description | Parameters |
|------|-------------|------------|
| `list_tags` | List all workflow tags with pagination | `limit`, `cursor` |
| `create_tag` | Create a new workflow tag for organization | `name`: Tag name |

### Security & Compliance ⭐ NEW

| Tool | Description | Parameters |
|------|-------------|------------|
| `generate_audit` | Generate comprehensive security audit report | `additionalOptions`: Audit configuration |

## 💡 Usage Examples

### Basic Operations

```javascript
// List all workflows
await callTool("list_workflows", {});

// Get detailed information about a workflow
await callTool("get_workflow", { id: "workflow-123" });

// Execute a workflow manually
await callTool("execute_workflow", { id: "workflow-123" });
```

### Creating Workflows

```javascript
// Create a simple workflow
await callTool("create_workflow", {
  workflow: {
    name: "My Automation Workflow",
    nodes: [
      {
        id: "trigger",
        name: "Schedule Trigger",
        type: "n8n-nodes-base.scheduleTrigger",
        typeVersion: 1,
        position: [240, 300],
        parameters: {
          interval: [{ field: "unit", value: "hours" }]
        }
      },
      {
        id: "action",
        name: "HTTP Request",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4,
        position: [460, 300],
        parameters: {
          url: "https://api.example.com/webhook",
          method: "POST"
        }
      }
    ],
    connections: {
      "Schedule Trigger": {
        "main": [[{ "node": "HTTP Request", "type": "main", "index": 0 }]]
      }
    }
  }
});
```

### Workflow Management

```javascript
// Activate a workflow
await callTool("activate_workflow", { id: "workflow-123" });

// Update a workflow
await callTool("update_workflow", {
  id: "workflow-123",
  workflow: { name: "Updated Workflow Name" }
});

// Deactivate a workflow
await callTool("deactivate_workflow", { id: "workflow-123" });

// Create and immediately activate
await callTool("create_workflow_and_activate", {
  workflow: { /* workflow configuration */ }
});
```

### Execution Management ⭐ NEW

```javascript
// List recent executions
await callTool("list_executions", {
  limit: 10,
  status: "error"
});

// Get detailed execution information
await callTool("get_execution", {
  id: "execution-123",
  includeData: true
});

// Clean up old execution records
await callTool("delete_execution", { id: "execution-123" });
```

### Tag Management ⭐ NEW

```javascript
// List all workflow tags
await callTool("list_tags", { limit: 50 });

// Create a new tag for organization
await callTool("create_tag", { name: "production" });
```

### Security Audit ⭐ NEW

```javascript
// Generate comprehensive security audit
await callTool("generate_audit", {
  additionalOptions: {
    daysAbandonedWorkflow: 30,
    categories: ["credentials", "database", "nodes"]
  }
});
```

## 🔧 Troubleshooting

### Common Issues

#### "Connection refused" or "ECONNREFUSED"
- **Cause**: Cannot connect to your n8n instance
- **Solution**: Verify your `N8N_HOST` is correct and n8n is running
- **Check**: Try accessing your n8n instance in a browser first

#### "Unauthorized" or "401 Error"
- **Cause**: Invalid or missing API key
- **Solution**:
  1. Verify your `N8N_API_KEY` is correct
  2. Ensure the API key has proper permissions
  3. Check if the API key hasn't expired

#### "Workflow not found" or "404 Error"
- **Cause**: Workflow ID doesn't exist
- **Solution**: Use `list_workflows` to get valid workflow IDs

#### Server won't start
- **Cause**: Missing Node.js or dependencies
- **Solution**:
  1. Ensure Node.js v18+ is installed: `node --version`
  2. Try clearing npm cache: `npm cache clean --force`
  3. For manual installation, run: `npm install && npm run build`

### Debug Mode

For detailed logging, set the debug environment variable:

```bash
DEBUG=n8n-workflow-builder npx @makafeli/n8n-workflow-builder
```

### Getting Help

1. Check the [GitHub Issues](https://github.com/makafeli/n8n-workflow-builder/issues)
2. Review n8n's [API documentation](https://docs.n8n.io/api/)
3. Verify your MCP client configuration

## 🤝 Contributing

We welcome contributions!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- **[n8n Documentation](https://docs.n8n.io/)** - Official n8n docs
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - MCP specification
- **[Claude Desktop](https://claude.ai/desktop)** - AI assistant with MCP support
- **[Cline](https://cline.bot/)** - VS Code AI assistant
- **[GitHub Repository](https://github.com/makafeli/n8n-workflow-builder)** - Source code and issues

---

**Built with ❤️ for the n8n and MCP community**
