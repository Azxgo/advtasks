import Task from "../models/tasks.js"
import Automation from "../models/automations.js"
import DailyStat from "../models/dailyStats.js"
import Adv_Device from "../models/devices.js"
import Adv_Guest_Session from "../models/guest_sessions.js"

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).json(tasks)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const getTasksByDay = async (req, res) => {
    try {
        const { date } = req.query;

        const start = new Date(`${date}T00:00:00`);
        const end = new Date(`${date}T23:59:59.999`);

        if (req.user) {
            const tasks = await Task.find({
                userId: req.user.id,
                date: { $gte: start, $lte: end }
            });

            res.json(tasks);
        }

        if (req.guestSession) {
            const tasks = await Task.find({
                userId: req.guestSession.id,
                date: { $gte: start, $lte: end }
            });

            res.json(tasks);
        }


    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const createTask = async (req, res) => {
    try {
        const { date, repeatTask, selectedDays, endDate } = req.body;

        const userId = req.user?.id || req.guestSession?.id;

        if (!repeatTask) {
            const start = new Date(`${date}T00:00:00`);
            const end = new Date(`${date}T23:59:59.999`);

            const lastTask = await Task.findOne({
                userId,
                date: { $gte: start, $lte: end }
            }).sort({ order: -1 });

            const newOrder = lastTask ? lastTask.order + 1 : 0;

            const task = await Task.create({
                ...req.body,
                date: start,
                userId,
                order: newOrder
            });

            if (req.guestSession) {
                const session = await Adv_Guest_Session.findById(req.guestSession.id);

                const device = await Adv_Device.findOne({
                    _id: session.device_id
                });

                if (device.request_remaining <= 0) {
                    return res.status(429).json({
                        message: "Límite de solicitudes alcanzado"
                    });
                }

                await Adv_Device.updateOne(
                    { _id: session.device_id },
                    {
                        $inc: {
                            request_remaining: -1
                        }
                    }
                );
            }

            return res.status(200).json(task);
        }

        const tasksToCreate = []

        const current = new Date(`${date}T00:00:00`);
        const final = new Date(`${endDate}T00:00:00`);

        while (current <= final) {
            let day = current.getDay()

            day = day === 0 ? 7 : day

            if (selectedDays.includes(day)) {
                const start = new Date(current)
                start.setHours(0, 0, 0, 0)

                const end = new Date(current)
                end.setHours(23, 59, 59, 999)

                const lastTask = await Task.findOne({
                    userId,
                    date: {
                        $gte: start,
                        $lte: end
                    }
                }).sort({ order: -1 });

                const newOrder = lastTask
                    ? lastTask.order + 1
                    : 0;

                tasksToCreate.push({
                    ...req.body,
                    date: new Date(start),
                    userId,
                    order: newOrder
                });
            }
            current.setDate(current.getDate() + 1);
        }

        const tasks = await Task.insertMany(tasksToCreate);

        return res.status(200).json(tasks);
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: e.message });
    }
};

export const changeDifficult = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user?.id || req.guestSession?.id;

        const task = await Task.findOne({
            _id: id,
            userId
        })

        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" })
        }

        task.level = task.level >= 5 ? 1 : task.level + 1

        await task.save();

        if (task.hasAutomation) {
            await Automation.findOneAndUpdate({
                originalTaskId: id
            },
                {
                    $set: {
                        "taskTemplate.level": task.level
                    }
                }
            )
        }

        return res.json(task);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const changeStatus = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user?.id || req.guestSession?.id;

        const task = await Task.findOne({
            _id: id,
            userId
        })

        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" })
        }

        const statusOrder = ["pending", "in-progress"]

        const currentIndex = statusOrder.indexOf(task.status)
        const nextIndex = (currentIndex + 1) % statusOrder.length

        task.status = statusOrder[nextIndex]

        await task.save();

        return res.json(task);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const handleAtributes = async (req, res) => {
    try {
        const { id } = req.params
        const { attribute } = req.body
        const userId = req.user?.id || req.guestSession?.id;

        const task = await Task.findOne({
            _id: id,
            userId
        })

        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        if (!task.attributes) {
            task.attributes = []
        }

        const exists = task.attributes.includes(attribute)

        task.attributes = exists
            ? task.attributes.filter(a => a !== attribute)
            : [...task.attributes, attribute];

        await task.save()

        if (task.hasAutomation) {
            await Automation.findOneAndUpdate({
                originalTaskId: id
            },
                {
                    $set: {
                        "taskTemplate.attributes": task.attributes
                    }
                }
            )
        }

        return res.json(task)
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export const toggleCompleted = async (req, res) => {
    try {
        const { id } = req.params

        const task = await Task.findOne({
            _id: id,
            userId: req.user.id
        })

        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        task.completed = !task.completed

        if (task.completed) {
            task.status = "done";
        } else {
            task.status = "pending";
        }

        await task.save()
        return res.json(task)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const changeName = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name is required" })
        }

        const task = await Task.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        )

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        if (task.hasAutomation) {
            await Automation.findOneAndUpdate(
                { originalTaskId: id },
                {
                    $set: {
                        "taskTemplate.name": name
                    }
                }
            )
        }

        return res.json(task)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const changeTime = async (req, res) => {
    try {
        const { id } = req.params
        const { hour, minute } = req.body

        const update = {}

        if (hour !== undefined) update.hour = hour
        if (minute !== undefined) update.minute = minute

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { $set: update },
            { new: true }
        )

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        if (task.hasAutomation) {
            const automationUpdate = {}

            if (hour !== undefined) {
                automationUpdate["taskTemplate.hour"] = hour
            }

            if (minute !== undefined) {
                automationUpdate["taskTemplate.minute"] = minute
            }

            await Automation.findOneAndUpdate(
                { originalTaskId: id },
                { $set: automationUpdate }
            )
        }

        res.json(task)

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params

        const userId = req.user?.id || req.guestSession?.id;

        const deletedTask = await Task.findOneAndDelete({
            _id: id,
            userId
        })

        if (!deletedTask) {
            return res.status(404).json({ message: "Item no encontrado" })
        }

        if (deletedTask.hasAutomation) {
            await Automation.findOneAndDelete({ originalTaskId: id })
        }

        res.status(200).json({ message: "Tarea eliminada", task: deletedTask })

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}


export const rescheduleTask = async (req, res) => {
    try {
        const { id } = req.params

        const { date } = req.body

        const userId = req.user?.id || req.guestSession?.id;


        const start = new Date(`${date}T00:00:00`)
        const end = new Date(`${date}T23:59:59.999`)

        const lastTask = await Task.findOne({
            userId,
            date: {
                $gte: start,
                $lte: end
            }
        }).sort({ order: -1 })

        const newOrder = lastTask
            ? lastTask.order + 1
            : 0

        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                userId
            },
            {
                date: start,
                order: newOrder
            },
            { new: true }
        )

        res.json(task)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const addSubTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        const newOrder =
            task.subTasks.length > 0
                ? Math.max(...task.subTasks.map(s => s.order ?? 0)) + 1
                : 0


        task.subTasks.push({
            hour: task.hour,
            minute: task.minute,
            name: "",
            completed: false,
            status: "pending",
            order: newOrder
        })

        await task.save()

        const newSubTask = task.subTasks[task.subTasks.length - 1]

        res.status(200).json(newSubTask)
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: e.message });
    }
}

export const updateSubTask = async (req, res) => {
    try {
        const { taskId, subTaskId } = req.params
        const updates = req.body
        const userId = req.user?.id || req.guestSession?.id;


        const setFields = {}

        for (const key in updates) {
            setFields[`subTasks.$.${key}`] = updates[key]
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: taskId,
                userId,
                "subTasks._id": subTaskId
            },
            {
                $set: setFields
            },
            { new: true }
        )

        if (!task) {
            return res.status(404).json({ message: "Subtask not found" })
        }

        res.json(task)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const deleteSubTask = async (req, res) => {
    try {
        const { taskId, subTaskId } = req.params
        const userId = req.user?.id || req.guestSession?.id;

        const task = await Task.findOneAndUpdate(
            {
                _id: taskId,
                userId
            },
            {
                $pull: {
                    subTasks: {
                        _id: subTaskId
                    }
                }
            },
            { new: true }
        )

        if (!task) {
            return res.status(404).json({ message: "Subtask not found" })
        }

        res.json(task)

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const reOrderTasks = async (req, res) => {
    try {
        const { tasks } = req.body

        for (const taskData of tasks) {
            const task = await Task.findById(taskData.id)

            if (!task) continue

            task.order = taskData.order

            task.subTasks.forEach(subTask => {

                const updatedSubTask = taskData.subTasks.find(
                    sub => sub.id === subTask._id.toString()
                )

                if (updatedSubTask) {
                    subTask.order = updatedSubTask.order
                }
            })
            await task.save()
        }

        res.json(tasks)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const duplicateTask = async (req, res) => {
    try {
        const { id } = req.params

        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({ message: "Item no encontrado" })
        }

        const taskData = task.toObject()

        delete taskData._id

        if (taskData.subTasks) {
            taskData.subTasks = taskData.subTasks.map(subTask => {
                delete subTask._id
                return subTask
            })
        }

        const duplicatedTask = new Task(taskData)

        await duplicatedTask.save()

        res.status(201).json(duplicatedTask)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const deleteAllTasksByUser = async (req, res) => {
    try {
        const userId = req.user?.id || req.guestSession?.id;

        const deletedTasks = await Task.deleteMany({ userId });
        const deletedStats = await DailyStat.deleteMany({ userId });

        res.json({
            message: "Todas las tareas y puntaciónes fueron eliminadas.",
            deletedTasks: deletedTasks.deletedCount,
            deletedStats: deletedStats.deletedCount
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};