import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from the root .env.development.local file
dotenv.config({ path: "../.env.development.local" });

const COUNT_PORT = process.env.COUNT_PORT || 7000;
const API_USERNAME = process.env.API_USERNAME || "user";
const API_PASSWORD = process.env.API_PASSWORD || "pass";

// Debug logging
console.log("Setting up theCount API with auth:", {
  username: API_USERNAME,
  password: "********", // Don't log the actual password
  baseURL: `http://localhost:${COUNT_PORT}`,
});

export const theCount = axios.create({
  baseURL: `http://localhost:${COUNT_PORT}`,
  auth: {
    username: API_USERNAME,
    password: API_PASSWORD,
  },
  timeout: 5000, // Add timeout to prevent hanging requests
});

// Add error handling middleware
theCount.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Error in Count-FAKEula API call:", error.message);
    
    // Enhance error message for better debugging
    if (error.code === 'ECONNREFUSED') {
      console.error("Could not connect to Count-FAKEula. Is it running?");
      error.isConnectionError = true;
    }
    
    return Promise.reject(error);
  }
);
