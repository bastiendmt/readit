import cookieParser from "cookie-parser";
import dotven from "dotenv";
import express from "express";
import morgan from "morgan";
import "reflect-metadata";
import { createConnection } from "typeorm";
import trim from "./middleware/trim";
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";


dotven.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

app.get("/", (_, res) => res.send("Hello World"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);

  try {
    await createConnection();
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
});
