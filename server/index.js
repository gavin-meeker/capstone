import express from "express";
import dotnev from "dotenv";
import { iocTable } from "./endpoints/iocTable.js";
import extract from "./endpoints/extract.js";
dotnev.config({ path: ".env.development.local" });
const app = express();
const port = process.env.PORT || 3000;
app.use(express.text());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ioc-table", iocTable);

app.post("/extract", extract);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
