import { useEffect, useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { apiClient } from "../../config/apiClient";
import type { DailyStat } from "../../types/Stats";

type Props = {
    weekDays: { dayName: string; dayNumber: number; fulldate: Date; }[]
    currentDate: Date
    goToDate: (date: Date) => void
    changeDay: (amount: number) => void
    openCalendar: () => void
    formattedDate: string
}


export function WeekCalendar({ weekDays, currentDate, goToDate, changeDay, openCalendar, formattedDate }: Props) {
    const [dailyStats, setDailyStats] = useState<DailyStat[]>([])

    const today = new Date()

    const normalize = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate())

    const isPast = normalize(currentDate) < normalize(today)
    const isFuture = normalize(currentDate) > normalize(today)

    const fetchWeeklyStats = async () => {

        const start = weekDays[0].fulldate.toISOString();
        const end = weekDays[6].fulldate.toISOString();
        const res = await apiClient(`/api/dailystats/week?start=${start}&end=${end}`)

        if (!res.ok) return;

        const data = await res.json()
        setDailyStats(data)
    }

    const weekKey =
        weekDays[0]?.fulldate.toDateString() + "-" +
        weekDays[6]?.fulldate.toDateString();

    useEffect(() => {
        fetchWeeklyStats();
    }, [weekKey]);

    const getStat = (date: Date) => {
        return dailyStats.find((stat: any) =>
            new Date(stat.date).toDateString() === date.toDateString()
        )
    }

    const getColor = (date: Date) => {
        const stat = getStat(date)

        if (!stat) return "bg-white border-gray-200 dark:border-zinc-600 hover:bg-indigo-300 dark:hover:bg-indigo-500 dark:bg-zinc-700 select-none cursor-pointer"

        if (stat.totalTasks === 0)
            return "bg-white border-gray-200 dark:bg-zinc-800 dark:border-gray-600 ";

        const percentage = stat.completedTasks / stat.totalTasks;

        if (percentage === 1)
            return "bg-green-100 border-green-200 dark:border-green-800 dark:bg-green-900";

        return "bg-red-100 border-red-200 dark:border-red-800 dark:bg-red-900";
    }



    return (
        <div className="flex flex-col gap-3 w-full justify-center">
            <div className="relative flex justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={() => changeDay(-1)}
                        className="p-2 border border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-700  rounded-lg 
                        transition-all duration-300 cursor-pointer">
                        <FaAngleLeft className="size-6 sm:size-8" />
                    </button>
                    {isFuture && (
                        <button
                            onClick={() => goToDate(new Date())}
                            className="py-2 px-2 sm:px-3 border border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-700  rounded-lg 
                        transition-all duration-300 cursor-pointer"
                        >
                            <FaAngleDoubleLeft className="block sm:hidden text-lg" />
                            <span className="hidden sm:block">
                                Volver a Hoy
                            </span>
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <h1
                        onClick={openCalendar}
                        className="absolute left-1/2 -translate-x-1/2 text-xl text-center cursor-pointer 
                        hover:scale-105 active:scale-95 transition-all duration-200 text-[15px] sm:text-base">
                        {formattedDate}
                    </h1>

                </div>

                <div className="flex gap-2">
                    {isPast && (
                        <button
                            onClick={() => goToDate(new Date())}
                            className="py-2 px-2 sm:px-3 border border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-700  rounded-lg 
                        transition-all duration-300 cursor-pointer"
                        >
                            <FaAngleDoubleRight className="block sm:hidden text-lg" />
                            <span className="hidden sm:block">
                                Volver a Hoy
                            </span>
                        </button>
                    )}
                    <button
                        onClick={() => changeDay(+1)}
                        className="p-2 border border-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700  dark:border-zinc-600 rounded-lg 
                        transition-all duration-200 cursor-pointer">
                        <FaAngleRight className="size-6 sm:size-8" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 w-full bg-gray-100 dark:bg-zinc-700">
                {weekDays.map((day, index) => (
                    <div
                        key={index}
                        className="flex flex-col"
                        onClick={() => goToDate(day.fulldate)}
                    >
                        <div
                            className="bg-gray-100 hover:bg-indigo-300 dark:bg-zinc-700 dark:hover:bg-indigo-600/50 rounded-t-lg 
                            p-2 flex justify-center items-center cursor-pointer font-semibold"
                        >
                            <span className="text-xs sm:text-base select-none">{day.dayName}</span>

                        </div>
                        <div className={`flex items-center justify-center 
                                    border p-2 rounded-b-lg select-none cursor-pointer
                                    ${day.fulldate.toDateString() === currentDate.toDateString()
                                ? "bg-indigo-500 dark:bg-indigo-700 text-white border-blue-500 dark:border-indigo-600"
                                : getColor(day.fulldate)

                            }`}>
                            <span className="text-xs sm:text-base select-none">{day.dayNumber}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}