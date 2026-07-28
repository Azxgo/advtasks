import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { createAutomation, deleteAutomation, getAutomationByTask } from "../controllers/automations.js";

export const automationRouter = Router()

automationRouter.post("/", verifyAccessToken, createAutomation)
automationRouter.get("/task/:taskId", verifyAccessToken, getAutomationByTask)
automationRouter.delete("/:taskId", verifyAccessToken, deleteAutomation)