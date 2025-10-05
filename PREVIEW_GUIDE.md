# 🚀 Quick Preview Guide

This guide will help you quickly preview and test the n8n Workflow Builder MCP Server in your browser.

## 🎯 What You'll See

When you run the preview, you'll launch the HTTP server and open it in your default browser. The server provides:

- **Health Check Endpoint** (`/health`) - Verify the server is running
- **Service Information** (`/`) - View server details and available endpoints
- **MCP Endpoint** (`/mcp`) - The main Model Context Protocol endpoint for AI assistants

## 🚀 Launch Methods

### Method 1: Quick Launch Scripts (Recommended)

Choose the script for your platform:

#### Windows
```cmd
preview.bat
```

#### Linux/Mac
```bash
./preview.sh
```

#### Cross-Platform (Node.js)
```bash
node preview.cjs
```

### Method 2: Manual Launch

```bash
# Install dependencies (if needed)
npm install

# Build the project
npm run build

# Start the server on port 3000
PORT=3000 USE_HTTP=true npm start
```

Then open your browser to: http://localhost:3000

## 📋 What the Scripts Do

The launch scripts automatically:

1. ✅ Check if Node.js and npm are installed
2. ✅ Detect if dependencies need to be installed (checks for `node_modules/`)
3. ✅ Install dependencies if needed (`npm install`)
4. ✅ Build the project (`npm run build`)
5. ✅ Start the HTTP server on port 3000
6. ✅ Open your default browser to http://localhost:3000

## 🔍 Testing the Server

Once the server is running, you can test various endpoints:

### Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "n8n-workflow-builder",
  "version": "0.10.3",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Service Info
```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "service": "N8N Workflow Builder MCP Server",
  "version": "0.10.3",
  "description": "HTTP-enabled MCP server for n8n workflow management",
  "endpoints": {
    "health": "/health",
    "mcp": "/mcp"
  }
}
```

### MCP Initialize Request
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    }
  }'
```

## ⚙️ Configuration

The server uses these default settings for preview mode:

- **Port**: 3000
- **Host**: 0.0.0.0 (accessible from all network interfaces)
- **Mode**: HTTP (not stdio)
- **N8N Host**: http://localhost:5678 (default, can be configured)

To connect to a different n8n instance:

```bash
# Windows
set N8N_HOST=https://your-n8n-instance.com
set N8N_API_KEY=your_api_key
preview.bat

# Linux/Mac
N8N_HOST=https://your-n8n-instance.com N8N_API_KEY=your_api_key ./preview.sh
```

## 🛑 Stopping the Server

Press `Ctrl+C` in the terminal to stop the server.

## 🔧 Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can change it:

```bash
# Windows
set PORT=3001
preview.bat

# Linux/Mac
PORT=3001 ./preview.sh
```

### Dependencies Not Installing

Try manually installing dependencies:

```bash
npm install
```

### Build Errors

Ensure you have Node.js 18.0.0 or higher:

```bash
node --version
```

### Browser Doesn't Open

The scripts will still start the server. Manually open your browser to:
- http://localhost:3000

## 📖 Next Steps

After previewing the server:

1. **Deploy to Railway**: See [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md)
2. **Configure for Production**: See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
3. **Set up with Claude Desktop**: See [GETTING_STARTED.md](./GETTING_STARTED.md)
4. **Explore Use Cases**: See [USE_CASES.md](./USE_CASES.md)

## 🆘 Getting Help

- **Troubleshooting Guide**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **GitHub Issues**: https://github.com/makafeli/n8n-workflow-builder/issues
- **Documentation**: See README.md for full documentation
