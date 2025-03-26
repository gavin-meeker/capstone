import { Router } from "express";
import iocTable from "./handlers/iocTable.js";
import extract from "./handlers/extract.js";
import theCountEndpoint from "./handlers/theCountEndpoint.js";
import iocsToCsv from "./handlers/iocsToCsv.js";

const router = Router();

router.post("/ioc-table", iocTable);
router.post("/extract", extract);
router.post("/thecount/*", theCountEndpoint);
router.post("/iocsToCsv", iocsToCsv);

export default router;
