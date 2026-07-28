import { createContext, useContext, useState, type ReactNode } from "react"
import type { TaskItem } from "../types/Tasks";

type TasksContextType = {
    tasks: TaskItem[]
    setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
    updateTask: (updatedTask: TaskItem) => void;
}

export const TasksContext = createContext<TasksContextType | null>(null)

export const useTasksContext = () => {
    const context = useContext(TasksContext)

    if (!context) {
        throw new Error("useTasksContext debe usarse dentro de TasksProvider")
    }
    return context

}

export const TasksProvider = ({ children }: { children: ReactNode }) => {

    const [tasks, setTasks] = useState<TaskItem[]>([])

    // Funcion para updatear la task en local
    const updateTask = (updatedTask: TaskItem) => {
        setTasks(prev =>
            prev.map(t => t._id === updatedTask._id ? updatedTask : t)
        )
    }

    return (
        <TasksContext.Provider value={{ tasks, setTasks, updateTask }}>
            {children}
        </TasksContext.Provider>
    )
}