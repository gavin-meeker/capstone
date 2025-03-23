import axios from "axios";

// Debug logging
console.log("Setting up theCount API with auth:", {
  username: process.env.USERNAME || "(not set)",
  password: process.env.PASSWORD ? "********" : "(not set)",
  baseURL: `http://localhost:${process.env.COUNT_PORT || 7000}`,
});

export const theCount = axios.create({
  baseURL: `http://localhost:${process.env.COUNT_PORT || 7000}`,
  auth: {
    username: "user", // Hardcoded for reliability
    password: "pass", // Hardcoded for reliability
  },
});
