# 🚀 Railway Deployment Guide for Complete N8N Stack

This guide explains how to deploy a complete N8N automation stack on Railway, including the n8n server, database (MySQL or PostgreSQL), and n8n-workflow-builder MCP server.

> **Note:** This deployment has been simplified to match the standard Railway n8n pattern at https://railway.com/deploy/n8n. Advanced features like GitHub Copilot integration have been removed to focus on a clean, stable deployment. These features may be reintroduced in future versions.

## 🏗️ Architecture

The complete stack includes three services that work together. You can choose between PostgreSQL (recommended) or MySQL:

**Option 1: PostgreSQL Stack (Recommended)**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ PostgreSQL DB   │◄───┤   N8N Server    │◄───┤ Workflow Builder│
│   Port: 5432    │    │   Port: 5678    │    │   Port: 1937    │
│                 │    │                 │    │                 │
│ • Stores workflows  │ • Web UI         │    │ • MCP Server    │
│ • User data     │    │ • API endpoints │    │ • Tool access   │
│ • Executions    │    │ • Automations   │    │ • HTTP/stdio    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Option 2: MySQL Stack (Legacy)**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MySQL DB      │◄───┤   N8N Server    │◄───┤ Workflow Builder│
│   Port: 3306    │    │   Port: 5678    │    │   Port: 1937    │
│                 │    │                 │    │                 │
│ • Stores workflows  │ • Web UI         │    │ • MCP Server    │
│ • User data     │    │ • API endpoints │    │ • Tool access   │
│ • Executions    │    │ • Automations   │    │ • HTTP/stdio    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Deploy to Railway

### Option 1: One-Click Deploy (Recommended)

**PostgreSQL Version (Recommended):**
[![Deploy PostgreSQL Stack](https://railway.app/button.svg)](https://railway.app/new/template?template=https://raw.githubusercontent.com/Islamhassana3/n8n-workflow-builder/main/railway-template-postgres.json)

**MySQL Version (Legacy):**
[![Deploy MySQL Stack](https://railway.app/button.svg)](https://railway.app/new/template?template=https://raw.githubusercontent.com/Islamhassana3/n8n-workflow-builder/main/railway-template.json)

### Option 2: Manual Setup

Choose your preferred database:

#### PostgreSQL Setup (Recommended)

1. **Fork this repository** to your GitHub account

2. **Create a new Railway project**:
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your forked repository

3. **Deploy the services in order**:

   **Step 1: Deploy PostgreSQL Database**
   ```bash
   # Add PostgreSQL service
   railway add postgres
   
   # Set environment variables
   railway variables set POSTGRES_DB=n8n
   railway variables set POSTGRES_USER=n8n  
   railway variables set POSTGRES_PASSWORD=your_secure_n8n_password
   ```

   **Step 2: Deploy N8N Server**
   ```bash
   # Add n8n service
   railway add n8n
   
   # Set environment variables for n8n
   railway variables set N8N_BASIC_AUTH_ACTIVE=true
   railway variables set N8N_BASIC_AUTH_USER=admin
   railway variables set N8N_BASIC_AUTH_PASSWORD=your_admin_password
   railway variables set DB_TYPE=postgresdb
   railway variables set DB_POSTGRESDB_HOST=${{postgres.RAILWAY_PRIVATE_DOMAIN}}
   railway variables set DB_POSTGRESDB_PORT=5432
   railway variables set DB_POSTGRESDB_DATABASE=n8n
   railway variables set DB_POSTGRESDB_USER=n8n
   railway variables set DB_POSTGRESDB_PASSWORD=your_secure_n8n_password
   railway variables set N8N_HOST=${{RAILWAY_PUBLIC_DOMAIN}}
   railway variables set WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   ```

#### MySQL Setup (Legacy)

1. **Fork this repository** to your GitHub account

2. **Create a new Railway project**:
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your forked repository

3. **Deploy the services in order**:

   **Step 1: Deploy MySQL Database**
   ```bash
   # Add MySQL service
   railway add mysql
   
   # Set environment variables
   railway variables set MYSQL_ROOT_PASSWORD=your_secure_root_password
   railway variables set MYSQL_DATABASE=n8n
   railway variables set MYSQL_USER=n8n  
   railway variables set MYSQL_PASSWORD=your_secure_n8n_password
   ```

   **Step 2: Deploy N8N Server**
   ```bash
   # Add n8n service
   railway add n8n
   
   # Set environment variables for n8n
   railway variables set N8N_BASIC_AUTH_ACTIVE=true
   railway variables set N8N_BASIC_AUTH_USER=admin
   railway variables set N8N_BASIC_AUTH_PASSWORD=your_admin_password
   railway variables set DB_TYPE=mysqldb
   railway variables set DB_MYSQLDB_HOST=${{mysql.RAILWAY_PRIVATE_DOMAIN}}
   railway variables set DB_MYSQLDB_PORT=3306
   railway variables set DB_MYSQLDB_DATABASE=n8n
   railway variables set DB_MYSQLDB_USER=n8n
   railway variables set DB_MYSQLDB_PASSWORD=your_secure_n8n_password
   railway variables set N8N_HOST=${{RAILWAY_PUBLIC_DOMAIN}}
   railway variables set WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   ```

   **Step 3: Deploy Workflow Builder**
   ```bash
   # This repository (already added)
   railway variables set USE_HTTP=true
   railway variables set N8N_HOST=${{n8n.RAILWAY_PUBLIC_DOMAIN}}
   railway variables set N8N_API_KEY=your_api_key_here
   ```

## 🔧 Environment Variables

### PostgreSQL Service (Recommended)
| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `n8n` |
| `POSTGRES_USER` | N8N user | `n8n` |
| `POSTGRES_PASSWORD` | N8N user password | `secure_n8n_pass_123` |

### N8N Server Service (PostgreSQL)
| Variable | Description | Example |
|----------|-------------|---------|
| `N8N_BASIC_AUTH_ACTIVE` | Enable basic auth | `true` |
| `N8N_BASIC_AUTH_USER` | Admin username | `admin` |
| `N8N_BASIC_AUTH_PASSWORD` | Admin password | `admin_pass_123` |
| `DB_TYPE` | Database type | `postgresdb` |
| `DB_POSTGRESDB_HOST` | PostgreSQL host | `${{postgres.RAILWAY_PRIVATE_DOMAIN}}` |
| `DB_POSTGRESDB_PORT` | PostgreSQL port | `5432` |
| `DB_POSTGRESDB_DATABASE` | Database name | `n8n` |
| `DB_POSTGRESDB_USER` | Database user | `n8n` |
| `DB_POSTGRESDB_PASSWORD` | Database password | `secure_n8n_pass_123` |

### MySQL Service (Legacy)
| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_ROOT_PASSWORD` | Root password | `secure_root_pass_123` |
| `MYSQL_DATABASE` | Database name | `n8n` |
| `MYSQL_USER` | N8N user | `n8n` |
| `MYSQL_PASSWORD` | N8N user password | `secure_n8n_pass_123` |

### N8N Server Service (MySQL)
| Variable | Description | Example |
|----------|-------------|---------|
| `N8N_BASIC_AUTH_ACTIVE` | Enable basic auth | `true` |
| `N8N_BASIC_AUTH_USER` | Admin username | `admin` |
| `N8N_BASIC_AUTH_PASSWORD` | Admin password | `admin_pass_123` |
| `DB_TYPE` | Database type | `mysqldb` |
| `DB_MYSQLDB_HOST` | MySQL host | `${{mysql.RAILWAY_PRIVATE_DOMAIN}}` |
| `DB_MYSQLDB_PORT` | MySQL port | `3306` |
| `DB_MYSQLDB_DATABASE` | Database name | `n8n` |
| `DB_MYSQLDB_USER` | Database user | `n8n` |
| `DB_MYSQLDB_PASSWORD` | Database password | `secure_n8n_pass_123` |
| `N8N_HOST` | Public N8N URL | `${{RAILWAY_PUBLIC_DOMAIN}}` |
| `WEBHOOK_URL` | Webhook URL | `${{RAILWAY_PUBLIC_DOMAIN}}` |

### Workflow Builder Service
| Variable | Description | Example |
|----------|-------------|---------|
| `USE_HTTP` | Enable HTTP mode | `true` |
| `N8N_HOST` | N8N server URL | `${{n8n.RAILWAY_PUBLIC_DOMAIN}}` |
| `N8N_API_KEY` | N8N API key | `n8n_api_xxxxxxxxxxxxx` |

## 🔑 Getting Your N8N API Key

1. **Access your N8N instance**:
   - Go to your deployed N8N URL (found in Railway dashboard)
   - Login with the admin credentials you set

2. **Generate API Key**:
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Copy the generated key
   - Add it to Railway environment variables for the workflow-builder service

## 🧪 Testing Your Deployment

### 1. Test MySQL Connection
```bash
# Check if MySQL service is running
curl -f https://your-mysql-service.railway.app/health
```

### 2. Test N8N Server
```bash
# Test n8n health
curl -f https://your-n8n-service.railway.app/healthz

# Test n8n UI (should redirect to login)
curl -I https://your-n8n-service.railway.app
```

### 3. Test Workflow Builder
```bash
# Test health endpoint
curl https://your-workflow-builder.railway.app/health

# Should return:
{
  "status": "healthy",
  "service": "n8n-workflow-builder",
  "version": "0.10.3",
  "n8nHost": "https://your-n8n-service.railway.app",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🌐 Service URLs

After deployment, you'll have three services:

- **N8N Web UI**: `https://n8n-[project-id].up.railway.app`
- **Workflow Builder API**: `https://workflow-builder-[project-id].up.railway.app`
- **Database**: Internal only (`postgres.railway.internal:5432` or `mysql.railway.internal:3306`)

## 🛠️ Usage Examples

### Using with Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "n8n-workflow-builder": {
      "command": "npx",
      "args": ["@makafeli/n8n-workflow-builder"],
      "env": {
        "N8N_HOST": "https://your-n8n-service.railway.app",
        "N8N_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Using as HTTP API

```bash
# List workflows
curl -X POST https://your-workflow-builder.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "list_workflows",
      "arguments": {}
    }
  }'
```

## 🔧 Troubleshooting

### Common Issues

1. **"Connection refused" errors**:
   - Check that services are running in Railway dashboard
   - Verify environment variables are set correctly
   - Check service dependencies (Database → N8N → Workflow Builder)

2. **N8N can't connect to database**:
   - Verify database service (PostgreSQL/MySQL) is healthy
   - Check database environment variables match between services
   - Ensure database user has proper permissions
   - For PostgreSQL: Verify `DB_TYPE=postgresdb` and `DB_POSTGRESDB_*` variables
   - For MySQL: Verify `DB_TYPE=mysqldb` and `DB_MYSQLDB_*` variables

3. **Database connection timeout**:
   - PostgreSQL: Check `DB_POSTGRESDB_HOST=${{postgres.RAILWAY_PRIVATE_DOMAIN}}`
   - MySQL: Check `DB_MYSQLDB_HOST=${{mysql.RAILWAY_PRIVATE_DOMAIN}}`
   - Ensure database service is fully started before n8n starts

4. **Workflow Builder can't connect to N8N**:
   - Verify N8N service is running and accessible
   - Check N8N_HOST environment variable
   - Verify API key is valid

4. **API key issues**:
   - Generate new API key in N8N UI
   - Update environment variable in Railway
   - Restart workflow-builder service

### Debug Commands

```bash
# Check service logs
railway logs --service=mysql
railway logs --service=n8n
railway logs --service=workflow-builder

# Check environment variables
railway variables
```

## 🎯 Next Steps

1. **Access N8N UI** at your deployed URL
2. **Create workflows** using the visual editor
3. **Generate API key** for workflow-builder access
4. **Use with Claude Desktop** or other MCP clients
5. **Build automations** programmatically with the workflow builder

## 💡 Tips

- Use Railway's auto-scaling for production workloads
- Set up monitoring with Railway's metrics
- Use Railway's backup features for data protection  
- Consider using Railway's custom domains for production

## 🔗 Resources

- [N8N Documentation](https://docs.n8n.io/)
- [Railway Documentation](https://docs.railway.app/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Project Repository](https://github.com/makafeli/n8n-workflow-builder)