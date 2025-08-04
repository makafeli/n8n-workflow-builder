# n8n Workflow Builder MCP Server

<!-- Social Media Preview Meta Tags -->
<meta property="og:title" content="n8n Workflow Builder MCP Server - AI Assistant Integration for n8n Automation">
<meta property="og:description" content="Connect Claude Desktop, ChatGPT, and other AI assistants directly to your n8n instance for seamless workflow management, creation, and execution through natural language commands.">
<meta property="og:image" content="https://raw.githubusercontent.com/makafeli/n8n-workflow-builder/main/.github/assets/social-preview.png">
<meta property="og:url" content="https://github.com/makafeli/n8n-workflow-builder">
<meta property="og:type" content="website">
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="n8n Workflow Builder MCP Server - AI Assistant Integration">
<meta property="twitter:description" content="Connect AI assistants like Claude Desktop to n8n for natural language workflow automation. Create, manage, and execute workflows through conversation.">
<meta property="twitter:image" content="https://raw.githubusercontent.com/makafeli/n8n-workflow-builder/main/.github/assets/social-preview.png">

**The ultimate AI assistant integration for n8n workflow automation** - Connect Claude Desktop, ChatGPT, and other AI assistants directly to your n8n instance for seamless workflow management, creation, and execution through the Model Context Protocol (MCP).

<div align="center">

<a href="https://smithery.ai/server/@makafeli/n8n-workflow-builder">
  <img src="https://smithery.ai/badge/@makafeli/n8n-workflow-builder" alt="Smithery Server Badge">
</a>

<br><br>

<!-- Package & Repository Stats -->
<a href="https://www.npmjs.com/package/@makafeli/n8n-workflow-builder">
  <img src="https://img.shields.io/npm/v/@makafeli/n8n-workflow-builder?style=flat-square&logo=npm&color=CB3837" alt="npm version">
</a>
<a href="https://www.npmjs.com/package/@makafeli/n8n-workflow-builder">
  <img src="https://img.shields.io/npm/dm/@makafeli/n8n-workflow-builder?style=flat-square&logo=npm&color=CB3837" alt="npm downloads">
</a>
<a href="https://github.com/makafeli/n8n-workflow-builder">
  <img src="https://img.shields.io/github/stars/makafeli/n8n-workflow-builder?style=flat-square&logo=github&color=181717" alt="GitHub stars">
</a>
<a href="https://github.com/makafeli/n8n-workflow-builder/network/members">
  <img src="https://img.shields.io/github/forks/makafeli/n8n-workflow-builder?style=flat-square&logo=github&color=181717" alt="GitHub forks">
</a>

<br>

<!-- Build & Quality Badges -->
<a href="https://github.com/makafeli/n8n-workflow-builder/actions">
  <img src="https://img.shields.io/github/actions/workflow/status/makafeli/n8n-workflow-builder/ci.yml?style=flat-square&logo=github-actions&label=tests" alt="CI Status">
</a>
<a href="https://github.com/makafeli/n8n-workflow-builder/blob/main/LICENSE">
  <img src="https://img.shields.io/github/license/makafeli/n8n-workflow-builder?style=flat-square&color=green" alt="License">
</a>
<a href="https://nodejs.org/">
  <img src="https://img.shields.io/node/v/@makafeli/n8n-workflow-builder?style=flat-square&logo=node.js&color=339933" alt="Node.js version">
</a>
<a href="https://www.typescriptlang.org/">
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript">
</a>

<br>

<!-- Platform Integration Badges -->
<a href="https://glama.ai/mcp/servers/fhoynrlnpp">
  <img src="https://glama.ai/mcp/servers/fhoynrlnpp/badge" alt="n8n Workflow Builder Server MCP server" height="40">
</a>
&nbsp;
<a href="https://mseep.ai/app/makafeli-n8n-workflow-builder">
  <img src="https://mseep.net/pr/makafeli-n8n-workflow-builder-badge.png" alt="MseeP.ai Security Assessment Badge" height="40">
</a>

</div>


A powerful Model Context Protocol (MCP) server that enables AI assistants to manage n8n workflows seamlessly. Connect your AI tools directly to n8n for automated workflow creation, execution, and management.

## 📚 Table of Contents

- [What is this?](#-what-is-this)
- [Key Features](#-key-features)
- [Requirements](#-requirements)
- [Installation & Usage](#-installation--usage)
- [Configuration](#️-configuration)
- [MCP Client Setup](#-mcp-client-setup)
- [Available Tools](#️-available-tools)
- [Usage Examples](#-usage-examples)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-frequently-asked-questions)
- [Contributing](#-contributing)
- [License](#-license)
- [Useful Links](#-useful-links)

## 📖 Additional Documentation

- **[🚀 Getting Started Guide](GETTING_STARTED.md)** - Quick setup in under 5 minutes
- **[💼 Real-World Use Cases](USE_CASES.md)** - E-commerce, data processing, API integrations, and more
- **[🔍 Comparison with Alternatives](COMPARISON.md)** - vs Zapier, Make.com, n8n Web UI, and CLI
- **[🔧 Comprehensive Troubleshooting](TROUBLESHOOTING.md)** - Solutions for common issues and problems

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

## 🚀 Installation & Usage

### Method 1: Smithery.ai (Hosted - Recommended)

Use the hosted version on Smithery.ai - no installation required:

1. **Visit**: [smithery.ai](https://smithery.ai)
2. **Search**: "n8n-workflow-builder"
3. **Connect**: Configure with your n8n host and API key
4. **Use**: Access from any MCP-compatible AI assistant

**Benefits**: No local setup, automatic updates, professional hosting, tool playground.

### Method 2: NPX (Local)

Run locally with NPX:

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

## ❓ Frequently Asked Questions

### What is an MCP Server?

A **Model Context Protocol (MCP) server** is a standardized way for AI assistants to access external tools and data sources. This MCP server specifically provides AI assistants with the ability to interact with n8n workflows, enabling automated workflow management through natural language commands.

### How do I connect AI assistants to n8n workflows?

This MCP server acts as a bridge between AI assistants (like Claude Desktop, Cline, or ChatGPT) and your n8n instance. Simply:
1. Install the MCP server: `npx @makafeli/n8n-workflow-builder`
2. Configure your AI assistant's MCP settings with your n8n credentials
3. Start using natural language to manage your n8n workflows

### Which AI assistants work with this MCP server?

The server works with any **MCP-compatible AI assistant**, including:
- **Claude Desktop** (Anthropic)
- **Cline** (VS Code extension)
- **Continue** (VS Code extension)
- Any custom MCP client implementation
- Future MCP-compatible AI assistants

### Can I use this with n8n Cloud or only self-hosted?

This MCP server works with **both n8n Cloud and self-hosted instances**. You just need:
- Your n8n instance URL (cloud or self-hosted)
- A valid n8n API key with appropriate permissions
- Network access from where you're running the MCP server

### What can AI assistants do with my n8n workflows?

AI assistants can perform **complete workflow management** including:
- **List and browse** existing workflows
- **Create new workflows** with complex node configurations
- **Execute workflows** manually or on-demand
- **Activate/deactivate** workflows
- **Update and modify** existing workflows
- **Monitor execution status** and retrieve detailed logs
- **Manage workflow tags** and organization
- **Generate security audits** and compliance reports

### Is this secure? What permissions does it need?

The MCP server uses **n8n's official API** with proper authentication:
- Requires a valid n8n API key (you control the permissions)
- No data is stored by the MCP server
- All communication is direct between your AI assistant and n8n
- Follows n8n's security model and access controls
- You can revoke access anytime by disabling the API key

### How is this different from using n8n's web interface?

This MCP server enables **AI-powered workflow management**:
- **Natural language commands** instead of clicking through UI
- **Automated workflow creation** based on descriptions
- **Bulk operations** across multiple workflows
- **Integration with AI assistant workflows** and automation
- **Voice commands** through AI assistants
- **Contextual help** and suggestions from AI

🔍 **Detailed Comparison**: See our [Comparison Guide](COMPARISON.md) for detailed comparisons with n8n Web UI, CLI, Zapier, and Make.com.

### Can I automate workflow creation with AI?

Yes! This is one of the key features. You can:
- **Describe workflows in natural language** and have AI create them
- **Generate workflows from requirements** or use cases
- **Modify existing workflows** through conversational commands
- **Create workflow templates** and variations automatically
- **Batch create similar workflows** with different parameters

💼 **Real Examples**: Check out our [Use Cases Guide](USE_CASES.md) for specific automation examples across different industries.

### What if I encounter issues or errors?

Common solutions:
1. **Check your n8n API key** - ensure it's valid and has proper permissions
2. **Verify n8n instance URL** - make sure it's accessible and correct
3. **Review the troubleshooting section** above for specific error messages
4. **Check GitHub Issues** for known problems and solutions
5. **Enable debug mode** with `DEBUG=n8n-workflow-builder` for detailed logs

🔧 **Comprehensive Help**: See our [Troubleshooting Guide](TROUBLESHOOTING.md) for detailed solutions to common issues.

### How do I get started quickly?

**Fastest setup:**
1. **Use Smithery.ai hosted version** (no installation): [smithery.ai](https://smithery.ai)
2. **Or run locally**: `npx @makafeli/n8n-workflow-builder`
3. **Configure your AI assistant** with your n8n credentials
4. **Start with simple commands** like "list my workflows" or "show me workflow details"

📖 **Detailed Guide**: See our [Getting Started Guide](GETTING_STARTED.md) for step-by-step setup instructions.

### Can I contribute or customize this MCP server?

Absolutely! This is an **open-source project**:
- **Fork the repository** for customizations
- **Submit pull requests** for improvements
- **Report issues** or request features on GitHub
- **Extend functionality** by adding new MCP tools
- **Share use cases** and examples with the community

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

<!-- Structured Data for SEO -->
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "n8n Workflow Builder MCP Server",
  "description": "AI assistant integration for n8n workflow automation through the Model Context Protocol (MCP). Connect Claude Desktop, ChatGPT, and other AI assistants to n8n for natural language workflow management.",
  "url": "https://github.com/makafeli/n8n-workflow-builder",
  "downloadUrl": "https://www.npmjs.com/package/@makafeli/n8n-workflow-builder",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Cross-platform",
  "programmingLanguage": "TypeScript",
  "author": {
    "@type": "Person",
    "name": "makafeli",
    "url": "https://github.com/makafeli"
  },
  "license": "https://github.com/makafeli/n8n-workflow-builder/blob/main/LICENSE",
  "keywords": [
    "n8n",
    "MCP",
    "AI assistant",
    "workflow automation",
    "Claude Desktop",
    "ChatGPT",
    "Model Context Protocol"
  ],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "softwareRequirements": "Node.js 18.0.0 or higher",
  "releaseNotes": "https://github.com/makafeli/n8n-workflow-builder/releases",
  "codeRepository": "https://github.com/makafeli/n8n-workflow-builder"
}
```
