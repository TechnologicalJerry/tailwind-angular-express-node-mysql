# Router Structure Guide

This document explains the organized router structure for the Express server.

## File Organization

```
src/routes/
├── index.routes.ts     # Main router that imports all sub-routers
├── user.routes.ts      # User registration routes
├── auth.routes.ts      # Authentication/session routes  
├── product.routes.ts   # Product CRUD routes
└── README.md          # This documentation
```

## Router Files

### `index.routes.ts`
Main router file that:
- Imports all individual router modules
- Defines the healthcheck endpoint
- Mounts sub-routers on their respective base paths
- Exports the main routes function for use in app.ts

### `user.routes.ts`
Handles user registration:
- `POST /api/users` - Register new user

### `auth.routes.ts` 
Handles authentication and session management:
- `POST /api/sessions` - Login (create session)
- `GET /api/sessions` - Get user sessions (requires auth)
- `DELETE /api/sessions` - Logout (delete session, requires auth)

### `product.routes.ts`
Handles product CRUD operations:
- `POST /api/products` - Create product (requires auth)
- `GET /api/products/:productId` - Get single product
- `PUT /api/products/:productId` - Update product (requires auth)
- `DELETE /api/products/:productId` - Delete product (requires auth)

## Route Structure

Each router file follows this pattern:

```typescript
import { Router } from 'express';
import { controllerFunction } from '../controller/controller.file';
import middleware from '../middleware/middleware.file';
import { schema } from '../schema/schema.file';

const router = Router();

// Define routes with appropriate middleware and handlers
router.method('/path', [middleware, ...], handlerFunction);

export default router;
```

## Middleware Usage

### Authentication Middleware
- `requireUser` - Ensures user is authenticated
- Used on protected routes that require login

### Validation Middleware  
- `validateResource(schema)` - Validates request body against Zod schema
- Used on routes that accept user input

### Combined Middleware
Routes can use multiple middleware:
```typescript
router.post('/', [requireUser, validateResource(createSchema)], handler);
```

## API Endpoints

### Complete API Map
```
GET  /healthcheck          # Health check
POST /api/users            # Register user
POST /api/sessions         # Login
GET  /api/sessions         # Get sessions (auth required)
DELETE /api/sessions       # Logout (auth required)
POST /api/products         # Create product (auth required)
GET  /api/products/:id     # Get product
PUT  /api/products/:id     # Update product (auth required)
DELETE /api/products/:id   # Delete product (auth required)
```

### Response Formats

#### Success Response
```json
{
  "data": { ... },
  "status": "success"
}
```

#### Error Response
```json
{
  "error": "Error message",
  "status": "error"
}
```

## OpenAPI/Swagger Documentation

Each route includes OpenAPI documentation comments:

```typescript
/**
 * @openapi
 * '/api/endpoint':
 *  method:
 *    tags:
 *    - TagName
 *    summary: Brief description
 *    parameters: [...]
 *    requestBody: {...}
 *    responses: {...}
 */
```

This generates comprehensive API documentation accessible at `/docs`.

## Benefits of This Structure

### 1. **Separation of Concerns**
- Each router handles one logical domain
- Easy to locate and modify specific functionality
- Clear responsibility boundaries

### 2. **Maintainability**
- Adding new routes is straightforward
- Modifications are isolated to relevant files
- Easier code reviews and debugging

### 3. **Scalability**
- Easy to add new router modules
- Can extract complex routers to separate files
- Supports team development

### 4. **Testing**
- Each router can be tested independently
- Mock dependencies easily
- Focused unit tests

### 5. **Code Reusability**
- Middleware can be shared across routers
- Common patterns are easier to identify
- Consistent error handling

## Adding New Routes

### 1. Create Router File
```typescript
// src/routes/newfeature.routes.ts
import { Router } from 'express';
import { newFeatureHandler } from '../controller/newfeature.controller';

const router = Router();

router.get('/', newFeatureHandler);

export default router;
```

### 2. Import in Index
```typescript
// src/routes/index.routes.ts
import newFeatureRoutes from "./newfeature.routes";

function routes(app: Express) {
  // ... existing routes
  app.use("/api/newfeature", newFeatureRoutes);
}
```

### 3. Create Controller
```typescript
// src/controller/newfeature.controller.ts
export async function newFeatureHandler(req: Request, res: Response) {
  // Implementation
}
```

## Migration from Single File

The routes have been migrated from a single `routes.ts` file to organized modules:

✅ **Completed:**
- Split routes by functionality
- Maintained all existing endpoints
- Preserved OpenAPI documentation
- Updated imports in app.ts
- Added comprehensive error handling

📋 **Benefits:**
- Better code organization
- Easier maintenance and testing
- Clearer separation of concerns
- Improved developer experience

The API functionality remains exactly the same - only the internal organization has improved.