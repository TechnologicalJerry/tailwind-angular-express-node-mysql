# Fullstack Product Store (Angular 21 + Express 5 + MySQL)

A modern, high-performance fullstack web application featuring an **Angular 21** frontend client connected to a **Node.js/Express 5** REST API backend powered by a **MySQL** database.

---

## 🌟 Key Features

### 🅰️ Angular 21 Client (`angular-client`)
- **Modern Architecture**: Built with Standalone Components, Angular Signals reactivity (`currentUser`, `toasts`, `products`, `filteredProducts`), and modern control flow (`@if`, `@for`).
- **Authentication**: JWT access token & refresh token lifecycle with state persisted in `localStorage`.
- **HTTP Interceptors**:
  - `authInterceptor`: Automatically attaches `Authorization: Bearer <accessToken>` and `x-refresh: <refreshToken>` headers to requests.
  - `errorInterceptor`: Captures auto-refreshed access tokens from response headers (`x-access-token`) and handles unauthenticated 401 statuses gracefully.
- **Route Guards & Resolvers**:
  - `authGuard`: Protects private routes (`/products/new`, `/products/:id/edit`, `/dashboard`).
  - `loginGuard`: Redirects authenticated users away from `/login` and `/signup`.
  - `productResolver`: Pre-fetches product details for view/edit routes.
- **Features**:
  - **Product Catalog**: Live search query filtering, max-price range slider, and card grid showcase.
  - **Product CRUD**: Create & edit form with 120-character live counter validation.
  - **Product Detail**: High-res preview, metadata, and publisher action toolbar.
  - **User Sessions Manager**: View active user sessions logged in Express and revoke sessions.
  - **Glassmorphic UI**: Custom dark theme design system with CSS variables, gradient text, toast alerts, and responsive media queries.

### 🚀 Express Backend Server (`express-server`)
- **TypeScript & Express 5**: Clean layer separation across Controllers, Services, Models, Routes, and Middleware.
- **Data Validation & Security**: Zod schema validation (`createUserSchema`, `createSessionSchema`, `productSchema`), bcrypt password hashing, and JWT signing/verification.
- **API Documentation & Metrics**: Integrated Swagger UI documentation (`/docs`) and Prometheus metrics server (`/metrics`).
- **MySQL Data Layer**: RowDataPacket and ResultSetHeader queries for `users`, `sessions`, and `products`.

---

## 📁 Repository Structure

```text
tailwind-angular-express-node-mysql/
├── angular-client/                # Angular 21 Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/        # authGuard, loginGuard
│   │   │   │   ├── interceptors/  # authInterceptor, errorInterceptor
│   │   │   │   ├── resolvers/     # productResolver
│   │   │   │   └── services/      # ApiService, AuthService, ProductsService, ToastService
│   │   │   ├── features/
│   │   │   │   ├── auth/          # Login & Signup components
│   │   │   │   ├── dashboard/     # Sessions dashboard component
│   │   │   │   ├── home/          # Product catalog grid component
│   │   │   │   ├── products/      # Product detail & form components
│   │   │   │   └── about/         # Stack documentation page
│   │   │   ├── app.config.ts      # HttpClient & Interceptor providers
│   │   │   ├── app.routes.ts      # App route definitions
│   │   │   ├── app.ts / app.html  # Main layout & navbar header
│   │   │   └── styles.scss        # Design system & dark theme utilities
├── express-server/                # Express 5 Node.js Backend API
│   ├── src/
│   │   ├── controller/            # user, session, product controllers
│   │   ├── middleware/            # deserializeUser, requireUser, validateResource
│   │   ├── models/                # MySQL ProductModel, SessionModel, UserModel
│   │   ├── routes/                # auth, user, product routes
│   │   ├── schema/                # Zod schemas
│   │   ├── service/               # Database query services
│   │   ├── app.ts                 # Express app initialization
│   │   └── server.ts              # HTTP & Metrics server startup
│   ├── schema.sql                 # Database table initialization script
│   └── MYSQL_MIGRATION.md         # Database migration guide
└── README.md                      # Project documentation
```

---

## 🔗 REST API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users` | Public | Register a new user (`name`, `email`, `password`, `passwordConfirmation`) |
| `POST` | `/api/sessions` | Public | Authenticate user & issue `{ accessToken, refreshToken }` |
| `GET` | `/api/sessions` | Private | Get active login sessions for authenticated user |
| `DELETE` | `/api/sessions` | Private | Revoke current user session / logout |
| `GET` | `/api/products` | Public | Get list of all products |
| `GET` | `/api/products/:productId` | Public | Get single product details by product ID |
| `POST` | `/api/products` | Private | Create product (`title`, `description`, `price`, `image`) |
| `PUT` | `/api/products/:productId` | Private (Owner) | Update existing product details |
| `DELETE` | `/api/products/:productId` | Private (Owner) | Delete product |

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js**: v18+ or v20+
- **MySQL**: Database instance running locally or remotely

### 1. Database Setup (`express-server`)
Import the `schema.sql` into your MySQL instance:
```bash
mysql -u root -p < express-server/schema.sql
```

Create a `.env` file inside `express-server/`:
```env
PORT=1337
HOST=localhost
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=express_app
JWT_SECRET=your_jwt_secret
```

### 2. Run Backend Server (`express-server`)
```bash
cd express-server
npm install
npm run dev
```
- **REST API**: Running at `http://localhost:1337`
- **Swagger Docs**: Available at `http://localhost:1337/docs`

### 3. Run Frontend Client (`angular-client`)
In a new terminal:
```bash
cd angular-client
npm install
npm start
```
- **Angular App**: Running at `http://localhost:4200`

---

## 🧪 Build & Test Commands

### Build Frontend & Backend
```bash
# Build Express Server
cd express-server && npm run build

# Build Angular Client
cd angular-client && npm run build
```