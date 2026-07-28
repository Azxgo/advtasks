export type FiltersItems = {
    name: string
    type: "book" | "series" | "anime" | "movie" | "other"
    status: "pending" | "in-progress" | "done"
    progress: number

    startDate?: string
    endDate?: string
}

export type FilterValueType = "string" | "number" | "date" | "enum"

export type FilterConfigItem = {
    key: keyof FiltersItems
    label: string
    type: FilterValueType
    options?: string[]
}

export type FilterOperator =
    | "equals"
    | "contains"
    | "gt"
    | "lt"
    | "between"

export type FiltersState = {
    key: keyof FiltersItems
    operator: FilterOperator
    value: string | number | string[]
}

export const FILTER_CONFIG: FilterConfigItem[] = [
    {
        key: "name",
        label: "Nombre",
        type: "string"
    },
    {
        key: "type",
        label: "Tipo",
        type: "enum",
        options: ["book", "series", "anime", "movie", "other"]
    },
    {
        key: "status",
        label: "Estado",
        type: "enum",
        options: ["pending", "in-progress", "done"]
    },
    {
        key: "progress",
        label: "Progreso",
        type: "number"
    },
    {
        key: "startDate",
        label: "Inicio",
        type: "date"
    },
    {
        key: "endDate",
        label: "Fin",
        type: "date"
    }
]