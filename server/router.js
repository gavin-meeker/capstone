import { Router } from "express";
import iocTable from "./handlers/iocTable.js";
import extract from "./handlers/extract.js";
import theCountEndpoint from "./handlers/theCountEndpoint.js";

const router = Router();

// Handler for IOC extraction from text
router.post("/extract", extract);

// Handler for IOC security logs
router.post("/ioc-table", iocTable);

// Proxy to the Count-FAKEula API
router.post("/thecount/*", theCountEndpoint);
router.get("/thecount/*", theCountEndpoint);

// Error handling for specific routes
router.use((err, req, res, next) => {
  console.error(`Router error in ${req.path}:`, err);
  if (err.isConnectionError) {
    return res.status(503).json({
      error: true,
      message: "Cannot connect to Count-FAKEula. Please ensure it's running.",
      details: err.message
    });
  }
  next(err);
});

export default router;