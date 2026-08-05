import { FaCalendarAlt, FaCopy, FaEdit, FaEllipsisV, FaHistory, FaListUl, FaTrash } from "react-icons/fa";
import { attributeIcons } from "../../utils/atributeIcons";
import { levelColors, statusMap, statusMini, statusStyles } from "../../utils/formatTodo";
import type { TaskAttribute, TaskItem } from "../../types/Tasks";
import React, { useRef, useState } from "react";
import { useTimeDrag } from "../../hooks/useTimeDrag";
import { MenuRoot } from "../menu/MenuRoot";
import { MenuButton } from "../menu/MenuButton";
import { MenuContent } from "../menu/MenuContent";
import { MenuItem } from "../menu/MenuItem";
import { AtributeToolTip } from "../ui/AttributeToolTip";
import { SubTaskItem } from "./SubTaskItem";
import { ConfirmModal } from "../ui/ConfirmModal";


type Props = {
    task: TaskItem;
    allAttributes: TaskAttribute[];
    toggleCompleted: (id: string, taskDate: Date | string) => void;
    changeStatus: (id: string, taskDate: Date | string) => void;
    changeDificult: (id: string, taskDay: Date | string) => void;
    changeAtribute: (id: string, attr: TaskAttribute, taskDay: Date | string) => void;
    changeName: (id: string, name: string) => void;
    changeTimeLocal: (id: string, field: "hour" | "minute", value: number) => void;
    saveTime: (id: string, field: "hour" | "minute", value: number) => void;
    onAutomate: (task: TaskItem) => void
    onReschedule: (task: TaskItem) => void
    onEdit: (task: TaskItem) => void
    onDuplicate: (id: string) => void
    onDelete: (id: string) => void
    onAddSubTask: (id: string) => void
    updateSubTask: (taskId: string, subTaskId: string, taskDate: Date | string, updates: Partial<TaskItem>) => void
    deleteSubTask: (taskId: string, subTaskId: string) => void
}

export function TaskItem({ task, allAttributes, toggleCompleted, changeStatus, changeDificult,
    changeAtribute, changeName, changeTimeLocal, saveTime, onAutomate, onReschedule, onEdit,
    onDuplicate, onDelete, onAddSubTask, updateSubTask, deleteSubTask }: Props) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(task.name)

    const [expanded, setExpanded] = useState(false)

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const hourDrag = useTimeDrag(
        task.hour,
        "hour",
        (value) => changeTimeLocal(task._id, "hour", value),
        (value) => saveTime(task._id, "hour", value)
    );

    const minuteDrag = useTimeDrag(
        task.minute,
        "minute",
        (value) => changeTimeLocal(task._id, "minute", value),
        (value) => saveTime(task._id, "minute", value)
    );

    const handleSave = () => {
        changeName(task._id, name)
        setEditing(false)
    }

    const formatTime = (num: number) => {
        if (num === -1) return "--";
        return String(num).padStart(2, "0");
    };


    return (
        <div
            className={`flex flex-col w-full group transition`}
            key={task._id}
        >
            <div className={`flex px-3 sm:px-4 py-3 w-full items-center transition-all duration-300
                                ${task.status === "in-progress"
                    ? "bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                    : "bg-gray-100 hover:bg-gray-300 dark:bg-zinc-700/20 dark:hover:bg-zinc-600"
                }
                `}>
                <div className="flex w-full items-center gap-2 sm:gap-4">
                    <div className="flex w-6 sm:w-10 select-none">
                        <span
                            onMouseDown={hourDrag.startDrag}
                            className="font-semibold cursor-ns-resize select-none text-[10px] sm:text-base"
                        >
                            {formatTime(task.hour)}
                        </span>

                        <span className="text-[10px] sm:text-base">:</span>

                        <span
                            onMouseDown={minuteDrag.startDrag}
                            className="font-semibold cursor-ns-resize select-none text-[10px] sm:text-base"
                        >
                            {formatTime(task.minute)}
                        </span>
                    </div>
                    <input
                        type="checkbox"
                        checked={task.completed ?? false}
                        onChange={() => toggleCompleted(task._id, task.date)}
                        className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                    {editing ? (
                        <input
                            ref={inputRef}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSave()
                                }
                            }}
                            autoFocus
                            className="w-40 sm:w-56 tablet:w-67 lg:w-80 border rounded bg-transparent outline-none border-none text-[12px] sm:text-base"
                        />
                    )
                        : (
                            <h2
                                onClick={() => setEditing(true)}
                                className="w-40 sm:w-56 tablet:w-67 lg:w-80  truncate select-none cursor-pointer min-h-[1em]
                                text-[12px] sm:text-base"
                            >
                                {task.name}
                            </h2>
                        )
                    }

                    {task.hasAutomation && (
                        <FaHistory className="text-blue-500 text-sm" />
                    )}

                    {task.originalTaskId && (
                        <FaHistory className="text-gray-400 text-sm" />
                    )}

                </div>

                <div className="flex items-center w-full">
                    <div className="hidden md:flex items-center w-full justify-around gap-2">
                        <h1
                            onClick={() => {
                                if (!task.completed) {
                                    changeStatus(task._id, task.date)
                                }
                            }}
                            className={`flex px-1 lg:px-3 py-1 font-semibold border select-none rounded-md lg:w-30 justify-center
                                            transition-all duration-200
                                            text-xs tablet:text-[10px] lg:text-base
                                            hover:scale-110  active:scale-95 
                                         ${statusStyles[task.status ?? "pending"]}`}>
                            {statusMap[task.status ?? "pending"]}
                        </h1>
                        <h1
                            onClick={() => changeDificult(task._id, task.date)}
                            className={`text-white px-3 py-1 rounded-full cursor-pointer select-none
                                            font-bold transition-all duration-200
                                            hover:scale-110 active:scale-95
                                        ${levelColors[task.level || 1]}`}>{task.level}
                        </h1>
                        <div className="flex flex-wrap tablet:gap-2 lg:gap-4">
                            {allAttributes.map((attr) => {
                                const Icon = attributeIcons[attr];
                                const active = task.attributes?.includes(attr);

                                return (
                                    <AtributeToolTip key={attr} text={attr}>
                                        <Icon
                                            onClick={() => changeAtribute(task._id, attr, task.date)}
                                            className={`
                                                  tablet:text-2xl lg:text-3xl cursor-pointer transition-all duration-200
                                                  ${active
                                                    ? "text-indigo-500 scale-110 drop-shadow-lg"
                                                    : "text-gray-400 opacity-40 hover:opacity-100"}
                                                    `}
                                        />
                                    </AtributeToolTip>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => {
                        if (!task.completed) {
                            changeStatus(task._id, task.date)
                        }
                    }}
                    className={`md:hidden rounded-md  text-[10px] mx-1 p-1 sm:text-base
                        ${statusStyles[task.status ?? "pending"]}
                        `}
                >
                    {React.createElement(statusMini[task.status ?? "pending"], {
                        className: "size-2 sm:size-5"
                    })}
                </div>
                <MenuRoot>
                    <MenuButton
                        className="rounded-md flex items-center justify-center
                            bg-white/80 dark:bg-zinc-500 backdrop-blur 
                            border border-gray-200 dark:border-zinc-600 shadow-sm text-gray-600 dark:text-white 
                            dark:hover:text-white hover:text-gray-900
                            md:opacity-0 group-hover:opacity-100 transition duration-400
                            p-1 md:p-2"
                    >
                        <FaEllipsisV className="size-2 sm:size-5" />
                    </MenuButton>
                    <MenuContent position="bottom">
                        <MenuItem
                            onClick={() => onEdit(task)}
                            className="md:hidden flex w-full gap-2 py-2 items-center rounded-lg cursor-pointer"
                        >
                            <FaEdit color={"gray"} className="size-4 sm:size-6" />
                            <p className="text-xs sm:text-base font-semibold">Editar</p>
                        </MenuItem>
                        {!task.originalTaskId && (
                            <MenuItem
                                onClick={() => onAutomate(task)}
                                className="flex w-full gap-2 py-2 items-center rounded-lg cursor-pointer"
                            >
                                <FaHistory color={"gray"} className="size-4 sm:size-6" />
                                <p className="text-xs sm:text-base font-semibold">Automatizar</p>
                            </MenuItem>
                        )}

                        <MenuItem
                            onClick={() => onReschedule(task)}
                            className="flex w-full gap-2 py-2  items-center rounded-lg cursor-pointer"
                        >
                            <FaCalendarAlt color={"gray"} className="size-4 sm:size-6" />
                            <p className="text-xs sm:text-base font-semibold">Reprogramar</p>
                        </MenuItem>
                        <MenuItem
                            onClick={() => onAddSubTask(task._id)}
                            className="flex w-full gap-2 py-2  items-center rounded-lg cursor-pointer"
                        >
                            <FaListUl color={"gray"} className="size-4 sm:size-6" />
                            <p className="text-xs sm:text-base font-semibold">Añadir Subtarea</p>
                        </MenuItem>
                        <MenuItem
                            onClick={() => onDuplicate(task._id)}
                            className="flex w-full gap-2 p-2 items-center rounded-lg cursor-pointer"
                        >
                            <FaCopy color={"gray"} className="size-4 sm:size-6" />
                            <p className="text-xs sm:text-base font-semibold">Duplicar</p>
                        </MenuItem>
                        <MenuItem
                            onClick={() => setConfirmModalOpen(true)}
                            className="flex w-full gap-2 p-2 items-center rounded-lg cursor-pointer"
                        >
                            <FaTrash color={"gray"} className="size-4 sm:size-6" />
                            <p className="text-xs sm:text-base font-semibold">Borrar</p>
                        </MenuItem>
                    </MenuContent>
                </MenuRoot>
            </div>
            {task.subTasks.length > 0 && (
                <div className="flex flex-col items-center">
                    {[...task.subTasks]
                        .sort((a, b) => a.order - b.order)
                        .map((subtask, index, arr) => (
                            <SubTaskItem
                                key={subtask._id}
                                task={task}
                                subtask={subtask}
                                updateSubTask={updateSubTask}
                                deleteSubTask={deleteSubTask}
                                isLast={index === arr.length - 1}
                            />
                        ))}
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModalOpen}
                title={"¿Estás seguro de borrar este elemento?"}
                description="¡No podrás revertir esta acción!"
                onConfirm={() => onDelete(task._id)}
                onCancel={() => setConfirmModalOpen(false)}
            />

        </div>
    )
}