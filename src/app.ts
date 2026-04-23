import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API is running 🚀 and the server is ready to handle requests!");
});

export default app;