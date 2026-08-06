import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react";
import type { TaskAttribute, SubTask, TaskItem as TaskType } from "../types/Tasks";
import { TaskItem } from "../components/tasks/TaskItem";
import { FaPlus, FaSort } from "react-icons/fa";
import { WeekCalendar } from "../components/tasks/WeekCalendar";
import { CalendarModal } from "../components/tasks/CalendarModal";
import { attributeIcons } from "../utils/atributeIcons";
import { useTasksActions } from "../hooks/useTasksActions";
import { useCalendar } from "../hooks/useCalendar";
import { AtributeToolTip } from "../components/ui/AttributeToolTip";
import { AutomateModal } from "../components/tasks/AutomateModal";
import { RescheduleModal } from "../components/tasks/RescheduleModal";
import { AddTaskModal } from "../components/tasks/AddTaskModal";
import { LevelBar } from "../components/tasks/LevelBar";
import { apiClient } from "../config/apiClient";
import type { TotalStatsAttributes } from "../types/Stats";
import { useStatsContext } from "../context/StatsContext";
import { useTasksContext } from "../context/TasksContext";
import { EditTaskModal } from "../components/tasks/EditTaskModal";

export default function ToDo() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const { tasks, setTasks, updateTask } = useTasksContext();
    const { toggleCompleted, changeDificult, changeStatus, changeAtribute,
        changeName, saveTime, handleAddTask, handleDeleteTask, handleUpdateTask, addSubTask,
        updateSubTask, deleteSubTask, reOrderTasks, duplicateTask,
        saveAutomation, deleteAutomation } = useTasksActions(updateTask, setTasks)
    const { calendarMonth, setCalendarMonth, startOfWeek, weekDays, calendarDays } = useCalendar({ currentDate })
    const { statsAttributes, fetchStats } = useStatsContext()

    const [weeklyScore, setWeeklyScore] = useState(0)

    const [calendarOpen, setCalendarOpen] = useState(false)

    const [addModalOpen, setAddModalOpen] = useState(false)

    const [modalType, setModalType] = useState<"automate" | "reschedule" | "edit" | null>(null)
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null)

    const [loading, setLoading] = useState(false)

    const allAttributes: TaskAttribute[] = [
        "work",
        "learning",
        "creative",
        "social",
        "recreation",
    ];


    const pointsByDifficulty = {
        1: 100,
        2: 300,
        3: 500,
        4: 700,
        5: 1000
    }

    const openAutomateModal = (task: TaskType) => {
        setSelectedTask(task)
        setModalType("automate")
    }

    const openRescheduleModal = (task: TaskType) => {
        setSelectedTask(task)
        setModalType("reschedule")
    }

    const openEditModal = (task: TaskType) => {
        setSelectedTask(task)
        setModalType("edit")
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchTasks = async (date: Date) => {

        try {
            setLoading(true)
            const res = await apiClient(
                `/api/tasks/getTasksByDay?date=${date.toLocaleDateString("sv-SE")}`,
                {}
            )

            if (!res.ok) {
                console.log(await res.text())
                return
            }

            const data = await res.json()

            setTasks(data)
        } catch {
            console.error("Error al cargar Tareas")
        } finally {
            setLoading(false)
        }

    }

    const fetchWeeklyScore = async () => {
        const start = new Date(startOfWeek)
        start.setHours(0, 0, 0, 0)

        const end = new Date(startOfWeek)
        end.setDate(start.getDate() + 6)
        end.setHours(23, 59, 59, 999)

        const res = await apiClient(
            `/api/dailystats/week?start=${start.toISOString()}&end=${end.toISOString()}`, {})

        const data = await res.json()

        const totalScore = data.reduce((sum: number, day: any) => sum + day.score, 0)

        setWeeklyScore(totalScore)
    }

    useEffect(() => {
        fetchTasks(currentDate)
        fetchWeeklyScore()
    }, [currentDate])

    const changeTimeLocal = (
        id: string,
        field: "hour" | "minute",
        value: number
    ) => {
        setTasks(prev =>
            prev.map(task =>
                task._id === id
                    ? { ...task, [field]: value }
                    : task
            )
        );
    };

    const handleNewTask = async () => {
        const newTask: Partial<TaskType> = {
            name: "",
            hour: 0,
            minute: 0,
            status: "pending",
            attributes: [],
            level: 1,
            date: currentDate.toLocaleDateString("sv-SE")
        };

        handleAddTask(newTask, currentDate)
    }

    const handleOrderTasks = async () => {
        const orderedTasks = [...tasks]
            .map(task => {
                const orderedSubTasks = [...(task.subTasks || [])]
                    .sort((a, b) => {
                        if (a.hour !== b.hour) return a.hour - b.hour;
                        if (a.minute !== b.minute) return a.minute - b.minute;
                        return a.order - b.order;
                    })
                    .map((subTask, index) => ({
                        ...subTask,
                        order: index
                    }));

                return {
                    ...task,
                    subTasks: orderedSubTasks
                };
            })
            .sort((a, b) => {
                if (a.hour !== b.hour) return a.hour - b.hour;
                if (a.minute !== b.minute) return a.minute - b.minute;
                return a.order - b.order;
            })
            .map((task, index) => ({
                ...task,
                order: index
            }));

        setTasks(orderedTasks);

        await reOrderTasks(
            orderedTasks.map(task => ({
                id: task._id,
                order: task.order,
                subTasks: task.subTasks.map(sub => ({
                    id: sub._id,
                    order: sub.order
                }))
            }))
        );
    };

    const formattedDate = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });


    const changeDay = async (amount: number) => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() + amount)
        setCurrentDate(newDate)

    }

    const changeMonth = async (amount: number) => {
        if (amount === 0) {
            setCalendarMonth(new Date())
            return
        }

        const newMonth = new Date(calendarMonth)
        newMonth.setMonth(calendarMonth.getMonth() + amount)
        setCalendarMonth(newMonth)
    }

    const goToDate = (date: Date) => {
        setCurrentDate(date)
    }

    const goToDateCalendar = (day: number) => {
        const newDate = new Date(calendarMonth)
        newDate.setDate(day)

        setCurrentDate(newDate)
        setCalendarOpen(false)
    }

    const completedTasks = tasks.filter(task => task.completed).length
    const totalTasks = tasks.length

    // Puntaje Local
    const dailyScore = tasks.reduce((score, task) => {
        const difficulty = task.level as 1 | 2 | 3 | 4 | 5

        if (task.completed) {
            return score + pointsByDifficulty[difficulty]
        }
        return score
    }, 0)


    const localStats: TotalStatsAttributes = allAttributes.reduce(
        (acc, attr) => {
            acc[attr] = tasks
                .filter(task => task.completed && task.attributes?.includes(attr))
                .reduce((sum, task) => sum + (task.level ?? 0), 0);
            return acc;
        },
        {} as TotalStatsAttributes
    );

    const isToday = (() => {
        const today = new Date()
        return currentDate.toDateString() === today.toDateString()
    })()

    const totalStatsForDisplay: TotalStatsAttributes = allAttributes.reduce(
        (acc, attr) => {
            acc[attr] = statsAttributes[attr] ?? 0

            if (isToday) {
                acc[attr] += localStats[attr] ?? 0
            }

            return acc
        },
        {} as TotalStatsAttributes
    )
    // todo lo que sea start = new Date esta mal
    const shouldActivate = (now: Date, taskDay: string, hour: number, minute: number, completed: boolean, status: string) => {
        const [year, month, day] = taskDay.split("-").map(Number);

        const start = new Date(year, month - 1, day, hour, minute, 0, 0);

        return (
            now >= start &&
            !completed &&
            status === "pending"
        );
    };

    const isPreviousDay = (taskDate: Date | string, now: Date) => {
        const taskDay = typeof taskDate === "string"
            ? taskDate.split("T")[0]
            : taskDate.toLocaleDateString("sv-SE");

        const today = now.toLocaleDateString("sv-SE");

        return taskDay < today;
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>
        let timeout: ReturnType<typeof setTimeout>

        const sync = () => {
            const now = new Date()
            const seconds = now.getSeconds()
            const ms = now.getMilliseconds()

            const delay = (60 - seconds) * 1000 - ms

            timeout = setTimeout(() => {
                updateTasksStatus()

                interval = setInterval(() => {
                    updateTasksStatus()
                }, 60000)
            }, delay)
        }

        const updateTasksStatus = () => {
            const now = new Date()
            const today = now.toLocaleDateString("sv-SE")

            setTasks(prev =>
                prev.map(task => {
                    const taskDay = typeof task.date === "string"
                        ? task.date.split("T")[0]
                        : task.date.toLocaleDateString("sv-SE")

                    const sameDay = taskDay === today

                    let status = task.status

                    if (isPreviousDay(taskDay, now) && !task.completed && ["pending", "in-progress"].includes(task.status)) {
                        status = "missed"
                    } else if (sameDay && shouldActivate(now, taskDay, task.hour, task.minute, task.completed, task.status)) {
                        status = "in-progress"
                    }

                    const updateSubTasks: SubTask[] = task.subTasks.map((subTask: SubTask) => {

                        if (isPreviousDay(taskDay, now) && !subTask.completed && ["pending", "in-progress"].includes(subTask.status)) {
                            return {
                                ...subTask,
                                status: "missed"
                            }
                        }

                        if (sameDay && shouldActivate(now, taskDay, subTask.hour, subTask.minute, subTask.completed, subTask.status)) {
                            return {
                                ...subTask,
                                status: "in-progress"
                            }
                        }
                        return subTask
                    })

                    return {
                        ...task,
                        status,
                        subTasks: updateSubTasks
                    }
                })
            )
        }

        sync()

        return () => {
            clearTimeout(timeout)
            clearInterval(interval)
        }
    }, [])

    return (

        <section className="flex flex-col gap-4 dark:text-white ">
            <div>
                <LevelBar />
            </div>
            <div className="flex flex-col border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-600 rounded-lg p-4 gap-3">
                <div className="flex w-full justify-center">
                    <WeekCalendar
                        weekDays={weekDays}
                        currentDate={currentDate}
                        goToDate={goToDate}
                        changeDay={changeDay}
                        openCalendar={() => setCalendarOpen(true)}
                        formattedDate={formattedDate}
                    />
                </div>

                <div className="flex justify-between gap-10">
                    <button
                        onClick={() => handleOrderTasks()}
                        className="flex items-center gap-2 border border-gray-300 dark:border-zinc-600 rounded-lg p-2
                        hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all duration-300 cursor-pointer">
                        <FaSort color={"gray"} className="size-4 sm:size-6" />
                        <span className="text-[10px] sm:text-base select-none">Ordenar</span>
                    </button>

                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="flex items-center gap-2 border border-gray-300 dark:border-zinc-600 rounded-lg p-2
                        hover:bg-gray-100 dark:hover:bg-zinc-700  transition-all duration-300 cursor-pointer"
                    >
                        <FaPlus color={"gray"} className="size-4 sm:size-6" />
                        <span className="text-[10px] sm:text-base select-none">Crear Tarea</span>
                    </button>

                </div>

                <div className="border border-gray-300 dark:border-zinc-600 ">
                    {loading ? (
                        <div className="flex px-4 py-3 select-none
                        bg-gray-100 hover:bg-gray-50 dark:bg-zinc-700/20 dark:hover:bg-zinc-600 justify-center transition gap-2 w-full items-center">
                            <h1 className="italic text-[10px] sm:text-base text-gray-400">Cargando...</h1>
                        </div>
                    ) : tasks.length > 0 ? (
                        [...tasks]
                            .sort((a, b) => a.order - b.order)
                            .map((t) => (
                                <TaskItem
                                    key={t._id}
                                    task={t}
                                    allAttributes={allAttributes}
                                    toggleCompleted={(id) => toggleCompleted(id, t.date)}
                                    changeStatus={changeStatus}
                                    changeDificult={changeDificult}
                                    changeAtribute={changeAtribute}
                                    changeName={changeName}
                                    changeTimeLocal={changeTimeLocal}
                                    saveTime={saveTime}
                                    onAutomate={openAutomateModal}
                                    onReschedule={openRescheduleModal}
                                    onEdit={openEditModal}
                                    onDelete={handleDeleteTask}
                                    onDuplicate={duplicateTask}
                                    onAddSubTask={addSubTask}
                                    updateSubTask={updateSubTask}
                                    deleteSubTask={deleteSubTask}
                                />
                            ))
                    ) : (
                        <div className="flex px-4 py-3 select-none
                        bg-gray-100 hover:bg-gray-50 dark:bg-zinc-700/20 dark:hover:bg-zinc-600 justify-center transition gap-2 w-full items-center">
                            <h1 className="italic text-[10px] sm:text-base text-gray-400">No hay tareas para este dia</h1>
                        </div>
                    )}
                </div>
                <div className="flex gap-2 justify-between">
                    <button
                        onClick={() => handleNewTask()}
                        className="flex items-center gap-2 border border-gray-300 dark:border-zinc-600 rounded-lg p-2
                         hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all duration-300 cursor-pointer">
                        <FaPlus color={"gray"} className="size-4 sm:size-6" />
                    </button>

                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 w-full m-0 gap-2 sm:gap-4 select-none">
                    <div className="col-span-2 md:col-span-1 flex items-center gap-2 sm:gap-5 px-4 py-2 rounded-xl 
                        bg-gray-100 border border-gray-300 
                        dark:border-zinc-600 dark:bg-zinc-700/20"
                    >
                        <p className="text-[10px] sm:text-base text-gray-400">Completados del dia :</p>
                        <h2 className="text-[13px] sm:text-xl font-bold m-0 ">{completedTasks}/{totalTasks}</h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-5 m-0 px-4 py-2 rounded-xl 
                        bg-gray-100 border border-gray-300 
                        dark:border-zinc-600 dark:bg-zinc-700/20"
                    >
                        <p className="text-[10px] sm:text-base text-gray-400">Puntaje del dia :</p>
                        <h2 className="text-[13px] sm:text-xl font-bold m-0"> {dailyScore}</h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-5 px-4 py-2 m-0 rounded-xl 
                        bg-gray-100 border border-gray-300 
                        dark:border-zinc-600 dark:bg-zinc-700/20"
                    >
                        <p className="text-[10px] sm:text-base text-gray-400">Puntaje Semanal :</p>
                        <h2 className="text-[13px] sm:text-xl font-bold m-0">{weeklyScore}</h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-8 items-center justify-center">
                    {allAttributes.map((attr, index) => {
                        const Icon = attributeIcons[attr];
                        const value = totalStatsForDisplay[attr];
                        const percentage = Math.min((value / 100) * 100, 100);

                        return (
                            <div key={attr} className={`flex gap-3 items-center
                             ${index === 4 ? "col-span-2 md:col-span-1 justify-self-center w-1/2 md:w-full" : ""}`}>
                                <AtributeToolTip text={attr}>
                                    <Icon
                                        className="size-5 sm:size-8 text-indigo-500 dark:text-indigo-700 scale-110 drop-shadow-lg"
                                        size={38}
                                    />
                                </AtributeToolTip>
                                <div className="w-full bg-gray-300 dark:bg-zinc-600 rounded-full h-3 sm:h-5 overflow-hidden">
                                    <div
                                        className="bg-indigo-500 dark:bg-indigo-700 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            <AnimatePresence>
                {calendarOpen && (
                    <CalendarModal
                        calendarMonth={calendarMonth}
                        calendarDays={calendarDays}
                        currentDate={currentDate}
                        changeMonth={changeMonth}
                        goToDate={goToDateCalendar}
                        onClose={() => setCalendarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {addModalOpen && (
                    <AddTaskModal
                        onClose={() => setAddModalOpen(false)}
                        onAdd={(task) => handleAddTask(task, currentDate)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {modalType === "automate" && selectedTask && (
                    <AutomateModal
                        task={selectedTask}
                        saveAutomation={saveAutomation}
                        deleteAutomation={deleteAutomation}
                        onClose={() => setModalType(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {modalType === "reschedule" && selectedTask && (
                    <RescheduleModal
                        task={selectedTask}
                        setTasks={setTasks}
                        onClose={() => setModalType(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {modalType === "edit" && selectedTask && (
                    <EditTaskModal
                        task={selectedTask}
                        onClose={() => setModalType(null)}
                        onEdit={handleUpdateTask}
                    />
                )}
            </AnimatePresence>
        </section>

    )
} 