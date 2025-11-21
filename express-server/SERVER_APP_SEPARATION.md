# Server and App Separation Guide

This document explains the separation of server and app files for better code organization, testing, and maintainability.

## File Structure

```
src/
├── app.ts          # Express application configuration
├── server.ts       # Server startup and lifecycle management
├── routes.ts       # API routes
├── middleware/     # Custom middleware
├── controllers/    # Route handlers
├── models/         # Database models
├── services/       # Business logic
└── utils/          # Utility functions

tests/
└── app.test.ts     # Example test file
```

## Benefits of Separation

### 1. **Better Testability**
- You can now import and test the Express app without starting the server
- Unit tests can run faster without actual server startup
- Integration tests can use supertest with the app instance

### 2. **Improved Modularity**
- Clear separation of concerns
- App configuration is separate from server lifecycle
- Easier to maintain and modify

### 3. **Development Flexibility**
- Can run the app in different environments
- Better support for testing frameworks
- Easier to implement clustering or multiple server instances

## Files Breakdown

### `src/app.ts`
Contains the Express application configuration:
- Middleware setup (cors, json parsing, etc.)
- Route configuration
- Error handlers
- Returns the configured Express app instance

```typescript
import createApp from "./app";

const app = createApp();
// Now you can use the app for testing or other purposes
```

### `src/server.ts`
Handles server startup and lifecycle:
- Environment setup
- Database connections
- Server startup
- Graceful shutdown handling
- Metrics and monitoring setup

```typescript
import { startServer } from "./server";

// Start the server programmatically
await startServer();
```

## Usage Examples

### Development
```bash
npm run dev           # Start development server with hot reload
npm run build:watch   # Build TypeScript with watch mode
```

### Production
```bash
npm run build         # Build the TypeScript
npm start            # Start the production server
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test-db      # Test database connection
```

### Testing with Supertest
```typescript
import request from "supertest";
import createApp from "../src/app";

const app = createApp();

test("API endpoint", async () => {
  const response = await request(app)
    .get("/api/endpoint")
    .expect(200);
});
```

## Environment Variables

The server now supports graceful shutdown and better environment handling:

```bash
NODE_ENV=production    # Environment mode
PORT=5050             # Server port
DB_HOST=localhost     # Database host
DB_PORT=3306          # Database port
DB_USER=root          # Database user
DB_PASSWORD=          # Database password
DB_NAME=angular_express_node_mysql  # Database name
```

## Graceful Shutdown

The server now properly handles shutdown signals:
- `SIGTERM` - Termination request
- `SIGINT` - Interrupt from keyboard (Ctrl+C)

This ensures:
- Ongoing requests are completed
- Database connections are closed
- Resources are cleaned up properly

## Error Handling

Improved error handling with:
- Global error handler middleware
- 404 handler for unknown routes
- Development vs production error responses
- Proper error logging

## Health Check

Added a health check endpoint:
```
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Next Steps

To further improve the architecture, consider:

1. **Add Testing Dependencies:**
   ```bash
   npm install --save-dev jest @types/jest supertest @types/supertest ts-jest
   ```

2. **Configure Jest:**
   Create `jest.config.js`:
   ```javascript
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
   };
   ```

3. **Add Integration Tests:**
   Test the full API endpoints with database integration

4. **Add Docker Support:**
   Create Dockerfile for containerization

5. **Add Process Management:**
   Use PM2 or similar for production deployment

## Migration from Old Structure

If you're migrating from the old single-file structure:

1. ✅ **App configuration moved to `app.ts`**
2. ✅ **Server startup logic moved to `server.ts`**
3. ✅ **Added graceful shutdown**
4. ✅ **Added error handling**
5. ✅ **Added health check endpoint**
6. ✅ **Updated package.json scripts**

The API endpoints and functionality remain exactly the same - only the internal organization has improved.