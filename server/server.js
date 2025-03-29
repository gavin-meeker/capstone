import express from "express";
import router from "./router.js";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());
// TODO: need to conditionally use morgan based on if environment is PROD or DEV
app.use(morgan("dev"));
app.use(express.text());
app.use(express.json());

app.use("/v1", router);

export default app;
