import express from "express";
import bodyParser from "body-parser";
import authRouter from "./app/auth.js";
import { client } from "./utils/database.js";
import cors from "cors";

async function init() {
  const app = express();
  const port = 4000;

  await client.connect();

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/auth", authRouter);

  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

init();
