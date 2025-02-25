import express from "express";
import router from "./router.js";

const app = express();

app.use(express.text());

app.use("/v1", router);

export default app;
