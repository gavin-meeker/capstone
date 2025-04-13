import axios from "axios";

const port = process.env.COUNT_PORT || 7000;

export const theCount = axios.create({
  baseURL: `http://localhost:${port}`,
  auth: {
    username: "user",
    password: "pass",
  },
});
