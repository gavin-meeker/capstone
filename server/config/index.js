// TODO: need to have better deployment strategy for dev vs prod
import dotnev from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const config = dotnev.config({
  path: path.join(__dirname, "../../.env.development.local"),
});

if (config.error) {
  throw Error(config.error.message);
}
