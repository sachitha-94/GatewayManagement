import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectToDatabase } from "./config/databaseConnection";
import { setupRoutes } from "./config/routes";

dotenv.config();

const HOST = process.env.HOST || "";
const PORT = parseInt(process.env.PORT || "");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

setupRoutes(app);

app.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Application started on URL ${HOST}:${PORT}`);
});

export default app;
