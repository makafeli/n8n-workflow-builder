# Railway 502 Error Fix

## Problem

The n8n-workflow-builder was experiencing 502 errors on Railway deployment. The service would start but all requests to the MCP endpoints would fail with 404 errors, leading to gateway timeouts and 502 responses.

## Root Cause

**Critical Bug**: The 404 fallback handler in `src/http-server.ts` was placed **before** the MCP route handlers in the Express.js middleware chain.

In Express.js, middleware and routes are executed in the order they are defined. When the 404 fallback was placed before the actual route handlers, it would catch ALL requests before they could reach the intended endpoints.

### Code Issue

**Before (Broken)**:
```typescript
// Line 1056 - 404 handler registered BEFORE MCP routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', ... });
});

// Lines 1071, 1141, 1154 - MCP routes that NEVER get reached
app.post('/mcp', async (req, res) => { ... });
app.get('/mcp', async (req, res) => { ... });
app.delete('/mcp', async (req, res) => { ... });
```

**After (Fixed)**:
```typescript
// MCP routes registered FIRST
app.post('/mcp', async (req, res) => { ... });
app.get('/mcp', async (req, res) => { ... });
app.delete('/mcp', async (req, res) => { ... });

// Line 1163 - 404 handler registered LAST
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', ... });
});
```

## Impact

This bug caused:
- ✅ **Fixed**: All `/mcp` requests returned 404 instead of being processed
- ✅ **Fixed**: MCP protocol initialization failed completely
- ✅ **Fixed**: Railway health checks potentially timing out
- ✅ **Fixed**: Service appeared broken even though it was running
- ✅ **Fixed**: 502 errors when clients tried to connect

## Solution

Moved the 404 fallback handler to the **end** of all route definitions. Added a comment warning that it must remain the last handler.

## Testing

### Automated Tests
- Created comprehensive test suite (`tests/integration/httpEndpoints.test.ts`)
- 6 new tests specifically for route ordering and 404 handling
- All 84 tests pass (78 original + 6 new)

### Manual Testing
```bash
# Test 1: Health endpoint works
curl http://localhost:3000/health
# ✅ Returns: {"status":"healthy",...}

# Test 2: Root endpoint works
curl http://localhost:3000/
# ✅ Returns: {"service":"N8N Workflow Builder MCP Server",...}

# Test 3: MCP endpoint works (THE FIX)
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize",...}'
# ✅ Before: 404 error
# ✅ After: Proper MCP initialization response

# Test 4: 404 handler still works
curl http://localhost:3000/invalid-route
# ✅ Returns: {"error":"Not Found",...}
```

## Files Changed

1. **src/http-server.ts**
   - Removed 404 handler from line 1056 (before routes)
   - Added 404 handler at line 1163 (after all routes)
   - Added comment warning about placement

2. **tests/integration/httpEndpoints.test.ts** (NEW)
   - 6 comprehensive tests for route ordering
   - Tests to prevent regression of this bug
   - Validates all MCP endpoints work correctly

## Verification After Deployment

After deploying to Railway, verify:

1. **Check Railway Logs**
   ```
   N8N Workflow Builder HTTP Server v0.10.3 running on port [Railway-port]
   Health check: http://localhost:[Railway-port]/health
   MCP endpoint: http://localhost:[Railway-port]/mcp
   ```

2. **Test Health Endpoint**
   ```bash
   curl https://your-service.railway.app/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "service": "n8n-workflow-builder",
     "version": "0.10.3"
   }
   ```

3. **Check Service Logs**
   - No 404 errors for `/mcp` requests
   - MCP sessions initializing correctly
   - Request logging shows proper routing

4. **Test MCP Connection**
   Use a MCP client to connect to the service. Should successfully initialize and list available tools.

## Prevention

To prevent this issue in the future:

1. **Code Review**: Always ensure 404 handlers are the LAST middleware registered
2. **Testing**: Run the new `httpEndpoints.test.ts` test suite
3. **Documentation**: Comment added in code warns about placement
4. **Local Testing**: Test with curl before deploying

## Related Issues

- Railway 502 errors
- "Application failed to respond" errors
- MCP endpoints returning 404
- Service health check failures

## References

- Express.js middleware ordering: https://expressjs.com/en/guide/using-middleware.html
- Railway deployment guide: [RAILWAY_DEPLOYMENT_CHECKLIST.md](./RAILWAY_DEPLOYMENT_CHECKLIST.md)
- Troubleshooting guide: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Date

This fix was applied on: October 1, 2025

## Test Results

```
Test Suites: 8 passed, 8 total
Tests:       84 passed, 84 total
```

All tests passing with no regressions. ✅
