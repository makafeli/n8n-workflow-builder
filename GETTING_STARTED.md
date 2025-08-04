# 🚀 Getting Started with n8n Workflow Builder MCP Server

**Quick start guide to connect your AI assistant to n8n workflows in under 5 minutes.**

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js v18.0.0+** installed
- **n8n instance** running (cloud or self-hosted)
- **n8n API key** with workflow permissions
- **MCP-compatible AI assistant** (Claude Desktop, Cline, etc.)

## ⚡ Quick Setup (Recommended)

### Option 1: Smithery.ai Hosted (Fastest)

1. **Visit** [smithery.ai](https://smithery.ai)
2. **Search** for "n8n-workflow-builder"
3. **Configure** with your n8n credentials:
   - n8n Host: `https://your-n8n-instance.com`
   - API Key: `n8n_api_your_key_here`
4. **Connect** to your AI assistant
5. **Test** with: "List my n8n workflows"

### Option 2: Local Installation

```bash
# Install and run
npx @makafeli/n8n-workflow-builder

# Or install globally
npm install -g @makafeli/n8n-workflow-builder
n8n-workflow-builder
```

## 🔑 Getting Your n8n API Key

### For n8n Cloud:
1. Login to your n8n Cloud instance
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the generated key

### For Self-hosted n8n:
1. Open your n8n instance
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Save the key securely

## 🤖 AI Assistant Configuration

### Claude Desktop Setup

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "n8n-workflow-builder": {
      "command": "npx",
      "args": ["@makafeli/n8n-workflow-builder"],
      "env": {
        "N8N_HOST": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Cline (VS Code) Setup

Add to your Cline MCP settings:

```json
{
  "mcpServers": {
    "n8n-workflow-builder": {
      "command": "npx",
      "args": ["@makafeli/n8n-workflow-builder"],
      "env": {
        "N8N_HOST": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 🧪 Test Your Setup

Try these commands with your AI assistant:

### Basic Commands
```
"List all my n8n workflows"
"Show me details of workflow [workflow-name]"
"Execute my [workflow-name] workflow"
```

### Advanced Commands
```
"Create a simple webhook workflow"
"Show me failed workflow executions"
"Activate all inactive workflows"
```

## 🎯 First Workflow Creation

Ask your AI assistant:

```
"Create a simple n8n workflow that:
1. Triggers every hour
2. Makes an HTTP request to check a website
3. Sends a notification if the site is down"
```

The AI will create, configure, and activate the workflow for you!

## 🔧 Common Configuration Issues

### "Connection Refused" Error
- **Check**: n8n instance is running and accessible
- **Verify**: N8N_HOST URL is correct (include `/api/v1` if needed)
- **Test**: Try accessing your n8n instance in a browser

### "Unauthorized" Error
- **Check**: API key is valid and not expired
- **Verify**: API key has proper permissions
- **Test**: Create a new API key if needed

### "Server Won't Start" Error
- **Check**: Node.js version (must be 18+)
- **Try**: `npm cache clean --force`
- **Reinstall**: `npm uninstall -g @makafeli/n8n-workflow-builder && npm install -g @makafeli/n8n-workflow-builder`

## 📚 Next Steps

1. **Explore Use Cases**: Check out [USE_CASES.md](USE_CASES.md) for real-world examples
2. **Learn Advanced Features**: Read the main [README.md](README.md) for all available tools
3. **Troubleshooting**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed help
4. **Compare Solutions**: Review [COMPARISON.md](COMPARISON.md) to understand advantages

## 💡 Pro Tips

- **Start Simple**: Begin with listing and viewing workflows before creating new ones
- **Use Natural Language**: Describe what you want in plain English
- **Iterate**: Ask the AI to modify workflows based on your feedback
- **Backup**: Always test new workflows before using them in production
- **Monitor**: Use execution monitoring to track workflow performance

## 🆘 Need Help?

- **Documentation**: [Full README](README.md)
- **Issues**: [GitHub Issues](https://github.com/makafeli/n8n-workflow-builder/issues)
- **Community**: [n8n Community](https://community.n8n.io/)
- **MCP Docs**: [Model Context Protocol](https://modelcontextprotocol.io/)

---

**Ready to automate? Start with "List my workflows" and let AI take over!** 🚀
