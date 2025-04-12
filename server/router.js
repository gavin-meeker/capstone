import { Router } from "express";
import iocTable from "./handlers/iocTable.js";
import extract from "./handlers/extract.js";
import theCountEndpoint from "./handlers/theCountEndpoint.js";
import iocsToCsv from "./handlers/iocsToCsv.js";
import axios from "axios";
const router = Router();
router.post("/ioc-table", iocTable);
router.post("/extract", extract);
router.post("/thecount/*", theCountEndpoint);
router.post("/iocsToCsv", iocsToCsv);
router.get("/oil/:ioc", async (req, res) => {
  const { ioc } = req.params;

  try {
    const response = await axios.get(`http://localhost:8000/oil/${ioc}`, {
      auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Proxy error:", error.message);
    res.status(500).json({ error: "Failed to fetch logs from theCount" });
  }
});
export default router;
