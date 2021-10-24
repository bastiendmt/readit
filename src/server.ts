import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import trim from "./middleware/trim";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(morgan("dev"));
app.use(trim)

app.get("/", (_, res) => res.send("Hello World"));
app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);

  try {
    await createConnection();
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
});
