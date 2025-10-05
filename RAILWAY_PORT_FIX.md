# Railway PORT Configuration Fix

## Problem

The n8n-workflow-builder was failing to deploy on Railway with the error:
```
Application failed to respond
```

## Root Cause

The documentation instructed users to manually set the `PORT` environment variable to `1937`:

```bash
USE_HTTP=true
PORT=1937  # ❌ This causes deployment to fail!
N8N_HOST=${{n8n.RAILWAY_PUBLIC_DOMAIN}}
N8N_API_KEY=<your-api-key>
```

**Why this fails on Railway:**

1. Railway automatically assigns a dynamic port (e.g., 8080, 9000, etc.) to each service
2. Railway sets the `PORT` environment variable to this assigned port
3. Railway routes external traffic to this assigned port
4. When you manually set `PORT=1937`, you override Railway's automatic PORT assignment
5. Your application binds to port 1937, but Railway routes traffic to the assigned port
6. Railway's health checks fail because they check the assigned port, not 1937
7. The deployment is marked as failed with "Application failed to respond"

## Solution

**DO NOT set the PORT environment variable on Railway!**

Railway manages the PORT variable automatically. The application code already handles this correctly:

```typescript
// src/http-server.ts
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 1937;
```

This means:
- **On Railway**: Uses Railway's assigned PORT (e.g., 8080)
- **Local Development**: Defaults to 1937 if PORT is not set

## Correct Configuration

### For Railway Deployment

Only set these environment variables:

```bash
USE_HTTP=true
N8N_HOST=${{n8n.RAILWAY_PUBLIC_DOMAIN}}
N8N_API_KEY=<your-api-key>
```

**DO NOT include PORT!** Railway will set it automatically.

### For Local Development

You can optionally set PORT for local testing:

```bash
PORT=1937 USE_HTTP=true N8N_HOST=http://localhost:5678 N8N_API_KEY=test_key node build/main.cjs
```

Or just use the default (1937):

```bash
USE_HTTP=true N8N_HOST=http://localhost:5678 N8N_API_KEY=test_key node build/main.cjs
```

## Files Updated

The following files were updated to remove hardcoded PORT configuration:

1. **RAILWAY_DEPLOYMENT_CHECKLIST.md**
   - Removed `PORT=1937` from Step 4 environment variables
   - Added warning not to set PORT manually
   - Updated service settings documentation

2. **railway-template.json**
   - Removed `"PORT": "1937"` from workflow-builder environment
   - Removed `"ports": [1937]` from workflow-builder configuration

3. **railway-template-postgres.json**
   - Removed `"PORT": "1937"` from workflow-builder environment
   - Removed `"ports": [1937]` from workflow-builder configuration

4. **ENVIRONMENT_VARIABLES.md**
   - Added clear warning about not setting PORT on Railway
   - Explained PORT behavior for local development

5. **RAILWAY_ENV_TEMPLATE.md**
   - Removed PORT=1937 example
   - Added explanation of Railway's automatic PORT management

6. **DEPLOYMENT_FIX_SUMMARY.md**
   - Documented the PORT configuration issue as Issue #1
   - Updated verification checklist

## Testing

The fix was tested with Railway-like environment variables:

```bash
$ PORT=8080 USE_HTTP=true RAILWAY_ENVIRONMENT=production \
  N8N_HOST=example.up.railway.app N8N_API_KEY=test_key \
  node build/main.cjs

Starting N8N Workflow Builder in HTTP mode...
N8N Workflow Builder HTTP Server v0.10.3 running on port 8080
Health check: http://localhost:8080/health
```

Health check test:
```bash
$ curl -s http://localhost:8080/health | jq .
{
  "status": "healthy",
  "service": "n8n-workflow-builder",
  "version": "0.10.3",
  "n8nHost": "https://example.up.railway.app",
  "copilotEnabled": false,
  "aiEnabled": false,
  "timestamp": "2025-10-01T17:00:04.707Z"
}
```

✅ Application binds to Railway's assigned port (8080)
✅ Health endpoint responds correctly
✅ All tests pass (78 tests)

## Verification

After deploying to Railway, verify:

1. **Check Railway Logs**
   ```
   N8N Workflow Builder HTTP Server v0.10.3 running on port [Railway-assigned-port]
   ```
   Note: The port number will be whatever Railway assigned (e.g., 8080, 9000, etc.), NOT 1937

2. **Check Environment Variables**
   - `USE_HTTP=true` ✓
   - `N8N_HOST` is set ✓
   - `N8N_API_KEY` is set ✓
   - `PORT` should NOT be in your manual configuration (Railway sets it automatically)

3. **Test Health Endpoint**
   Visit: `https://your-service.railway.app/health`
   
   Should return:
   ```json
   {
     "status": "healthy",
     "service": "n8n-workflow-builder",
     "version": "0.10.3",
     ...
   }
   ```

4. **Check Service Status**
   - Service should show "Active" in Railway dashboard
   - No "Application failed to respond" errors
   - Health checks passing

## Key Takeaways

1. **Never manually set PORT on Railway** - Railway manages this automatically
2. **The application code handles PORT correctly** - Uses Railway's PORT when available, defaults to 1937 for local development
3. **Railway routes traffic based on its assigned PORT** - Not the port you specify in environment variables
4. **This was the primary cause of "Application failed to respond" errors**

## Reference

For the official n8n Railway deployment, see: https://railway.com/deploy/n8n

The official n8n template does not manually set PORT either - it lets Railway manage it automatically.

## Support

If you continue to see "Application failed to respond" after this fix:

1. Verify you removed PORT from your Railway environment variables
2. Check Railway build logs for errors
3. Check Railway service logs for startup errors
4. Verify N8N_HOST and N8N_API_KEY are set correctly
5. Verify the n8n service is accessible
6. Check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide

## Date

This fix was applied on: October 1, 2025
