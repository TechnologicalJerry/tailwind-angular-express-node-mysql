# Express MySQL Migration Guide

This document outlines the migration from MongoDB to MySQL for the Express server.

## Changes Made

### 1. Dependencies Updated
- Removed: `mongoose` and `@types/mongoose`
- Added: `mysql2`
- Updated package name to `swagger-express-mysql-node`

### 2. Database Configuration
Updated `config/default.ts` to use MySQL connection parameters:
```typescript
database: {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "angular_express_node_mysql"
}
```

### 3. Database Connection
- Updated `src/utils/connect.ts` to use mysql2 instead of mongoose
- Exported `db` connection for use in models

### 4. Models Converted
All models converted from Mongoose schemas to MySQL query classes:

#### User Model (`src/models/user.model.ts`)
- Uses MySQL AUTO_INCREMENT id instead of MongoDB ObjectId
- Password hashing moved to static create method
- Added static methods: `create`, `findOne`, `findById`, `comparePassword`

#### Session Model (`src/models/session.model.ts`)
- Uses `user_id` foreign key instead of ObjectId reference
- Added static methods: `create`, `findOne`, `findById`, `updateOne`

#### Product Model (`src/models/product.model.ts`)
- Uses `user_id` foreign key instead of ObjectId reference
- Auto-generates `product_id` using nanoid
- Added static methods: `create`, `findOne`, `findOneAndUpdate`, `deleteOne`

### 5. Services Updated
- Removed mongoose-specific types and queries
- Updated to use new model interfaces and methods
- Removed `.toJSON()` and `.lean()` calls

### 6. Controllers Updated
- Changed `res.locals.user._id` to `res.locals.user.id`
- Updated field references from MongoDB format to MySQL format
- Changed `user` field to `user_id`, `productId` to `product_id`, etc.

### 7. Schema Documentation Updated
- Updated OpenAPI/Swagger documentation
- Changed field names and types to match MySQL structure
- Removed MongoDB-specific fields like `__v`

### 8. Database Schema
Created proper SQL schema in `schema.sql`:
- Users table with auto-increment id
- Sessions table with foreign key to users
- Products table with foreign key to users
- Proper indexes and constraints

## Setup Instructions

### 1. Install Dependencies
```bash
cd express-server
npm install
```

### 2. Setup MySQL Database
```bash
# Install MySQL server if not already installed
# Create the database and tables
mysql -u root -p < schema.sql
```

### 3. Configure Database Connection
Update the database configuration in `config/default.ts` or use environment variables:
```bash
# For production, set these environment variables
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=angular_express_node_mysql
```

### 4. Run the Server
```bash
npm run dev
```

## Key Differences from MongoDB

### Field Mapping
| MongoDB | MySQL |
|---------|--------|
| `_id` | `id` (AUTO_INCREMENT) |
| `user` (ObjectId) | `user_id` (INT) |
| `productId` | `product_id` |
| `userAgent` | `user_agent` |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |

### Query Differences
- No more `.lean()` or `.toJSON()` calls
- Manual SQL query building instead of mongoose query builder
- Explicit foreign key relationships
- Auto-increment primary keys instead of ObjectIds

### Migration Considerations
- All existing MongoDB data will need to be migrated to MySQL format
- ObjectIds will be replaced with auto-increment integers
- Foreign key relationships will need to be properly established
- Timestamps will use MySQL TIMESTAMP format

## API Endpoints
All endpoints remain the same, but response format will have updated field names:
- `POST /api/users` - Create user
- `POST /api/sessions` - Login
- `GET /api/sessions` - Get user sessions
- `DELETE /api/sessions` - Logout
- `POST /api/products` - Create product
- `GET /api/products/:productId` - Get product
- `PUT /api/products/:productId` - Update product
- `DELETE /api/products/:productId` - Delete product