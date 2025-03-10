import { Router } from "express";
import iocTable from "./handlers/iocTable.js";
import extract from "./handlers/extract.js";

const router = Router();

router.post("/ioc-table", iocTable);

router.post("/extract", extract);

export default router;
