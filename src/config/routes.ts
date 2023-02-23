import { Express } from "express";

import gatewayRoutes from "../routes/gateway.route";

export const setupRoutes = (app: Express): void => {
  app.use("/api/gateway", gatewayRoutes);
};
