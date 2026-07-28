import type { GridItem } from "../types/Shelf"

export const STATUS_STYLES: Record<GridItem["status"], string> = {
    pending: "border-yellow-500 /*dark:border-yellow-600/30*/",
    "in-progress": "border-blue-500 /*dark:border-blue-600/30*/",
    done: "border-green-500 /*dark:border-green-600/30*/",

}