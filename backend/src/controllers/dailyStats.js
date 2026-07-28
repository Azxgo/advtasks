import Task from "../models/tasks.js"
import DailyStat from "../models/dailyStats.js"


// Funcion que busca los dias con tareas ya existenten que no han sido calculados
export async function calculateMissingDays(userId) {

    // Busca el ultimo dia que ha sido calculado
    const lastStat = await DailyStat.findOne({ userId }).sort({ date: -1 })

    // Define el dia de hoy
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let startDate

    // En caso de no haber calculos en dailystats, busca la primera tarea
    if (!lastStat) {
        const firstTask = await Task.findOne({ userId }).sort({ date: 1 })

        if (!firstTask) return

        // Y empieza desde la fecha de la ultima tarea
        startDate = new Date(firstTask.date)
        startDate.setHours(0, 0, 0, 0)

    } else {
        // Si no, empeiza desde la fecha del ultimo dailyStat
        startDate = new Date(lastStat.date)
        startDate.setDate(startDate.getDate() + 1)

    }

    while (startDate < today) {
        // Un bucle que va calculando los stats hasta llegar a hoy
        await calculateStatsForDay(startDate, userId)

        startDate.setDate(startDate.getDate() + 1)
    }
}

export async function calculateStatsForDay(date, userId) {
    // Define las reglas por la dificultad
    const pointsByDifficulty = {
        1: 100,
        2: 300,
        3: 500,
        4: 700,
        5: 1000
    }

    const penaltyByDifficulty = {
        1: -100,
        2: -200,
        3: -300,
        4: -400,
        5: -500
    }

    // Define el principio y el final del dia
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)

    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    // Busca las tareas del dia.
    const tasks = await Task.find({
        userId,
        date: { $gte: start, $lte: end }
    })

    let score = 0

    // Calcula cada tarea que se ha completado y las que no
    for (const task of tasks) {

        if (task.completed) {
            score += pointsByDifficulty[task.level]
        } else {
            score += penaltyByDifficulty[task.level]
        }

    }

    // Crea el documento en DailyStats
    await DailyStat.findOneAndUpdate(
        { userId, date: start },
        {
            score,
            completedTasks: tasks.filter(t => t.completed).length,
            totalTasks: tasks.length
        },
        { upsert: true, new: true }
    )
}

export const getWeeklyStats = async (req, res) => {
    const { start, end } = req.query


    const startDate = new Date(start)
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(end)
    endDate.setHours(0, 0, 0, 0);

    if (req.user) {
        const userId = req.user.id
        const stats = await DailyStat.find({
            userId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        })
         res.json(stats)
    }

    if (req.guestSession) {
        const guestSessionId = req.guestSession.id
        const stats = await DailyStat.find({
            guestSessionId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        })
         res.json(stats)
    }

}

