import Automation from "../models/automations.js"
import Task from "../models/tasks.js"

export const createAutomation = async (req, res) => {
    try {
        const { taskId, daysOfWeek, startDate, endDate, time } = req.body;

        const userId = req.user?.id || req.guestSession?.id;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }


        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!daysOfWeek || daysOfWeek.length === 0) {
            return res.status(400).json({ message: "Select at least one day" });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start and end dates required" });
        }

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: "Invalid date range" });
        }

        const [generationHour, generationMinute] = time
            .split(":")
            .map(Number)


        const automation = await Automation.findOneAndUpdate(
            {
                userId,
                originalTaskId: task._id
            },
            {
                userId,
                originalTaskId: task._id,

                taskTemplate: {
                    name: task.name,
                    hour: task.hour,
                    minute: task.minute,
                    level: task.level,
                    attributes: task.attributes || []
                },

                daysOfWeek,
                startDate,
                endDate,
                active: true,

                generationHour,
                generationMinute,

            },
            {
                new: true,
                upsert: true
            }
        );

        await Task.findByIdAndUpdate(task._id, {
            hasAutomation: true
        }, { new: true })

        res.status(200).json(automation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating automation" });
    }
};


export const deleteAutomation = async (req, res) => {
    try {
        const { taskId } = req.params

        const userId = req.user?.id || req.guestSession?.id;

        const automation = await Automation.findOneAndDelete({
            userId,
            "taskTemplate.name": { $exists: true },
            originalTaskId: taskId
        })

        if (!automation) {
            return res.status(404).json({ message: "Automation not found" })
        }

        await Task.findByIdAndUpdate(taskId, {
            hasAutomation: false
        })

        res.json({ message: "Automation deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting automation" });
    }
}

export const getAutomationByTask = async (req, res) => {
    try {
        const userId = req.user?.id || req.guestSession?.id;
        const { taskId } = req.params

        const automation = await Automation.findOne({
            userId,
            originalTaskId: taskId
        })

        res.json(automation)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching automation" });
    }
}
