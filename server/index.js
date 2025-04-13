import "./config/index.js";
import app from "./server.js";

const port = process.env.EXPRESS_PORT || 8081;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
