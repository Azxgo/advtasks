import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { itemRouter } from "./routes/items.js"
import { connectDB } from "./config/db.js"
import { taskRouter } from "./routes/tasks.js"
import { calculateMissingDays } from './controllers/dailyStats.js'
import { dailyStatsRouter } from "./routes/dailyStats.js"
import "./cron/cronTasks.js"
import "./cron/cronStats.js"
import "./cron/cronAutomation.js"
import "./cron/cronSession.js"
import { authRouter } from "./routes/auth.js"
import { userRouter } from "./routes/users.js"
import { automationRouter } from "./routes/automations.js"

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors({
    origin: ["http://localhost:5173", "https://advtasks.vercel.app"],
    credentials: true,
}));
app.use(express.json())

app.use("/api/item", itemRouter)
app.use("/api/tasks", taskRouter)
app.use("/api/dailystats", dailyStatsRouter)
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/automation", automationRouter)

app.listen(port, async () => {
    console.log(`server listening on port http://localhost:${port}`)

    await calculateMissingDays()
})

app.get("/api/cron/test", async (req, res) => {
    console.log("CRON TEST EJECUTADO", new Date());

    res.json({
        ok: true,
        date: new Date()
    });
});

