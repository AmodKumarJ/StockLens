import { Router } from "express";
import { getStockData } from "../controllers/stock.controller";

const router = Router();
router.get("/stocks/:symbol", getStockData);

export default router;
