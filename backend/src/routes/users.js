import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { deleteUser, getStatsById, getUserInfoById, resetLevel, resetStats } from "../controllers/users.js";

export const userRouter = Router()

userRouter.get("/getStatsById", verifyAccessToken, getStatsById)
userRouter.get("/getUserInfoById", verifyAccessToken, getUserInfoById)
userRouter.patch("/resetStats", verifyAccessToken, resetStats)
userRouter.patch("/resetLevel", verifyAccessToken, resetLevel)
userRouter.delete("/deleteUser", verifyAccessToken, deleteUser)
