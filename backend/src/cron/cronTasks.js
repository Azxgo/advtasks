import cron from "node-cron"
import { DateTime } from "luxon"
import Task from "../models/tasks.js"
import User from "../models/users.js"

cron.schedule("* * * * *", async () => {
    try {

        const users = await User.find(
            {},
            {
                _id: 1,
                timezone: 1
            }
        )

        for (const user of users) {
            const timezone = user.timezone || ""

            const now = DateTime.now().setZone(timezone)

            const currentHour = now.hour
            const currentMinute = now.minute

            const startOfDay = now.startOf("day").toJSDate();
            const endOfDay = now.endOf("day").toJSDate();

            const tasksResult = await Task.updateMany(
                {
                    userId: user._id,

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
                    userId: user._id,
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
                    userId: user._id,
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
                    userId: user._id,
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
                subTasksResult.modifiedCount +
                missedTasksResult.modifiedCount +
                missedSubTasksResult.modifiedCount;

            if (total > 0) {
                console.log(
                    `[${timezone}] ${now.toFormat("yyyy-MM-dd HH:mm")} → Actualizadas: ${total}`
                );
            }
        }
    } catch (err) {
        console.error("Error en cron:", err)
    }
})