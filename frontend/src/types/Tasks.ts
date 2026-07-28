export type SubTask = {
    _id: string
    name: string
    hour: number
    minute: number
    completed: boolean
    status: "pending" | "in-progress" | "done" | "missed"
    order: number
}

export type TaskItem = {
    _id: string
    completed: boolean
    name: string
    hour: number
    minute: number
    status: "pending" | "in-progress" | "done" | "missed"
    attributes?: TaskAttribute[];
    level?: number
    date: string
    hasAutomation: boolean
    subTasks: SubTask[]
    order: number
    originalTaskId?: string
}

export type TaskAttribute =
    | "work"
    | "learning"
    | "creative"
    | "social"
    | "recreation";