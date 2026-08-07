import cron from "node-cron"
import Task from "../models/tasks.js"

cron.schedule("* * * * *", async () => {
    console.log("CRON TASK EJECUTADO", new Date());
    const now = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "America/Santiago"
        })
    )

    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    try {
        console.log({
            now,
            currentHour,
            currentMinute,
            startOfDay,
            endOfDay
        });
        const tasks = await Task.find({
            status: "pending",
            completed: false,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        console.log("Coinciden por fecha:", tasks.length);
        console.log(tasks.map(t => ({
            date: t.date,
            hour: t.hour,
            minute: t.minute,
            status: t.status
        })));
        const tasksResult = await Task.updateMany(
            {
                // Condiciones
                status: "pending",
                completed: false,
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                },
                // Todas las tareas de la hora actual y antes
                $or: [
                    { hour: { $lt: currentHour } },
                    {
                        hour: currentHour,
                        minute: { $lte: currentMinute }
                    }
                ]
            },
            {
                $set: { status: "in-progress" }
            }
        )

        const subTasksResult = await Task.updateMany(
            {
                // Condiciones
                "subTasks.status": "pending",
                completed: false,
                date: { $gte: startOfDay, $lte: endOfDay }
            },
            {
                $set: {
                    // Cambia el status solo a las sub tasks que tengan de nombre elem
                    "subTasks.$[elem].status": "in-progress"
                }
            },
            {
                arrayFilters: [
                    {
                        // Se pone un and por que debe cumplir estas dos condiciones
                        $and: [
                            { "elem.status": "pending" },

                            {
                                // Todas las tareas de la hora actual y antes
                                $or: [
                                    { "elem.hour": { $lt: currentHour } },
                                    {
                                        "elem.hour": currentHour,
                                        "elem.minute": { $lte: currentMinute }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        )

        const missedTasksResult = await Task.updateMany(
            {
                completed: false,
                status: { $in: ["pending", "in-progress"] },
                date: { $lt: startOfDay }
            },
            {
                $set: { status: "missed" }
            }
        )

        const missedSubTasksResult = await Task.updateMany(
            {
                "subTasks.status": { $in: ["pending", "in-progress"] },
                date: { $lt: startOfDay }
            },
            {
                $set: {
                    "subTasks.$[elem].status": "missed"
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.status": { $in: ["pending", "in-progress"] }
                    }
                ]
            }
        )

        const total =
            tasksResult.modifiedCount +
            subTasksResult.modifiedCount

        if (total > 0) {
            console.log(`Actualizadas: ${total}`)
        }

    } catch (err) {
        console.error("Error en cron:", err)
    }
})