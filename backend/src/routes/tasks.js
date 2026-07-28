import { Router } from "express";
import { addSubTask, changeDifficult, changeName, changeStatus, changeTime, createTask, deleteAllTasksByUser, deleteSubTask, deleteTask, duplicateTask, getTasks, getTasksByDay, handleAtributes, reOrderTasks, rescheduleTask, toggleCompleted, updateSubTask } from "../controllers/tasks.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";

export const taskRouter = Router()

taskRouter.get("/get", getTasks)
taskRouter.get('/getTasksByDay', verifyAccessToken, getTasksByDay)
taskRouter.post("/add", verifyAccessToken, createTask)
taskRouter.patch("/changeDifficult/:id", verifyAccessToken, changeDifficult)
taskRouter.patch("/changeStatus/:id", verifyAccessToken, changeStatus)
taskRouter.patch("/handleAtributes/:id", verifyAccessToken, handleAtributes)
taskRouter.patch("/complete/:id", verifyAccessToken, toggleCompleted)
taskRouter.patch("/changeName/:id", verifyAccessToken, changeName)
taskRouter.patch("/changeTime/:id", verifyAccessToken, changeTime)
taskRouter.delete("/delete/:id", verifyAccessToken, deleteTask)
taskRouter.patch("/reschedule/:id", verifyAccessToken, rescheduleTask)
taskRouter.post("/addSubTask/:id", verifyAccessToken, addSubTask)
taskRouter.patch("/updateSubTask/:taskId/:subTaskId", verifyAccessToken, updateSubTask)
taskRouter.delete("/deleteSubTask/:taskId/:subTaskId", verifyAccessToken, deleteSubTask)
taskRouter.patch("/reOrder", verifyAccessToken, reOrderTasks)
taskRouter.post("/duplicateTask/:id", verifyAccessToken, duplicateTask)
taskRouter.delete("/deleteAllTasksByUser", verifyAccessToken, deleteAllTasksByUser)