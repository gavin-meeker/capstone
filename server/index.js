import "./config/index.js";
import app from "./server.js";

// Get port from environment variables
const port = process.env.EXPRESS_PORT || 3000;

// For debugging environment variables
console.log("Server configuration:", {
  expressPort: port,
  environment: process.env.NODE_ENV,
  countFakeula: {
    port: process.env.COUNT_PORT,
    auth: process.env.API_USERNAME ? "configured" : "missing",
  },
});

// Start the server
app.listen(port, () => {
  console.log(`SOC Investigation Tool API running on port ${port}`);
  console.log(`http://localhost:${port}/v1`);
});