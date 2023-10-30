import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_request: Request, response: Response) => {
  response.status(200).json({ message: "Server is up!" });
});

app.listen(PORT, () => {
  console.log(`Running a server at http://localhost:${PORT}`);
});
