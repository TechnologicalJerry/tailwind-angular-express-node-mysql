import { Express, Request, Response } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";

function routes(app: Express) {
  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  // API Routes
  app.use("/api/users", userRoutes);
  app.use("/api/sessions", authRoutes);
  app.use("/api/products", productRoutes);
}

export default routes;
