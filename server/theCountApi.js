import axios from "axios";
import { config } from "dotenv";
config({ path: ".env.development.local" });

export const theCount = axios.create({
  baseURL: "http://localhost:7000",
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});
