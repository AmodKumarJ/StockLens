import { Router } from "express";
import { getPortfolio } from "../controllers/portfolio.controller";

const router = Router();

router.get("/portfolio", getPortfolio);

export default router;
