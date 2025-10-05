# Environment Variables for Railway Deployment

## Option 1: MySQL Database

### Service: MySQL Database

```bash
MYSQL_ROOT_PASSWORD=secure_root_password_here
MYSQL_DATABASE=n8n
MYSQL_USER=n8n
MYSQL_PASSWORD=secure_n8n_password_here
```

### Service: N8N Server (MySQL)

```bash
# Authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_admin_password_here

# Database Connection (MySQL)
DB_TYPE=mysqldb
DB_MYSQLDB_HOST=${{mysql.RAILWAY_PRIVATE_DOMAIN}}
DB_MYSQLDB_PORT=3306
DB_MYSQLDB_DATABASE=n8n
DB_MYSQLDB_USER=n8n
DB_MYSQLDB_PASSWORD=secure_n8n_password_here

# URLs (Railway will populate these)
N8N_HOST=${{RAILWAY_PUBLIC_DOMAIN}}
WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}
N8N_PORT=5678
N8N_PROTOCOL=https
GENERIC_TIMEZONE=UTC
```

## Option 2: PostgreSQL Database (Recommended)

### Service: PostgreSQL Database

```bash
POSTGRES_DB=n8n
POSTGRES_USER=n8n
POSTGRES_PASSWORD=secure_n8n_password_here
```

### Service: N8N Server (PostgreSQL)

```bash
# Authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_admin_password_here

# Database Connection (PostgreSQL)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=${{postgres.RAILWAY_PRIVATE_DOMAIN}}
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=secure_n8n_password_here

# URLs (Railway will populate these)
N8N_HOST=${{RAILWAY_PUBLIC_DOMAIN}}
WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}
N8N_PORT=5678
N8N_PROTOCOL=https
GENERIC_TIMEZONE=UTC
```

## Service: N8N Workflow Builder

```bash
# HTTP Mode
USE_HTTP=true

# Connection to N8N
N8N_HOST=${{n8n.RAILWAY_PUBLIC_DOMAIN}}
N8N_API_KEY=your_api_key_from_n8n_ui

# Port - DO NOT SET THIS ON RAILWAY
# Railway automatically assigns and manages the PORT variable
# Only set PORT for local development (defaults to 1937)
```

## Notes

1. **Railway Variables**: Variables like `${{postgres.RAILWAY_PRIVATE_DOMAIN}}` or `${{mysql.RAILWAY_PRIVATE_DOMAIN}}` are automatically populated by Railway
2. **PORT Variable**: **DO NOT SET PORT on Railway** - Railway automatically assigns a port and sets the PORT environment variable. Only set PORT for local development.
3. **API Key**: Must be generated in N8N UI after deployment
4. **Passwords**: Should be secure and unique for production
5. **Dependencies**: Services must be deployed in order: Database (PostgreSQL/MySQL) → N8N → Workflow Builder
6. **Database Choice**: PostgreSQL is recommended for better performance and features, but MySQL is also supported for compatibility