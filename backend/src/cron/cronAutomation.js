import cron from "node-cron"
import Automation from "../models/automations.js"
import Task from "../models/tasks.js"
import User from "../models/users.js"
import { DateTime } from "luxon"

cron.schedule("* * * * *", async () => {
    console.log("Ejecutando Automatizaciones...")

    try {
        const automations = await Automation.find({
            active: true,
        })

        for (const auto of automations) {

            const user = await User.findById(auto.userId)

            if (!user) continue

            const timezone = user.timezone || "UTC"

            const now = DateTime.now().setZone(timezone)

            const currentHour = now.hour
            const currentMinute = now.minute

            const tomorrow = now.plus({ days: 1 })

            const startOfDay = tomorrow.startOf("day")
            const endOfDay = tomorrow.endOf("day")

            const day = tomorrow.weekday

            if (!auto.daysOfWeek.includes(day)) continue

            if (
                auto.generationHour !== currentHour ||
                auto.generationMinute !== currentMinute
            ) continue

            if (
                auto.startDate &&
                DateTime.fromJSDate(auto.startDate)
                    .setZone(timezone) > tomorrow.endOf("day")
            ) {
                continue
            }

            if (
                auto.endDate &&
                DateTime.fromJSDate(auto.endDate)
                    .setZone(timezone) < tomorrow.startOf("day")
            ) {
                continue
            }

            const alreadyExists = await Task.findOne({
                userId: auto.userId,
                originalTaskId: auto.originalTaskId,
                date: { $gte: startOfDay, $lte: endOfDay }
            })

            if (alreadyExists) continue

            await Task.create({
                userId: auto.userId,
                originalTaskId: auto.originalTaskId,
                completed: false,
                name: auto.taskTemplate.name,
                hour: auto.taskTemplate.hour,
                minute: auto.taskTemplate.minute,
                status: "pending",
                attributes: auto.taskTemplate.attributes,
                level: auto.taskTemplate.level,
                date: startOfDay.toJSDate(),
                order: 0
            })

            console.log(
                `[${timezone}] Tarea creada automáticamente para ${auto.userId}`
            )
        }

    } catch (err) {
        console.error(" Error en cron:", err)
    }
})