import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SERVER_PORT } from "@constants/envVars";
import swaggerUi from "swagger-ui-express";
import specs from "../swagger";
import userRoutes from "@routes/userRoutes.ts";
import authRoutes from "@routes/authRoutes.ts";

dotenv.config();

if (!process.env.SERVER_PORT) {
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json()); // used to get data from JSON type
app.use(express.urlencoded({ extended: true })); // used to get data from URL or form data

app.get("/", (_request: Request, response: Response) => {
  response.status(200).json({ message: "Server is up!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("*", (_req: Request, res: Response) => {
  res.status(400).json({ message: "Invalid request URL!" });
});

app.listen(SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server spinning at http://localhost:${SERVER_PORT}`);
});
