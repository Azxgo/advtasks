import { motion } from "framer-motion"
import { FaAngleLeft, FaAngleRight, FaTimes } from "react-icons/fa"
import { apiClient } from "../../config/apiClient"
import type { DailyStat } from "../../types/Stats"
import { useEffect, useState } from "react"

type Props = {
    calendarMonth: Date
    calendarDays: (number | null)[]
    currentDate: Date
    changeMonth: (amount: number) => void
    goToDate: (day: number) => void
    onClose: () => void
}

export function CalendarModal({ calendarMonth, calendarDays, currentDate, changeMonth, goToDate, onClose }: Props) {
    const [dailyStats, setDailyStats] = useState<DailyStat[]>([])

    const normalizeMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), 1)

    const today = new Date()

    const isPast = normalizeMonth(calendarMonth) < normalizeMonth(today)
    const isFuture = normalizeMonth(calendarMonth) > normalizeMonth(today)


    const fetchMonthlyStats = async () => {
        const start = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
        const end = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0)

        const res = await apiClient(`/api/dailystats/week?start=${start}&end=${end}`)

        if (!res.ok) return

        const data = await res.json()

        setDailyStats(data)
    }

    useEffect(() => {
        fetchMonthlyStats()
    }, [calendarMonth])

    const getStat = (date: Date) => {
        return dailyStats.find((stat: any) =>
            new Date(stat.date).toDateString() === date.toDateString()
        )
    }

    const getColor = (date: Date) => {
        const stat = getStat(date)

        if (!stat) return "bg-white border-gray-200 dark:border-zinc-600 hover:bg-indigo-300 dark:hover:bg-indigo-500 dark:bg-zinc-700 select-none cursor-pointer"

        if (stat.totalTasks === 0)
            return "bg-white dark:border-zinc-600 border-gray-200 hover:bg-indigo-300 dark:hover:bg-indigo-500 dark:bg-zinc-700 select-none cursor-pointer";

        const percentage = stat.completedTasks / stat.totalTasks;

        if (percentage === 1)
            return "bg-green-100 border-green-200 dark:border-green-800 dark:bg-green-900 cursor-pointer";

        return "bg-red-100 border-red-200 dark:border-red-800 dark:bg-red-900 cursor-pointer";
    }


    const totalCompleted = dailyStats.reduce(
        (sum, day) => sum + day.completedTasks,
        0
    )

    const totalTasks = dailyStats.reduce(
        (sum, day) => sum + day.totalTasks,
        0
    )

    const score = dailyStats.reduce(
        (sum, day) => sum + day.score,
        0
    )

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2 bg-white dark:bg-zinc-800 p-6 rounded-xl w-[600px] min-h-[485px] border border-gray-200 dark:border-zinc-700 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                    >
                        <FaTimes size={20}
                            className="cursor-pointer hover:text-gray-400 transition-all duration-200" />

                    </button>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                        <button
                            className="p-2 border border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg 
                            transition-all duration-200 cursor-pointer"
                            onClick={() => changeMonth(-1)}>
                            <FaAngleLeft size={20} />
                        </button>
                        {isFuture && (
                            <button
                                onClick={() => changeMonth(0)}
                                className="p-2 border border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg 
                        transition-all duration-200 cursor-pointer"
                            >
                                Volver a Hoy
                            </button>
                        )}
                    </div>

                    <h2 className="absolute left-1/2 -translate-x-1/2  text-center  text-xl">
                        {calendarMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
                    </h2>
                    <div className="flex gap-2">
                        {isPast && (
                            <button
                                onClick={() => changeMonth(0)}
                                className="p-2 border border-gray-300 dark:border-zinc-600  hover:bg-gray-100  dark:hover:bg-zinc-700rounded-lg 
                        transition-all duration-200 cursor-pointer"
                            >
                                Volver a Hoy
                            </button>
                        )}
                        <button
                            className="p-2 border border-gray-300 dark:border-zinc-600  hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg 
                        transition-all duration-200 cursor-pointer"
                            onClick={() => changeMonth(1)}>
                            <FaAngleRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 p-2 w-full bg-gray-100 dark:bg-zinc-600 rounded-md">

                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                        <div key={d} className="p-2 flex items-center justify-center font-bold ">
                            {d}
                        </div>
                    ))}

                    {calendarDays.map((day, i) => {
                        const date = day
                            ? new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
                            : null

                        return (
                            <div
                                key={i}
                                className={`flex items-center justify-center h-10 rounded-lg border
                                    ${day
                                        ? day === currentDate.getDate() &&
                                            calendarMonth.getMonth() === currentDate.getMonth() &&
                                            calendarMonth.getFullYear() === currentDate.getFullYear()
                                            ? "bg-indigo-500 text-white cursor-pointer border-blue-500"
                                            : getColor(date!)
                                        : "text-transparent border-transparent pointer-events-none"
                                    }
                                    `}
                                onClick={() => day && goToDate(day)}
                            >
                                {day ? day : ""}
                            </div>
                        )
                    })}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 select-none">
                    <div className="flex items-center gap-4 px-4 py-2 rounded-xl 
                        bg-gray-100 border border-gray-300 
                        dark:border-zinc-600 dark:bg-zinc-700/20"
                    >
                        <p className="text-gray-400">Completados totales: </p>
                        <h2 className="text-xl font-bold m-0 p-0">{totalCompleted} / {totalTasks}</h2>
                    </div>

                    <div className="flex items-center gap-5 px-4 py-2 rounded-xl 
                        bg-gray-100 border border-gray-300 
                        dark:border-zinc-600 dark:bg-zinc-700/20"
                    >
                        <p className="text-gray-400">Puntaje Mensual: </p>
                        <h2 className="text-xl font-bold m-0">{score}</h2>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}