import cron from "node-cron"
import User from "../models/users.js"
import { addDailyStats } from "../controllers/users.js"
import { calculateMissingDays } from "../controllers/dailyStats.js"

cron.schedule("0 0 * * *", async () => {
    console.log("Ejecutando cierre diario de stats...")

    try {
        const users = await User.find()

        for (const user of users) {
            await calculateMissingDays(user._id)
        }
        await addDailyStats()
    } catch (error) {
        console.error("CRON ERROR COMPLETO:")
        console.error(error)
        console.error(error.stack)
    }

}, {
    timezone: "America/Santiago"
})