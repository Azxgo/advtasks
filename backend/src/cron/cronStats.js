import cron from "node-cron"
import User from "../models/users.js"
import { DateTime } from "luxon"
import { addDailyStats } from "../controllers/users.js"
import { calculateMissingDays } from "../controllers/dailyStats.js"

cron.schedule("* * * * *", async () => {
    console.log("Ejecutando cierre diario de stats...")

    try {
        const users = await User.find(
            {},
            {
                _id: 1,
                timezone: 1
            }
        )

        for (const user of users) {
            const timezone = user.timezone

            if (!timezone) continue

            const now = DateTime.now().setZone(timezone)

            if (now.hour !== 0 || now.minute !== 0) {
                continue
            }

            console.log(
                `[${timezone}] Cerrando día para usuario ${user._id}`
            )

            await calculateMissingDays(user._id)
        }
        await addDailyStats()
    } catch (error) {
        console.error("CRON ERROR COMPLETO:")
        console.error(error)
        console.error(error.stack)
    }

})