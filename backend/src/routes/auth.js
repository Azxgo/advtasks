import { Router } from "express";
import { guest, login, logout, quitGuest, refresh, register } from "../controllers/auth.js";

export const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/refresh", refresh)
authRouter.post("/logout", logout)
authRouter.post("/guest", guest)
authRouter.post("/quitGuest", quitGuest)