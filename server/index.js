// TODO: need to have better deployment strategy for dev vs prod
import dotnev from "dotenv";
dotnev.config({ path: ".env.development.local" });

import express from "express";
import iocTable from "./endpoints/iocTable.js";
import extract from "./endpoints/extract.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.text());

const { default: theCount } = await import("./theCountApi.js"); // Correct import

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ioc-table", iocTable);

app.post("/extract", extract);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
