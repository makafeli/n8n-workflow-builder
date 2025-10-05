# 🔗 Service Dependencies and Connection Flow

This document explains how the three services connect and depend on each other in the Railway deployment.

## 🏗️ Service Architecture

The n8n stack requires all three services to work together with proper dependencies:

```
Database (PostgreSQL/MySQL) → N8N Server → Workflow Builder
     ↓                            ↓              ↓
Stores data                   Uses DB          Calls N8N API
```

## 🔄 Connection Flow

### 1. Database → N8N Connection
- **PostgreSQL**: N8N connects using `DB_POSTGRESDB_HOST=${{postgres.RAILWAY_PRIVATE_DOMAIN}}`
- **MySQL**: N8N connects using `DB_MYSQLDB_HOST=${{mysql.RAILWAY_PRIVATE_DOMAIN}}`
- N8N waits for database to be healthy before starting
- Database stores workflows, executions, user data, credentials

### 2. N8N → Workflow Builder Connection
- Workflow Builder connects using `N8N_HOST=${{n8n.RAILWAY_PUBLIC_DOMAIN}}`
- Uses N8N API key for authentication: `N8N_API_KEY=your_generated_key`
- Workflow Builder waits for N8N to be healthy before starting

## 🚨 Common Deployment Issues

### Issue: Only N8N Service Deployed
**Problem**: Railway deploys only the workflow-builder service, missing database and n8n
**Solution**: Use the complete template files:
- For PostgreSQL: `railway-template-postgres.json`
- For MySQL: `railway-template.json`

### Issue: Services Not Connected
**Problem**: Services deploy but can't communicate
**Solution**: Check environment variables use Railway's internal domains:
- Database: Use `${{postgres.RAILWAY_PRIVATE_DOMAIN}}` or `${{mysql.RAILWAY_PRIVATE_DOMAIN}}`
- N8N: Use `${{n8n.RAILWAY_PUBLIC_DOMAIN}}` for external connections

### Issue: Wrong Database Configuration
**Problem**: N8N can't connect to database
**Solution**: Match database type and connection variables:

**PostgreSQL Configuration:**
```bash
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=${{postgres.RAILWAY_PRIVATE_DOMAIN}}
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=your_password
```

**MySQL Configuration:**
```bash
DB_TYPE=mysqldb
DB_MYSQLDB_HOST=${{mysql.RAILWAY_PRIVATE_DOMAIN}}
DB_MYSQLDB_PORT=3306
DB_MYSQLDB_DATABASE=n8n
DB_MYSQLDB_USER=n8n
DB_MYSQLDB_PASSWORD=your_password
```

## 🔧 Deployment Order

**Important**: Services must be deployed in this order for proper dependency resolution:

1. **Database Service** (postgres or mysql)
   - Creates database instance
   - Sets up user and permissions
   - Waits to become healthy

2. **N8N Service** (n8n)
   - Connects to database
   - Initializes schema if needed
   - Starts web interface
   - Waits to become healthy

3. **Workflow Builder Service** (workflow-builder)
   - Connects to N8N API
   - Provides MCP interface
   - Ready for AI assistant connections

## 🧪 Testing Connections

```bash
# 1. Test database connection
railway logs postgres  # or railway logs mysql

# 2. Test N8N connection to database
railway logs n8n
# Look for "Database connection successful" messages

# 3. Test Workflow Builder connection to N8N
railway logs workflow-builder
# Look for "Connected to N8N at https://..." messages

# 4. Test full stack
curl https://your-n8n.railway.app/healthz
curl https://your-workflow-builder.railway.app/health
```

## 🔄 Environment Variable Flow

```
postgres.RAILWAY_PRIVATE_DOMAIN → DB_POSTGRESDB_HOST → n8n connects to database
n8n.RAILWAY_PUBLIC_DOMAIN → N8N_HOST → workflow-builder connects to n8n
```

This ensures each service knows how to reach its dependencies using Railway's internal service discovery.