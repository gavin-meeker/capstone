import axios from "axios";

const port = process.env.COUNT_PORT || 7000;

export const theCount = axios.create({
  baseURL: `http://localhost:${port}`,
  auth: {
    username: process.env.API_USERNAME,  // Changed from USERNAME
    password: process.env.API_PASSWORD,  // Changed from PASSWORD
  },
});
