import { Router } from "express";
import { getWeeklyStats } from "../controllers/dailyStats.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";

export const dailyStatsRouter = Router()

dailyStatsRouter.get("/week", verifyAccessToken, getWeeklyStats)