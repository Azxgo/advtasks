import type { ShelfVisibility } from "../types/Shelf"

export const VISIBILITY_OPTIONS: {
    key: keyof ShelfVisibility
    label: string
}[] = [
        { key: "image", label: "Imagen" },
        { key: "name", label: "Nombre" },
        { key: "progress", label: "Progreso" },
        { key: "percentage", label: "Porcentaje" },
        { key: "type", label: "Tipo" },
        { key: "score", label: "Puntuacion" },
        { key: "dates", label: "Fechas" } 
    ]