import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import getAllUsers from "./contollers/user";

dotenv.config();

if (!process.env.SERVER_PORT) {
  process.exit(1);
}

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json()); // used to get data from JSON type
app.use(express.urlencoded({ extended: true })); // used to get data from URL or form data

app.get("/", (_request: Request, response: Response) => {
  response.status(200).json({ message: "Server is up!" });
});

(async () => await getAllUsers())();

app.use("*", (_req: Request, res: Response) => {
  res.status(400).json({ message: "Invalid request URL!" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server spinning at http://localhost:${PORT}`);
});
