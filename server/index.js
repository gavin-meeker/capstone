import "./config/index.js";
import app from "./server.js";

// For debugging environment variables
console.log("Authentication credentials:", {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  countPort: process.env.COUNT_PORT,
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
