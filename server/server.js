import express from "express";
import router from "./router.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.text());
app.use(express.json());

app.use("/v1", router);

export default app;
