import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import indexRoute from "./routes/index-routes";
dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use("/api", indexRoute);
app.get("/", (req: Request, res: Response) => {
  return res.status(200).send("Connected");
});
app.listen(PORT, () => {
  console.log(`Connected to PORT : ${PORT}`);
});

export default app;
