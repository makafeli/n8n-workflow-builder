# Railway Deployment Fix

This document explains the changes made to support Railway deployment while maintaining backward compatibility with MCP clients that expect stdio transport.

## Problem

Railway expects a web server to be running and listening on a specific port (1937), but the original n8n-workflow-builder was only running as an MCP server using stdio transport, which doesn't listen on any port. This caused Railway to show "502 Bad Gateway" errors because there was no HTTP server to connect to.

## Solution

Added dual transport support with automatic environment detection:

### Changes Made

1. **New HTTP Server Implementation** (`src/http-server.ts`)
   - Full HTTP server using Express.js
   - Implements MCP Streamable HTTP transport
   - Supports all 23 existing MCP tools
   - Health check endpoint for Railway
   - Proper CORS support
   - Session management with graceful cleanup

2. **Smart Entry Point** (`src/main.ts`)
   - Automatically detects environment
   - Switches to HTTP mode when:
     - `USE_HTTP=true` environment variable is set
     - `PORT` environment variable is present (Railway sets this)
     - `RAILWAY_ENVIRONMENT` variable is present
   - Falls back to stdio mode for backward compatibility

3. **Updated Dependencies**
   - Added `express` and `cors` for HTTP server
   - Added TypeScript type definitions

### Environment Detection Logic

```javascript
const useHttp = process.env.USE_HTTP === 'true' || 
                process.env.PORT || 
                process.env.RAILWAY_ENVIRONMENT;
```

### Endpoints

When running in HTTP mode, the server provides:

- `GET /` - Server information and available endpoints
- `GET /health` - Health check for Railway (returns JSON status)
- `POST /mcp` - MCP protocol endpoint (JSON-RPC over HTTP)
- `GET /mcp` - Server-Sent Events stream for MCP clients
- `DELETE /mcp` - Session termination endpoint

### Usage

**Local stdio mode (default):**
```bash
npm start
# or
node build/main.cjs
```

**Local HTTP mode:**
```bash
npm run start:http
# or
USE_HTTP=true node build/main.cjs
# or
PORT=1937 node build/main.cjs
```

**Railway deployment:**
The server automatically detects Railway environment and starts in HTTP mode on the port specified by Railway.

### Backward Compatibility

- Existing MCP clients using stdio continue to work unchanged
- All 23 tools are available in both modes
- Same configuration (N8N_HOST, N8N_API_KEY) works for both modes
- Package.json main entry point updated but maintains same interface

## Testing

Both modes have been tested:
- ✅ stdio mode starts correctly and maintains MCP compatibility
- ✅ HTTP mode listens on specified port (1937 for Railway)
- ✅ Health check endpoint returns proper status
- ✅ MCP initialization works over HTTP with proper session management
- ✅ Environment detection works for Railway deployment

This solution provides Railway compatibility while maintaining full backward compatibility with existing MCP client setups.