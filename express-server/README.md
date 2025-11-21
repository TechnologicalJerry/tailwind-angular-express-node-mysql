# Express MySQL Node.js Server

A modern Express.js server with MySQL database integration, featuring proper separation of concerns, comprehensive API documentation, and production-ready architecture.

## 🚀 Features

- **Express.js** with TypeScript
- **MySQL** database integration with mysql2
- **Separated App and Server** for better testability
- **JWT Authentication** with refresh tokens
- **Swagger/OpenAPI** documentation
- **Prometheus Metrics** integration
- **Graceful Shutdown** handling
- **CORS** enabled
- **Input Validation** with Zod
- **Password Hashing** with bcrypt
- **Comprehensive Logging** with Pino

## 📁 Project Structure

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server startup and lifecycle
├── routes.ts           # API routes definition
├── controller/         # Route handlers
├── models/             # Database models
├── service/            # Business logic
├── middleware/         # Custom middleware
├── schema/             # Zod validation schemas
└── utils/              # Utility functions
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MySQL database**
   ```bash
   mysql -u root -p < schema.sql
   ```

4. **Configure environment**
   ```bash
   # Copy and modify configuration
   cp config/default.ts config/production.ts
   ```

## 🚦 Quick Start

### Development
```bash
npm run dev              # Start development server with hot reload
npm run build:watch      # Build TypeScript in watch mode
npm run test-db         # Test database connection
```

### Production
```bash
npm run build           # Build TypeScript
npm start              # Start production server
```

### Testing
```bash
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
```

## 📋 API Endpoints

### Authentication
- `POST /api/users` - Register new user
- `POST /api/sessions` - Login user
- `GET /api/sessions` - Get user sessions
- `DELETE /api/sessions` - Logout user

### Products
- `POST /api/products` - Create product
- `GET /api/products/:productId` - Get product
- `PUT /api/products/:productId` - Update product
- `DELETE /api/products/:productId` - Delete product

### Utilities
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics
- `GET /docs` - Swagger documentation

## 🔧 Configuration

Configuration is managed through the `config` directory:

```typescript
// config/default.ts
export default {
  port: 5050,
  database: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "angular_express_node_mysql"
  },
  saltWorkFactor: 10,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  // JWT keys...
};
```

### Environment Variables

```bash
NODE_ENV=production
PORT=5050
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=angular_express_node_mysql
```

## 📊 Database Schema

The application uses MySQL with the following tables:

- **users** - User accounts with email/password
- **sessions** - User authentication sessions
- **products** - Product catalog with user ownership

See `schema.sql` for complete database structure.

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Install testing dependencies
npm install --save-dev jest @types/jest supertest @types/supertest ts-jest

# Run tests
npm test
```

Example test:
```typescript
import request from "supertest";
import createApp from "../src/app";

const app = createApp();

test("Health check", async () => {
  const response = await request(app)
    .get("/health")
    .expect(200);
    
  expect(response.body.status).toBe("OK");
});
```

## 📚 Documentation

- **[MySQL Migration Guide](./MYSQL_MIGRATION.md)** - Migration from MongoDB
- **[Server-App Separation](./SERVER_APP_SEPARATION.md)** - Architecture explanation
- **Swagger Documentation** - Available at `/docs` when server is running

## 🔒 Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt
- **Input Validation** with Zod schemas
- **CORS** protection
- **SQL Injection** protection with parameterized queries

## 🚀 Deployment

### Docker (Recommended)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 5050
CMD ["node", "dist/server.js"]
```

### PM2
```bash
npm install -g pm2
npm run build
pm2 start dist/server.js --name "express-mysql-server"
```

## 📈 Monitoring

- **Health Check**: `GET /health`
- **Metrics**: `GET /metrics` (Prometheus format)
- **Logging**: Structured logging with Pino
- **Graceful Shutdown**: Proper cleanup on termination signals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npm run test-db

# Check MySQL service status
systemctl status mysql
```

### Development Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript compilation
npm run build
```

- [ ] [Set up project integrations](https://gitlab.com/technologicaljerry/swagger-express-mongoose-node-mongo/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
