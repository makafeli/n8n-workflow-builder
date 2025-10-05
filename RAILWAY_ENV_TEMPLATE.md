# Railway Environment Variables Template

This file contains the exact environment variables needed for each service in Railway.

## Service 1: PostgreSQL Database

Create a PostgreSQL service in Railway and set these variables:

```bash
POSTGRES_DB=n8n
POSTGRES_USER=n8n
POSTGRES_PASSWORD=your_secure_password_here
```

**Note:** Choose a strong password and save it securely. You'll need it for the N8N service.

---

## Service 2: N8N Server (with PostgreSQL)

Create an N8N service using Docker image `n8nio/n8n:latest` and set these variables:

```bash
# Authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_admin_password_here

# Database Configuration
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=${{postgres.RAILWAY_PRIVATE_DOMAIN}}
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=your_secure_password_here

# Server Configuration
N8N_HOST=${{RAILWAY_PUBLIC_DOMAIN}}
WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}
N8N_PORT=5678
N8N_PROTOCOL=https
GENERIC_TIMEZONE=UTC
```

**Important:** 
- Replace `your_admin_password_here` with a strong password
- Replace `your_secure_password_here` with the SAME password you used for PostgreSQL
- The `${{postgres.RAILWAY_PRIVATE_DOMAIN}}` and `${{RAILWAY_PUBLIC_DOMAIN}}` are Railway variables that get automatically populated

---

## Service 3: N8N Workflow Builder

Create a workflow-builder service from this GitHub repository and set these variables:

```bash
# Server Mode
USE_HTTP=true

# Port - DO NOT SET THIS - Railway manages the PORT automatically
# The application will use Railway's assigned port automatically

# N8N Connection
N8N_HOST=${{n8n.RAILWAY_PUBLIC_DOMAIN}}
N8N_API_KEY=your_n8n_api_key_here

# Optional: AI/Copilot Features (if you want AI assistance)
# OPENAI_API_KEY=your_openai_key_here
# COPILOT_ENABLED=true
```

**Important:**
- Replace `your_n8n_api_key_here` with the API key you generated in N8N UI
- The `${{n8n.RAILWAY_PUBLIC_DOMAIN}}` is a Railway variable that references your N8N service
- Make sure to prefix with `https://` if not automatically added
- **DO NOT SET PORT** - Railway automatically assigns and manages the PORT variable

**To get the N8N API key:**
1. Deploy N8N service first
2. Open N8N in browser using its public URL
3. Login with admin credentials
4. Go to Settings → API
5. Click "Create API Key"
6. Copy the key immediately (you won't see it again!)

---

## Alternative: MySQL Instead of PostgreSQL

If you prefer MySQL over PostgreSQL:

### Service 1: MySQL Database

```bash
MYSQL_ROOT_PASSWORD=your_root_password_here
MYSQL_DATABASE=n8n
MYSQL_USER=n8n
MYSQL_PASSWORD=your_n8n_password_here
```

### Service 2: N8N Server (with MySQL)

```bash
# Authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_admin_password_here

# Database Configuration
DB_TYPE=mysqldb
DB_MYSQLDB_HOST=${{mysql.RAILWAY_PRIVATE_DOMAIN}}
DB_MYSQLDB_PORT=3306
DB_MYSQLDB_DATABASE=n8n
DB_MYSQLDB_USER=n8n
DB_MYSQLDB_PASSWORD=your_n8n_password_here

# Server Configuration
N8N_HOST=${{RAILWAY_PUBLIC_DOMAIN}}
WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}
N8N_PORT=5678
N8N_PROTOCOL=https
GENERIC_TIMEZONE=UTC
```

---

## Service Dependencies

Configure in Railway project settings:

```
1. PostgreSQL/MySQL (no dependencies)
   ↓
2. N8N (depends on PostgreSQL/MySQL)
   ↓
3. Workflow Builder (depends on N8N)
```

This ensures services start in the correct order.

---

## Verification

After setting all variables and deploying:

1. **Check PostgreSQL/MySQL:**
   - Should show "Active" status in Railway dashboard
   - Check logs for successful startup

2. **Check N8N:**
   - Should show "Active" status
   - Visit the public URL
   - Should see N8N login page
   - Login with admin credentials

3. **Check Workflow Builder:**
   - Should show "Active" status
   - Visit `<url>/health` endpoint
   - Should return JSON: `{"status":"healthy",...}`
   - Check logs for: "N8N Workflow Builder HTTP Server v0.10.3 running on port 1937"

---

## Common Mistakes

1. ❌ **Forgetting to generate N8N API key before deploying workflow-builder**
   - ✅ Deploy N8N first, generate API key, then deploy workflow-builder

2. ❌ **Password mismatch between PostgreSQL and N8N**
   - ✅ Use the same password in both services

3. ❌ **Not setting USE_HTTP=true**
   - ✅ Always set USE_HTTP=true for Railway deployment

4. ❌ **Wrong N8N_HOST format**
   - ✅ Should be: `${{n8n.RAILWAY_PUBLIC_DOMAIN}}` (Railway will add https://)
   - ❌ Don't use: `http://localhost:5678`

5. ❌ **Missing service dependencies**
   - ✅ Configure dependencies: Database → N8N → Workflow Builder

---

## Security Best Practices

1. **Use strong passwords (minimum 16 characters)**
   ```
   Example: aB3$xY9#mN2@pQ7!zR5&wT8
   ```

2. **Don't commit API keys to Git**
   - Always set them in Railway environment variables
   - Never put them in code

3. **Enable Railway environment protection**
   - Prevents accidental variable deletion
   - Requires confirmation for changes

4. **Use Railway secrets for sensitive data**
   - API keys
   - Database passwords
   - Admin passwords

5. **Rotate API keys regularly**
   - Generate new key in N8N
   - Update workflow-builder service
   - Redeploy

---

## Need Help?

If you're still having issues:

1. Check [RAILWAY_DEPLOYMENT_CHECKLIST.md](./RAILWAY_DEPLOYMENT_CHECKLIST.md)
2. Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. Check Railway service logs for errors
4. Open an issue on GitHub with:
   - Service logs (redact sensitive info)
   - Environment variables (redact passwords/keys)
   - Error messages
