import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  SERVER_PORT,
  UPLOADTHING_APP_ID,
  UPLOADTHING_SECRET
} from "@constants/envVars";
import swaggerUi from "swagger-ui-express";
import specs from "../swagger";
import userRoutes from "@routes/userRoutes";
import authRoutes from "@routes/authRoutes";
import { logErrorMiddleware, returnError } from "@middlewares/errorMiddleware";
import { createUploadthingExpressHandler } from "uploadthing/express";
import { ourFileRouter } from "@controllers/imageController";
import { badRequestRes, fetchSuccess } from "@helpers/httpResponseGenerator";

dotenv.config();

if (!process.env.SERVER_PORT) {
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json()); // used to get data from JSON type
app.use(express.urlencoded({ extended: true })); // used to get data from URL or form data

app.get("/", (_request: Request, res: Response) => {
  fetchSuccess(res, "Server is up.");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);
app.use(
  "/api/uploadthing",
  createUploadthingExpressHandler({
    router: ourFileRouter,
    config: {
      uploadthingId: UPLOADTHING_APP_ID,
      uploadthingSecret: UPLOADTHING_SECRET
    }
  })
);

app.use(logErrorMiddleware);
app.use(returnError);

app.use("*", (_req: Request, res: Response) => {
  badRequestRes(res, "The request URL is invalid.");
});

app.listen(SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server spinning at http://localhost:${SERVER_PORT}`);
});
