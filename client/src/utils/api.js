import axios from "axios";

// TODO: need to grab this port number from the config
export const api = axios.create({
  baseURL: "http://localhost:8080/v1",
});
