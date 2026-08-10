import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaTimes } from "react-icons/fa"
import { levelColors } from "../../utils/formatTodo"
import type { TaskAttribute, TaskItem } from "../../types/Tasks"
import { AtributeToolTip } from "../ui/AttributeToolTip"
import { attributeIcons } from "../../utils/atributeIcons"

type Props = {
    task: TaskItem | null
    onClose: () => void
    onEdit: (
        id: string,
        updates: {
            name: string;
            hour: number;
            minute: number;
            level: number;
            attributes: TaskAttribute[];
        }
    ) => Promise<void>;
}

export function EditTaskModal({ task, onClose, onEdit }: Props) {


    const [name, setName] = useState(task?.name ?? "")
    const [time, setTime] = useState(
        `${(task?.hour ?? 0).toString().padStart(2, "0")}:${(task?.minute ?? 0)
            .toString()
            .padStart(2, "0")}`
    );

    const [difficulty, setDifficulty] = useState(task?.level ?? 1)
    const [attributes, setAttributes] = useState(task?.attributes ?? [])

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
        setAttributes(prev =>
            prev.includes(attr)
                ? prev.filter(a => a !== attr)
                : [...prev, attr]
        )
    }


    const handleEdit = async () => {
        if (!task) return;

        try {
            setLoading(true)
            const [hour, minute] = time
                ? time.split(":").map(Number)
                : [0, 0];

            await onEdit(task._id, {
                name,
                hour,
                minute,
                level: difficulty,
                attributes,
            });

            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (!task) return;

        setName(task.name);
        setTime(
            `${task.hour.toString().padStart(2, "0")}:${task.minute
                .toString()
                .padStart(2, "0")}`
        );
        setDifficulty(task.level ?? 1);
        setAttributes(task.attributes ?? []);
    }, [task]);

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
                className="relative bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 
                w-[90vw] sm:min-w-[700px] max-w-[800px] max-h-[90vh] shadow-lg overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base sm:text-xl font-bold">
                        Editar Tarea
                    </h2>

                    <button
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="grid sm:grid-cols-[130px_1fr] gap-x-4 gap-y-3 items-center">
                    <label className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e => setName(e.target.value))}
                        className="w-full mt-1 border border-gray-400 dark:border-zinc-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-zinc-500"
                    />

                    <label className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Hora</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e => setTime(e.target.value))}
                        className="w-full mt-1 border border-gray-400 dark:border-zinc-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-zinc-500"
                    />

                    <label className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400" >Dificultad</label>
                    <h1
                        onClick={() => changeDifficulty()}
                        className={`w-fit text-white px-3 py-1 rounded-full cursor-pointer select-none
                                    font-bold transition-all duration-200
                                    hover:scale-110 active:scale-95 
                                    ${levelColors[difficulty || 1]}`}>{difficulty}
                    </h1>

                    <label className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400" >Atributos</label>
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
                </div>

                <div className="flex justify-between mt-3">
                    <button
                        type="button"
                        onClick={handleEdit}
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