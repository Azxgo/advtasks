export type OrderItems = {
    name: string
    total: number
    progress: number
    type: "book" | "series" | "anime" | "movie" | "other"
    status: "pending" | "in-progress" | "done"
    score?: number

    startDate?: string
    endDate?: string
}

export type OrderValueType = "string" | "number" | "date"

export type OrderConfigItem = {
    key: keyof OrderItems
    label: string
    type: OrderValueType
}


export type OrderDirection = "asc" | "desc"

export type OrderState = {
  key: keyof OrderItems
  direction: OrderDirection
}

export const ORDER_CONFIG: OrderConfigItem[] = [
    { key: "name", label: "Nombre", type: "string" },
    { key: "progress", label: "Avance (%)", type: "number" },
    { key: "score", label: "Puntuación", type: "number" },
    { key: "startDate", label: "Inicio", type: "date" },
    { key: "endDate", label: "Fin", type: "date" }
]