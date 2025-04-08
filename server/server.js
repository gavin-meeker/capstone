import express from "express";
import router from "./router.js";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./handlers/errorHandler.js";

const app = express();

app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "production") {
  app.use(morgan("common"));
} else {
  app.use(morgan("tiny"));
}

app.use(express.text());
app.use(express.json());
console.log("hello");
console.log("hello");
console.log("hello");
console.log("hello");
console.log("hello");
console.log("hello");
app.use(errorHandler);

app.use("/v1", router);

export default app;
