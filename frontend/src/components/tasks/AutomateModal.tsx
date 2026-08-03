import { FaTimes } from "react-icons/fa";
import type { TaskItem } from "../../types/Tasks";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import { apiClient } from "../../config/apiClient";

type Props = {
    task: TaskItem | null
    onClose: () => void
    saveAutomation: (data: {
        taskId: string;
        daysOfWeek: number[];
        startDate: string;
        endDate: string;
        time: string;
    }) => Promise<any>;
    deleteAutomation: (taskId: string) => void
}

export function AutomateModal({ task, onClose, saveAutomation, deleteAutomation }: Props) {

    const days = ["M", "T", "W", "T", "V", "S", "S"]

    const [hasAutomation, setHasAutomation] = useState(false)

    const [selectedDays, setSelectedDays] = useState<number[]>([])
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [time, setTime] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!task) return

        const fetchAutomation = async () => {
            try {

                const res = await apiClient(`/api/automation/task/${task._id}`, {})

                if (!res.ok) return;

                const data = await res.json();

                if (data) {
                    setHasAutomation(true);
                    setSelectedDays(data.daysOfWeek || []);
                    setStartDate(data.startDate?.slice(0, 10) || "");
                    setEndDate(data.endDate?.slice(0, 10) || "");
                    setTime(
                        `${String(data.generationHour).padStart(2, "0")}:${String(data.generationMinute).padStart(2, "0")}`
                    )
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchAutomation()
    }, [task])

    const toggleDay = (index: number) => {
        setSelectedDays(prev =>
            prev.includes(index)
                ? prev.filter(d => d !== index)
                : [...prev, index]
        )
    }

    const handleSave = async () => {
        if (!task) return;

        if (selectedDays.length === 0) {
            alert("Selecciona al menos un día");
            return;
        }

        if (!startDate || !endDate) {
            alert("Selecciona fechas");
            return;
        }

        try {
            setLoading(true);

            await saveAutomation({
                taskId: task._id,
                daysOfWeek: selectedDays,
                startDate,
                endDate,
                time
            })

            onClose();

        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!task) return;

        const confirmDelete = confirm("¿Quitar automatización?");
        if (!confirmDelete) return;

        try {
            await deleteAutomation(task._id);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 w-[90vw] sm:min-w-[700px] max-w-[800px] shadow-lg "
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base sm:text-xl font-bold ">
                        Automatizar tarea
                    </h2>

                    <button
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="grid sm:grid-cols-[130px_1fr] gap-x-4 gap-y-2 sm:gap-y-3 items-center">
                    <label className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Dias </label>
                    <div className="flex gap-2">
                        {days.map((day, i) => {
                            const dayNumber = i + 1
                            return (
                                <button
                                    key={i}
                                    onClick={() => toggleDay(dayNumber)}
                                    className={`h-9 w-9 rounded-full font-medium border border-gray-300 dark:border-zinc-600 cursor-pointer transition-all duration-300
                                        ${selectedDays.includes(dayNumber)
                                            ? "bg-indigo-500 dark:bg-indigo-700 text-white scale-110"
                                            : "bg-gray-200 dark:bg-zinc-600 text-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600/50"
                                        }
                                        `}
                                >
                                    {day}
                                </button>

                            )
                        })}
                    </div>

                    <label className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400" >Comienza en</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full mt-1 border border-gray-400 dark:border-zinc-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-zinc-500"
                    />

                    <label className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400" >Termina en</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e => setEndDate(e.target.value))}
                        className="w-full mt-1 border border-gray-400 dark:border-zinc-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-zinc-500"
                    />

                    <label className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Hora de creación</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e => setTime(e.target.value))}
                        className="w-full mt-1 border border-gray-400 dark:border-zinc-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-zinc-500"
                    />
                </div>

                <div className="flex justify-between mt-3">
                    {hasAutomation && (
                        <button
                            onClick={handleDelete}
                            className=" border border-red-500 rounded hover:bg-red-50
                            flex items-center gap-2 dark:border-red-800 rounded-lg px-4 py-2
                         dark:hover:bg-red-900 transition-all duration-300 cursor-pointer"
                        >
                            Quitar automatización
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2
                        hover:bg-gray-100 dark:hover:bg-zinc-700  transition-all duration-300 cursor-pointer"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}