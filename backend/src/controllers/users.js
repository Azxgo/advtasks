import User from "../models/users.js"
import Adv_Guest_Session from "../models/guest_sessions.js"
import Task from "../models/tasks.js"
import Automation from "../models/automations.js"
import DailyStat from "../models/dailyStats.js"

const levelFromExp = (totalExp) => {
    return Math.max(
        1,
        Math.floor(Math.cbrt(totalExp / 50))
    )
}

export const getUserInfoById = async (req, res) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            return res.json(user);
        }

        if (req.guestSession) {
            return res.json({
                guest: true,
                session: req.guestSession
            });
        }

        return res.sendStatus(401);

    } catch (e) {
        console.error(e);
        return res.status(400).json({ message: e.message });
    }
}

export const getStatsById = async (req, res) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user.id)

            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            res.json(user.stats)
        }

        if (req.guestSession) {
            const guestSession = await Adv_Guest_Session.findById(req.guestSession.id)

            if (!guestSession) {
                return res.status(404).json({ message: "Guest no encontrado" })
            }

            res.json(guestSession.stats)
        }


    } catch (e) {
        console.error(e);
        res.status(400).json({ message: e.message });
    }
}

export const resetStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        await User.findByIdAndUpdate(user._id,
            {
                $set: {
                    "stats.work": 0,
                    "stats.learning": 0,
                    "stats.creative": 0,
                    "stats.social": 0,
                    "stats.recreation": 0,
                }

            }
        )

        return res.status(200).json({ message: "Estadísticas reiniciadas" });
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: e.message });
    }
}

export const resetLevel = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        await User.findByIdAndUpdate(user._id,
            {
                $set: {
                    level: 1,
                    totalExp: 0,
                }
            }
        )
        return res.status(200).json({ message: "Nivel Reiniciado" });
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: e.message });
    }
}

export const addDailyStats = async () => {
    const users = await User.find()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const expByDifficulty = {
        1: 50,
        2: 150,
        3: 300,
        4: 400,
        5: 500
    }

    for (const user of users) {

        console.log("Procesando:", user.name)

        // DESACTIVADO PARA PRUEBAS
        // if (
        //     user.lastUpdateDate &&
        //     user.lastUpdateDate.getTime() === today.getTime()
        // ) {
        //     continue
        // }

        const start = new Date(today)
        start.setDate(start.getDate() - 1)

        const end = new Date(today.getTime() - 1)

        const tasks = await Task.find({
            userId,
            completed: true,
            date: { $gte: start, $lte: end }
        })


        const stats = {
            work: 0,
            learning: 0,
            creative: 0,
            social: 0,
            recreation: 0,
        }

        let expGained = 0

        tasks.forEach(task => {
            expGained += expByDifficulty[task.level] || 0

            task.attributes?.forEach(attr => {
                stats[attr] += task.level
            })
        })


        const newTotalExp = user.totalExp + expGained
        const newLevel = levelFromExp(newTotalExp)

        const result = await User.updateOne(
            { _id: user._id },
            {
                $inc: {
                    totalExp: expGained,

                    "stats.work": stats.work,
                    "stats.learning": stats.learning,
                    "stats.creative": stats.creative,
                    "stats.social": stats.social,
                    "stats.recreation": stats.recreation,
                },
                $set: {
                    level: newLevel,
                    lastUpdateDate: new Date()
                }
            }
        )

        console.log("Resultado Mongo:", result)
    }
}

export const checkAccess = async () => {
    if (req.user) {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        res.json(user.stats)
    }

    if (req.guestSession) {
        const guestSession = await Adv_Guest_Session.findById(req.guestSession.id)

        if (!guestSession) {
            return res.status(404).json({ message: "Guest no encontrado" })
        }

        res.json(guestSession.stats)
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id)

        if (!user) {
            return res.status(400).json({ message: "Usuario no existe" })
        }

        await Task.deleteMany({ userId: user._id });
        await Automation.deleteMany({ userId: user._id });
        await DailyStat.deleteMany({ userId: user._id });

        return res.status(200).json({ message: "Usuario eliminado correctamente" });

    } catch (err) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }

}