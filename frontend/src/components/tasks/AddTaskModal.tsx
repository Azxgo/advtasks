import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FaTimes } from "react-icons/fa"
import { levelColors } from "../../utils/formatTodo"
import type { TaskAttribute } from "../../types/Tasks"
import { AtributeToolTip } from "../ui/AttributeToolTip"
import { attributeIcons } from "../../utils/atributeIcons"

type Props = {
    onClose: () => void
    onAdd: (task: any) => Promise<void>
}

export function AddTaskModal({ onClose, onAdd }: Props) {

    const days = ["M", "T", "W", "T", "V", "S", "S"]

    const [name, setName] = useState("")
    const [time, setTime] = useState("")
    const [date, setDate] = useState("")

    const [difficulty, setDifficulty] = useState(1)
    const [attributes, setAttirbutes] = useState<TaskAttribute[]>([])

    const [repeatTask, setRepeatTask] = useState(false)
    const [selectedDays, setSelectedDays] = useState<number[]>([])
    const [endDate, setEndDate] = useState("")

    const [loading, setLoading] = useState(false)

    const allAttributes: TaskAttribute[] = [
        "work",
        "learning",
        "creative",
        "social",
        "recreation",
    ];

    const changeDifficulty = () => {
        setDifficulty(prev => prev >= 5 ? 1 : prev + 1)
    }

    const handleAttributes = (attr: TaskAttribute) => {
        setAttirbutes(prev =>
            prev.includes(attr)
                ? prev.filter(a => a !== attr)
                : [...prev, attr]
        )
    }

    const toggleDay = (index: number) => {
        setSelectedDays(prev =>
            prev.includes(index)
                ? prev.filter(d => d !== index)
                : [...prev, index]
        )
    }

    const handleAdd = async () => {
        try {

            if (repeatTask) {

                if (selectedDays.length === 0) {
                    alert("Selecciona al menos un día");
                    return;
                }

                if (!endDate) {
                    alert("Selecciona una fecha final");
                    return;
                }
            }

            const [hour, minute] = time
                ? time.split(":").map(Number)
                : [0, 0]

            await onAdd({
                name,
                hour,
                minute,
                level: difficulty,
                attributes,
                status: "pending",
                completed: false,
                date,

                repeatTask,
                selectedDays,
                endDate
            })

            onClose()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center "
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 min-w-[700px] shadow-lg"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        Añadir Tarea
                    </h2>

                    <button
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-3 items-center">
                    <label className="font-medium text-gray-600 dark:text-gray-400">Nombre </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e => setName(e.target.value))}
                        className="w-full mt-1 border border-gray-400 dark:border-zinc-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-zinc-500"
                    />

                    <label className="font-medium text-gray-600 dark:text-gray-400">Hora</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e => setTime(e.target.value))}
                        className="w-full mt-1 border border-gray-400 dark:border-zinc-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-zinc-500"
                    />

                    <label className="font-medium text-gray-600 dark:text-gray-400" >Fecha</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full mt-1 border border-gray-400 dark:border-zinc-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-zinc-500"
                    />

                    <label className="font-medium text-gray-600 dark:text-gray-400" >Dificultad</label>
                    <h1
                        onClick={() => changeDifficulty()}
                        className={`w-fit text-white px-3 py-1 rounded-full cursor-pointer select-none
                                    font-bold transition-all duration-200
                                    hover:scale-110 active:scale-95 
                                    ${levelColors[difficulty || 1]}`}>{difficulty}
                    </h1>

                    <label className="font-medium text-gray-600 dark:text-gray-400" >Atributos</label>
                    <div className="flex gap-4">
                        {allAttributes.map((attr) => {
                            const Icon = attributeIcons[attr];
                            const active = attributes.includes(attr);

                            return (
                                <AtributeToolTip key={attr} text={attr}>
                                    <Icon
                                        onClick={() => handleAttributes(attr)}
                                        className={`
                                                  text-3xl cursor-pointer transition-all duration-200
                                                  ${active
                                                ? "text-purple-500 scale-110 drop-shadow-lg"
                                                : "text-gray-400 opacity-40 hover:opacity-100"}
                                                    `}
                                    />
                                </AtributeToolTip>
                            );
                        })}
                    </div>

                    <label className="font-medium text-gray-600 dark:text-gray-400">Repetir Tarea</label>

                    <div className="flex items-center gap-4">
                        <input
                            type="checkbox"
                            onClick={() => setRepeatTask(prev => !prev)}
                            className="w-4 h-4 accent-purple-500 cursor-pointer"
                        />

                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Agregar la misma tarea varios dias
                        </span>
                    </div>

                </div>
                <div className={`overflow-hidden transition-[max-height,opacity,padding] duration-500 ease-in-out
                        ${repeatTask ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-3 items-center mt-3">
                        <label className="font-medium text-gray-600 dark:text-gray-400">Dias</label>
                        <div className="flex gap-2">
                            {days.map((day, i) => {
                                const dayNumber = i + 1
                                return (
                                    <button
                                        key={i}
                                        onClick={() => toggleDay(dayNumber)}
                                        className={`h-9 w-9 rounded-full font-medium border border-gray-300 dark:border-zinc-600 transition-all duration-200
                                        ${selectedDays.includes(dayNumber)
                                                ? "bg-blue-500 dark:bg-indigo-700  text-white scale-110"
                                                : "bg-gray-200 dark:bg-zinc-600 text-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600/50"
                                            }
                                        `}
                                    >
                                        {day}
                                    </button>

                                )
                            })}
                        </div>

                        <label className="font-medium text-gray-600 dark:text-gray-400">Finaliza</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="w-full mt-1 border border-gray-400 dark:border-zinc-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-zinc-500"
                        />
                    </div>
                </div>
                <div className="flex justify-between mt-3">

                    <button
                        type="button"
                        onClick={handleAdd}
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