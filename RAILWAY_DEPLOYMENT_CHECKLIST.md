# Railway Deployment Checklist

This checklist will help you successfully deploy the n8n-workflow-builder to Railway.

## Prerequisites

- [ ] Railway account created at [railway.app](https://railway.app)
- [ ] GitHub account connected to Railway
- [ ] This repository forked or accessible to Railway

## Deployment Steps

### Step 1: Deploy Database (Choose PostgreSQL or MySQL)

#### Option A: PostgreSQL (Recommended)

1. [ ] Create a new Railway project
2. [ ] Add PostgreSQL database from Railway templates
3. [ ] Set the following variables in PostgreSQL service:
   - `POSTGRES_DB=n8n`
   - `POSTGRES_USER=n8n`
   - `POSTGRES_PASSWORD=<your-secure-password>`
4. [ ] Wait for PostgreSQL to be healthy (check Railway dashboard)

#### Option B: MySQL (Alternative)

1. [ ] Create a new Railway project
2. [ ] Add MySQL database from Railway templates
3. [ ] Set the following variables in MySQL service:
   - `MYSQL_DATABASE=n8n`
   - `MYSQL_USER=n8n`
   - `MYSQL_PASSWORD=<your-secure-password>`
   - `MYSQL_ROOT_PASSWORD=<your-root-password>`
4. [ ] Wait for MySQL to be healthy (check Railway dashboard)

### Step 2: Deploy N8N Server

1. [ ] Add new service in Railway project
2. [ ] Select "Deploy from Docker Image"
3. [ ] Image: `n8nio/n8n:latest`
4. [ ] Configure environment variables:

**For PostgreSQL:**
```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=<your-admin-password>
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=${{postgres.RAILWAY_PRIVATE_DOMAIN}}
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=<match-postgres-password>
N8N_HOST=${{RAILWAY_PUBLIC_DOMAIN}}
WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}
N8N_PORT=5678
N8N_PROTOCOL=https
GENERIC_TIMEZONE=UTC
```

**For MySQL:**
```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=<your-admin-password>
DB_TYPE=mysqldb
DB_MYSQLDB_HOST=${{mysql.RAILWAY_PRIVATE_DOMAIN}}
DB_MYSQLDB_PORT=3306
DB_MYSQLDB_DATABASE=n8n
DB_MYSQLDB_USER=n8n
DB_MYSQLDB_PASSWORD=<match-mysql-password>
N8N_HOST=${{RAILWAY_PUBLIC_DOMAIN}}
WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}
N8N_PORT=5678
N8N_PROTOCOL=https
GENERIC_TIMEZONE=UTC
```

5. [ ] Wait for N8N to deploy and be healthy
6. [ ] Open N8N public URL and verify it loads
7. [ ] Login with admin credentials

### Step 3: Generate N8N API Key

1. [ ] Login to N8N UI at your Railway public URL
2. [ ] Go to Settings → API
3. [ ] Click "Create API Key"
4. [ ] Copy the API key (you won't see it again!)

### Step 4: Deploy N8N Workflow Builder

1. [ ] Add new service in Railway project
2. [ ] Select "Deploy from GitHub"
3. [ ] Select this repository
4. [ ] Configure environment variables:

```
USE_HTTP=true
N8N_HOST=${{n8n.RAILWAY_PUBLIC_DOMAIN}}
N8N_API_KEY=<paste-your-api-key>
```

**Important Notes:**
- Make sure to prefix the N8N_HOST with `https://` if it's not automatically added.
- **DO NOT** set the PORT variable - Railway sets this automatically.
- Railway will assign a port dynamically and route traffic to your application correctly.

5. [ ] Configure service settings:
   - Build Command: Automatically detected by nixpacks.toml
   - Start Command: `node build/main.cjs` (should be automatic)
   - Health Check Path: `/health`
   - Port: Automatically assigned by Railway (do not configure manually)

6. [ ] Deploy the service
7. [ ] Wait for deployment to complete

### Step 5: Verify Deployment

1. [ ] Check workflow-builder service logs for:
   ```
   N8N Workflow Builder HTTP Server v0.10.3 running on port 1937
   Health check: http://localhost:1937/health
   ```

2. [ ] Test health endpoint:
   - Open `https://<your-workflow-builder-url>/health`
   - Should see JSON response with `"status": "healthy"`

3. [ ] Test root endpoint:
   - Open `https://<your-workflow-builder-url>/`
   - Should see server information

## Troubleshooting

### Issue: "Application failed to respond"

**Possible causes:**

1. **Build failed:**
   - Check Railway build logs
   - Ensure nixpacks.toml is present
   - Verify package.json has correct build script

2. **Missing environment variables:**
   - Verify `USE_HTTP=true` is set
   - Verify `PORT` is set (Railway sets this automatically)
   - Verify `N8N_HOST` points to your n8n service
   - Verify `N8N_API_KEY` is set correctly

3. **N8N service not accessible:**
   - Check if n8n service is running
   - Verify n8n service has public domain
   - Test n8n URL directly in browser

4. **Start command incorrect:**
   - Should be: `node build/main.cjs`
   - Check Railway service settings

### Issue: Health check failing

1. **Port mismatch:**
   - Railway sets PORT automatically
   - Don't hardcode port in environment variables
   - Let Railway manage the PORT variable

2. **Server not starting:**
   - Check logs for errors
   - Verify build completed successfully
   - Check if `build/main.cjs` exists after build

### Issue: Can't connect to N8N

1. **API key invalid:**
   - Regenerate API key in N8N UI
   - Update workflow-builder service with new key
   - Redeploy workflow-builder

2. **N8N URL incorrect:**
   - Should use Railway public domain variable
   - Should include https:// prefix
   - Format: `https://<service-name>.up.railway.app`

3. **Network connectivity:**
   - Check if services are in same project
   - Verify service dependencies are set correctly

## Service Dependencies

Configure dependencies in Railway:

```
PostgreSQL/MySQL
    ↓
   N8N
    ↓
Workflow Builder
```

This ensures services start in the correct order.

## Security Recommendations

1. [ ] Use strong passwords for database
2. [ ] Use strong password for N8N admin
3. [ ] Keep API key secret
4. [ ] Enable Railway's environment protection
5. [ ] Use Railway's private networking for service communication
6. [ ] Consider enabling Railway's custom domains
7. [ ] Enable backup for database volumes

## Next Steps After Deployment

1. [ ] Access N8N UI and create workflows
2. [ ] Test workflow-builder API endpoints
3. [ ] Configure MCP client (Claude Desktop, etc.)
4. [ ] Set up monitoring (Railway provides metrics)
5. [ ] Configure backup strategy

## Support

If you continue to have issues:

1. Check Railway build logs
2. Check service logs for errors
3. Review [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) for detailed configuration
4. Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
5. Open an issue on GitHub with:
   - Railway build logs
   - Service logs
   - Environment variables (redacted sensitive values)
   - Error messages

## Quick Deploy Button

For one-click deployment, use the Railway template:

- PostgreSQL version: Use `railway-template-postgres.json`
- MySQL version: Use `railway-template.json`

Click "Deploy on Railway" button in README.md
