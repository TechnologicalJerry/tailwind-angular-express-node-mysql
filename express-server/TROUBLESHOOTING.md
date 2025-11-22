# Server Startup Troubleshooting Guide

This guide helps diagnose and fix common server startup issues.

## Quick Fixes Applied

### 1. ✅ Database Name Mismatch Fixed
- **Issue**: Config used `tailwind_angular_express_node_mysql` but schema used `angular_express_node_mysql`
- **Fix**: Updated config to use `angular_express_node_mysql`

### 2. ✅ Empty JWT Keys Fixed
- **Issue**: Empty JWT keys could cause authentication middleware to fail
- **Fix**: Added development RSA key pairs for testing

### 3. ✅ Enhanced Error Logging
- **Issue**: Generic error messages made debugging difficult
- **Fix**: Added detailed console logging to identify failure points

## Diagnostic Tools

### Run Diagnostics
```bash
# Test configuration only
npm run diagnostic

# Test basic server components
npm run minimal-test

# Test database connection
npm run test-db
```

### Alternative Methods (if PowerShell issues)
```cmd
# Using cmd directly
cd /d "d:\GitHub\tailwind-angular-express-node-mysql\express-server"
npx ts-node diagnostic.ts

# Or run the batch file
diagnostic.bat
```

## Common Issues & Solutions

### 1. Database Connection Issues
**Symptoms**: Server fails at database connection step

**Solutions**:
- Ensure MySQL service is running
- Check credentials in `config/default.ts`
- Run SQL schema: `mysql -u root -p < schema.sql`
- Test connection: `npm run test-db`

### 2. Missing Dependencies
**Symptoms**: Module import errors

**Solutions**:
```bash
npm install
npm audit fix
```

### 3. Port Already in Use
**Symptoms**: EADDRINUSE error

**Solutions**:
```bash
# Find process using port 5050
netstat -ano | findstr :5050

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### 4. TypeScript Compilation Issues
**Symptoms**: TypeScript errors during startup

**Solutions**:
```bash
npm run build
npx tsc --noEmit  # Check for type errors
```

### 5. JWT Key Issues
**Symptoms**: Authentication middleware errors

**Solutions**:
- Verify keys are present in config
- Regenerate keys if needed:
```bash
# Generate new RSA key pair
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
# Base64 encode for config
```

## Startup Process

The server follows this initialization sequence:

1. **Load Environment Variables** (`.env` file)
2. **Load Configuration** (`config/default.ts`)
3. **Create Express App** (`src/app.ts`)
4. **Connect Database** (`src/utils/connect.ts`)
5. **Start HTTP Server** (port from config)
6. **Start Metrics Server** (Prometheus)
7. **Setup Swagger Docs** (API documentation)

## Configuration Validation

Current configuration should have:
```typescript
{
  port: 5050,
  database: {
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "MSroot@ACER",
    database: "angular_express_node_mysql"
  },
  // JWT keys (now populated with development keys)
  accessTokenPrivateKey: "...",
  accessTokenPublicKey: "...",
  refreshTokenPrivateKey: "...",
  refreshTokenPublicKey: "..."
}
```

## Environment Setup

### Prerequisites
- Node.js 18+ installed
- MySQL server running
- Database created with schema
- Correct credentials in config

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup database
mysql -u root -p
CREATE DATABASE angular_express_node_mysql;
exit
mysql -u root -p < schema.sql

# 3. Test configuration
npm run diagnostic

# 4. Start server
npm run dev
```

## Development vs Production

### Development (current setup)
- Uses hardcoded JWT keys for testing
- Database password in config file
- Detailed console logging

### Production Requirements
- Move sensitive data to environment variables
- Generate unique JWT key pairs
- Remove console.log statements
- Enable HTTPS
- Use production database

## Next Steps After Fixing

1. **Test All Endpoints**:
   - GET /healthcheck
   - POST /api/users (registration)
   - POST /api/sessions (login)
   - Protected endpoints with JWT

2. **Verify Database**:
   - Check tables exist
   - Test CRUD operations
   - Verify foreign key constraints

3. **Test Authentication**:
   - Register user
   - Login and get tokens
   - Access protected routes
   - Token refresh flow

## Support

If issues persist:
1. Check the enhanced error messages in console
2. Run diagnostic tools
3. Verify MySQL connection manually
4. Check TypeScript compilation
5. Review configuration values

The server now provides detailed error information to help identify the exact point of failure.