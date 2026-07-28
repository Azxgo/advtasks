import { Router } from "express";
import { createItem, deleteItem, getItems, ReOrderItem, updateItem, updateProgress } from "../controllers/items.js";

export const itemRouter = Router()

itemRouter.get("/getAll", getItems)
itemRouter.post("/add", createItem)
itemRouter.delete("/delete/:id", deleteItem)
itemRouter.put("/update/:id", updateItem)
itemRouter.patch("/reOrder", ReOrderItem)
itemRouter.patch("/progress/:id", updateProgress)