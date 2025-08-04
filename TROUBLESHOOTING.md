# 🔧 Troubleshooting Guide for n8n Workflow Builder MCP Server

**Comprehensive solutions for common issues when connecting AI assistants to n8n workflows.**

## 🚨 Quick Diagnostic Commands

Before diving into specific issues, try these diagnostic commands with your AI assistant:

```
"Test my n8n connection"
"Show me the server status"
"List my workflows" (basic connectivity test)
"What's my n8n instance information?"
```

## 🔌 Connection Issues

### "Connection Refused" or "ECONNREFUSED"

**Symptoms:**
- Cannot connect to n8n instance
- Timeout errors when trying to list workflows
- "Network unreachable" messages

**Solutions:**

1. **Verify n8n Instance is Running**
   ```bash
   # Check if n8n is accessible
   curl -I https://your-n8n-instance.com
   ```

2. **Check N8N_HOST Configuration**
   - ✅ Correct: `https://your-n8n.com`
   - ✅ Correct: `http://localhost:5678`
   - ❌ Wrong: `your-n8n.com` (missing protocol)
   - ❌ Wrong: `https://your-n8n.com/` (trailing slash)

3. **Network Connectivity**
   - Test from browser: Visit your n8n instance URL
   - Check firewall settings
   - Verify VPN/proxy configuration

4. **Port Configuration**
   - Default n8n port: 5678
   - n8n Cloud: Use full HTTPS URL
   - Self-hosted: Include custom port if different

**AI Assistant Command to Test:**
```
"Check if my n8n instance at [your-url] is accessible"
```

### "Unauthorized" or "401 Authentication Error"

**Symptoms:**
- "Invalid API key" messages
- "Unauthorized access" errors
- Can connect but cannot perform actions

**Solutions:**

1. **Verify API Key Format**
   - ✅ Correct: `n8n_api_1234567890abcdef...`
   - ❌ Wrong: Missing `n8n_api_` prefix
   - ❌ Wrong: Truncated or incomplete key

2. **Check API Key Permissions**
   - Ensure key has workflow management permissions
   - Verify key hasn't expired
   - Test key with direct API call:
   ```bash
   curl -H "X-N8N-API-KEY: your-api-key" https://your-n8n.com/api/v1/workflows
   ```

3. **Regenerate API Key**
   - Go to n8n Settings → API Keys
   - Delete old key and create new one
   - Update MCP server configuration

**AI Assistant Command to Test:**
```
"Verify my n8n API key permissions"
```

### "Workflow Not Found" or "404 Error"

**Symptoms:**
- Specific workflows cannot be accessed
- "Workflow ID does not exist" messages
- Some workflows visible, others not

**Solutions:**

1. **List All Workflows First**
   ```
   "List all my n8n workflows with their IDs"
   ```

2. **Check Workflow ID Format**
   - Use exact ID from workflow list
   - IDs are typically numeric or UUID format
   - Case-sensitive in some configurations

3. **Verify Workflow Permissions**
   - Ensure API key has access to specific workflows
   - Check if workflow is in different project/workspace

## 🚀 Installation and Setup Issues

### "Server Won't Start" or "Module Not Found"

**Symptoms:**
- MCP server fails to launch
- "Cannot find module" errors
- "Command not found" messages

**Solutions:**

1. **Check Node.js Version**
   ```bash
   node --version  # Must be 18.0.0 or higher
   ```

2. **Clear npm Cache**
   ```bash
   npm cache clean --force
   ```

3. **Reinstall Package**
   ```bash
   npm uninstall -g @makafeli/n8n-workflow-builder
   npm install -g @makafeli/n8n-workflow-builder
   ```

4. **Use NPX Instead**
   ```bash
   npx @makafeli/n8n-workflow-builder
   ```

### "Permission Denied" Errors

**Symptoms:**
- Cannot install package globally
- "EACCES" permission errors
- Installation fails with permission issues

**Solutions:**

1. **Use NPX (Recommended)**
   ```bash
   npx @makafeli/n8n-workflow-builder
   ```

2. **Fix npm Permissions**
   ```bash
   # Configure npm to use different directory
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Use Node Version Manager**
   ```bash
   # Install nvm and use it to manage Node.js
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

## 🤖 AI Assistant Integration Issues

### Claude Desktop Configuration Problems

**Symptoms:**
- MCP server not appearing in Claude Desktop
- "Server failed to start" in Claude
- Configuration not loading

**Solutions:**

1. **Check Configuration File Location**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Validate JSON Syntax**
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

3. **Restart Claude Desktop**
   - Completely quit Claude Desktop
   - Wait 10 seconds
   - Restart application

4. **Check Environment Variables**
   - Ensure no quotes around environment values
   - Verify special characters are properly escaped
   - Test with minimal configuration first

### Cline (VS Code) Integration Issues

**Symptoms:**
- MCP server not recognized in Cline
- "Failed to connect to MCP server" errors
- Tools not appearing in Cline interface

**Solutions:**

1. **Update Cline Extension**
   - Ensure latest version of Cline is installed
   - Check VS Code extension updates

2. **Verify MCP Configuration**
   - Check Cline settings for MCP server configuration
   - Ensure configuration matches expected format

3. **Restart VS Code**
   - Reload VS Code window
   - Restart VS Code completely if needed

## 🔧 Workflow Operation Issues

### "Workflow Creation Failed"

**Symptoms:**
- AI cannot create new workflows
- "Invalid workflow configuration" errors
- Workflows created but not functional

**Solutions:**

1. **Simplify Workflow Request**
   ```
   "Create a simple webhook workflow with just a trigger and HTTP response"
   ```

2. **Check Node Availability**
   - Verify required nodes are installed in n8n
   - Update n8n to latest version for node compatibility

3. **Validate Workflow Structure**
   - Ensure proper node connections
   - Check required parameters are provided

### "Execution Failed" or "Workflow Won't Run"

**Symptoms:**
- Workflows created but fail to execute
- "Node execution error" messages
- Partial workflow execution

**Solutions:**

1. **Check Node Configuration**
   ```
   "Show me the configuration of my [workflow-name] workflow"
   ```

2. **Test Individual Nodes**
   - Execute workflow step by step
   - Identify failing node

3. **Review Error Logs**
   ```
   "Show me the execution logs for workflow [workflow-id]"
   ```

## 🐛 Debug Mode and Logging

### Enable Debug Mode

**For Detailed Logging:**
```bash
DEBUG=n8n-workflow-builder npx @makafeli/n8n-workflow-builder
```

**For Network Debugging:**
```bash
DEBUG=axios npx @makafeli/n8n-workflow-builder
```

**For Full Debug Output:**
```bash
DEBUG=* npx @makafeli/n8n-workflow-builder
```

### Common Debug Patterns

**Connection Issues:**
```
DEBUG: Attempting connection to https://your-n8n.com
DEBUG: Request headers: { 'X-N8N-API-KEY': 'n8n_api_...' }
ERROR: ECONNREFUSED - Connection refused
```

**Authentication Issues:**
```
DEBUG: API request to /api/v1/workflows
DEBUG: Response status: 401
ERROR: Unauthorized - Invalid API key
```

## 📞 Getting Additional Help

### Self-Diagnosis Checklist

Before seeking help, verify:
- ✅ Node.js version 18.0.0 or higher
- ✅ n8n instance is accessible via browser
- ✅ API key is valid and has proper permissions
- ✅ MCP server configuration is correct
- ✅ AI assistant is properly configured

### AI Assistant Diagnostic Commands

```
"Run a full diagnostic of my n8n MCP setup"
"Test all my n8n workflow tools"
"Show me my current n8n configuration"
"Verify my API key permissions"
```

### Community Resources

1. **GitHub Issues**: [Report bugs and get help](https://github.com/makafeli/n8n-workflow-builder/issues)
2. **n8n Community**: [General n8n support](https://community.n8n.io/)
3. **MCP Documentation**: [Model Context Protocol docs](https://modelcontextprotocol.io/)
4. **Claude Desktop Support**: [Anthropic support](https://support.anthropic.com/)

### Creating Effective Bug Reports

When reporting issues, include:

1. **Environment Information**
   - Operating system and version
   - Node.js version
   - n8n version and hosting type (cloud/self-hosted)
   - AI assistant type and version

2. **Configuration Details**
   - MCP server configuration (remove sensitive data)
   - Environment variables (remove API keys)
   - Debug logs (if available)

3. **Steps to Reproduce**
   - Exact commands or requests made
   - Expected vs actual behavior
   - Error messages (full text)

4. **Diagnostic Output**
   ```bash
   # Include output from these commands
   node --version
   npm list -g @makafeli/n8n-workflow-builder
   DEBUG=n8n-workflow-builder npx @makafeli/n8n-workflow-builder
   ```

## 🎯 Prevention Tips

### Best Practices

1. **Regular Updates**
   - Keep n8n instance updated
   - Update MCP server package regularly
   - Update AI assistant applications

2. **Configuration Management**
   - Use environment files for credentials
   - Document your configuration
   - Test configuration changes in development first

3. **Monitoring**
   - Set up basic monitoring for n8n instance
   - Monitor API key usage and permissions
   - Track workflow execution success rates

4. **Backup and Recovery**
   - Export important workflows regularly
   - Document custom configurations
   - Keep API key backup in secure location

---

**Still having issues? Ask your AI assistant: "Help me troubleshoot my n8n MCP server connection"** 🔧
