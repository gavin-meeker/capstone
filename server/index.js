// TODO: need to have better deployment strategy for dev vs prod
import dotnev from "dotenv";
dotnev.config({ path: ".env.development.local" });
import app from "./server.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
