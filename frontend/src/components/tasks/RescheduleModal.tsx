import { FaTimes } from "react-icons/fa";
import type { TaskItem } from "../../types/Tasks";
import { useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion"
import { apiClient } from "../../config/apiClient";

type Props = {
    task: TaskItem | null
    setTasks: Dispatch<SetStateAction<TaskItem[]>>
    onClose: () => void
}

export function RescheduleModal({ task, setTasks, onClose }: Props) {
    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString("sv-SE")
    }

    const [date, setDate] = useState(
        task ? formatDate(task.date) : ""
    )

    const handleReschedule = async () => {

        await apiClient(`/api/tasks/reschedule/${task?._id}/`,
            {
                method: "PATCH",
                body: JSON.stringify({ date })
            }
        )
        setTasks(prev =>
            prev.filter(t => t._id !== task?._id)
        )

        onClose()
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white dark:bg-zinc-800 rounded-xl p-6 w-[700px] shadow-lg border border-gray-200 dark:border-zinc-700 shadow-lg"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        Reprogramar tarea
                    </h2>

                    <button
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>

                </div>

                <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-3 items-center">

                    <label className="font-medium text-gray-600 dark:text-gray-400" >Fecha</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full mt-1 border border-gray-400 dark:border-zinc-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-zinc-500"
                    />
                </div>
                <div className="flex justify-between mt-3">

                    <button
                        type="button"
                        onClick={handleReschedule}

                        className="flex items-center gap-2 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2
                        hover:bg-gray-100 dark:hover:bg-zinc-700  transition-all duration-300 cursor-pointer"
                    >
                        Guardar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}