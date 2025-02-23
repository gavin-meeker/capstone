import express from "express";
import fetch from "node-fetch";
import dotnev from "dotenv";
dotnev.config({ path: ".env" });
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ioc-table", async (req, res) => {
  const result = await fetch("http://localhost:7000/oil/1.2.3.4", {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString("base64")}`,
    },
  });
  res.send(await result.json());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
