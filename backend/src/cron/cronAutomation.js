import cron from "node-cron"
import Automation from "../models/automations.js"
import Task from "../models/tasks.js"

cron.schedule("* * * * *", async () => {
    console.log("Ejecutando Automatizaciones...")

    const now = new Date()

    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const startOfDay = new Date(tomorrow)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(tomorrow)
    endOfDay.setHours(23, 59, 59, 999)

    const jsDay = tomorrow.getDay()
    const day = jsDay === 0 ? 7 : jsDay

    try {
        const automations = await Automation.find({
            active: true,
            startDate: { $lte: endOfDay },
            endDate: { $gte: startOfDay }
        })

        for (const auto of automations) {

            if (!auto.daysOfWeek.includes(day)) continue

            if (
                auto.generationHour !== currentHour ||
                auto.generationMinute !== currentMinute
            ) continue

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
                date: startOfDay,
                order: 0
            })

            console.log("Tarea creada automáticamente")
        }

    } catch (err) {
        console.error(" Error en cron:", err)
    }
})