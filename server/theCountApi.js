import axios from "axios";

export const theCount = axios.create({
  baseURL: "http://localhost:7000",
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});
