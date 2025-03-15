import axios from "axios";

// TODO: need to grab this port number from the config
export const theCount = axios.create({
  baseURL: "http://localhost:7000",
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});
