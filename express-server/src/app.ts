import express, { Request, Response } from "express";
import responseTime from "response-time";
import cors from "cors";
import deserializeUser from "./middleware/deserializeUser";
import { restResponseTimeHistogram } from "./utils/metrics";
import routes from "./routes/index.routes";

function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Custom middleware
  app.use(deserializeUser);

  // Response time tracking middleware
  app.use(
    responseTime((req: Request, res: Response, time: number) => {
      if (req?.route?.path) {
        restResponseTimeHistogram.observe(
          {
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode,
          },
          time * 1000
        );
      }
    })
  );

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // API routes
  routes(app);

  // 404 handler - must be after all routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found" });
  });

  // Global error handler
  app.use((error: any, req: Request, res: Response, next: any) => {
    res.status(error.status || 500).json({
      error: error.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    });
  });

  return app;
}

export default createApp;