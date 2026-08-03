import React, { useState } from "react"
import { FaTrash } from "react-icons/fa"
import { useTimeDrag } from "../../hooks/useTimeDrag"
import { statusMap, statusMini, statusStyles } from "../../utils/formatTodo"
import type { SubTask, TaskItem } from "../../types/Tasks"

type Props = {
    task: TaskItem
    subtask: SubTask
    isLast: boolean

    updateSubTask: (taskId: string, subTaskId: string, TaskDate: Date | string, updates: Partial<TaskItem>) => void
    deleteSubTask: (taskId: string, subTaskId: string) => void
}

export function SubTaskItem({
    task,
    subtask,
    isLast,
    updateSubTask,
    deleteSubTask
}: Props) {

    const [editing, setEditing] = useState(false)
    const [name, setName] = useState(subtask.name)

    const formatTime = (num: number) => {
        if (num === -1) return "--";
        return String(num).padStart(2, "0");
    };

    const subHourDrag = useTimeDrag(
        subtask.hour,
        "hour",
        (value) => updateSubTask(task._id, subtask._id, task.date, { hour: value }),
        (value) => updateSubTask(task._id, subtask._id, task.date, { hour: value })
    )

    const subMinuteDrag = useTimeDrag(
        subtask.minute,
        "minute",
        (value) => updateSubTask(task._id, subtask._id, task.date, { minute: value }),
        (value) => updateSubTask(task._id, subtask._id, task.date, { minute: value })
    )

    return (
        <div
            className={`group/delete relative flex items-center w-full py-2 px-3 sm:px-4 justify-between  md:gap-3 transition-all duration-300
                ${subtask.status === "in-progress"
                    ? "bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                    : "bg-gray-100 hover:bg-gray-300 dark:bg-zinc-700/20 dark:hover:bg-zinc-600"
                }
            `}
        >
            <div className="flex">
                <div className="min-w-10 sm:w-12 relative flex items-center">

                    {isLast ? (
                        <>
                            <div className="absolute left-4 w-5 h-7 border-l-2 border-gray-300 dark:border-gray-500 -translate-y-1/2" />

                            <div className="absolute left-4 top-1/2 w-4 h-2 border-l-2 border-b-2 rounded-bl-md border-gray-300 dark:border-gray-500 -translate-y-1/2" />
                        </>
                    ) : (
                        <>
                            <div className="absolute left-4 top-1/2 w-4 border-l-2 border-b-2 border-gray-300 dark:border-gray-500 -translate-y-1/2" />

                            <div className="absolute left-4 top-1/2 w-4 h-14 border-l-2 border-gray-300 dark:border-gray-500 -translate-y-1/2" />
                        </>
                    )}

                </div>

                <div className="flex-1 flex items-center gap-2 sm:gap-4">

                    <div className="flex w-6 sm:w-10 select-none">
                        <span
                            onMouseDown={subHourDrag.startDrag}
                            className="font-semibold cursor-ns-resize select-none text-[10px] sm:text-base"
                        >
                            {formatTime(subtask.hour)}
                        </span>

                        <span className="text-[10px] sm:text-base">:</span>

                        <span
                            onMouseDown={subMinuteDrag.startDrag}
                            className="font-semibold cursor-ns-resize select-none text-[10px] sm:text-base"
                        >
                            {formatTime(subtask.minute)}
                        </span>
                    </div>

                    <input
                        type="checkbox"
                        checked={subtask.completed ?? false}
                        onChange={() => {
                            const completed = !subtask.completed

                            updateSubTask(task._id, subtask._id, task.date, {
                                completed,
                                status: completed ? "done" : "pending"
                            })
                        }}
                        className="w-3 h-3 sm:w-4 sm:h-4"
                    />

                    {editing ? (
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => {
                                updateSubTask(task._id, subtask._id, task.date, {
                                    name
                                })

                                setEditing(false)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    updateSubTask(task._id, subtask._id, task.date, {
                                        name
                                    })

                                    setEditing(false)
                                }
                            }}
                            autoFocus
                            className="w-38 sm:w-56 md:w-66 lg:w-85 border rounded bg-transparent outline-none border-none text-[12px] sm:text-base"
                        />
                    ) : (
                        <h2
                            onClick={() => setEditing(true)}
                            className="w-38 sm:w-56 md:w-66 lg:w-85 truncate select-none cursor-pointer min-h-[1em] text-[12px] sm:text-base"
                        >
                            {subtask.name}
                        </h2>
                    )}
                </div>
            </div>

            <div className="flex md:w-full items-center md:justify-between">
                <div className="hidden md:flex items-center gap-2">
                    <h1
                        onClick={() => {
                            if (subtask.completed) return

                            const nextStatus =
                                subtask.status === "pending"
                                    ? "in-progress"
                                    : "pending"

                            updateSubTask(task._id, subtask._id, task.date, {
                                status: nextStatus
                            })
                        }}
                        className={`flex px-3 py-1 font-semibold border select-none rounded-md w-30 justify-center
                            transition-all duration-200
                            hover:scale-110 active:scale-95
                            ${statusStyles[subtask.status ?? "pending"]}
                        `}
                    >
                        {statusMap[subtask.status ?? "pending"]}
                    </h1>
                </div>
                <div className="flex">
                    <div
                        onClick={() => {
                            if (subtask.completed) return

                            const nextStatus =
                                subtask.status === "pending"
                                    ? "in-progress"
                                    : "pending"

                            updateSubTask(task._id, subtask._id, task.date, {
                                status: nextStatus
                            })

                        }}
                        className={`md:hidden rounded-md  text-[10px] mx-1 p-1 sm:text-base
                                        ${statusStyles[subtask.status ?? "pending"]}
                                        `}
                    >
                        {React.createElement(statusMini[subtask.status ?? "pending"], {
                            className: "size-2 sm:size-5"
                        })}
                    </div>

                    <div
                        onClick={() => deleteSubTask(task._id, subtask._id)}
                        className="rounded-md flex items-center justify-center
                        bg-white/80 dark:bg-zinc-500 backdrop-blur 
                        border border-gray-200 dark:border-zinc-600 dark:text-white 
                        dark:hover:text-white hover:text-gray-900
                        shadow-sm text-gray-600 hover:text-gray-900
                        md:opacity-0  group-hover/delete:opacity-100
                        transition duration-400 p-1 md:p-2"
                    >
                        <FaTrash className="size-2 sm:size-5" />
                    </div>
                </div>
            </div>
        </div>
    )
}