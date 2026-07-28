import type { GridItem } from "../types/Shelf";

export const ITEM_TYPE_LABEL: Record<GridItem["type"],
  {
    label: string
    color: string
  }> = {
  book: {
    label: "Libro",
    color: "bg-blue-500 text-white"
  },
  series: {
    label: "Serie",
    color: "bg-purple-500 text-white"
  },
  anime: {
    label: "Anime",
    color: "bg-pink-500 text-white"
  },
  movie: {
    label: "Película",
    color: "bg-red-500 text-white"
  },
  other: {
    label: "Otro",
    color: "bg-gray-500 text-white"
  }
}
