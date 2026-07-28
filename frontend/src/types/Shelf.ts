import type { Dispatch, SetStateAction } from "react"
import type { ICONS } from "../utils/itemTypeIcons"
import type { FiltersState } from "./Filters"
import type { OrderState } from "./Order"

export type ShelfViewComponentProps = {
  items: GridItem[]
  setItems: Dispatch<SetStateAction<GridItem[]>>
  order: OrderState[] | null
  filters: FiltersState[]
  visibility: ShelfVisibility
  imageMode: "square" | "poster"
  onEdit: (item: GridItem) => void
  onDelete: (id: string) => void
  onIncrement: (id: string) => void
  onChangeIcon: (id: string, icon: IconKey | null) => void
}

export type ShelfItemViewComponentProps = {
    item: GridItem
    visibility: ShelfVisibility
    imageMode: "square" | "poster"
    onEdit: (item: GridItem) => void
    onDelete: (id: string) => void
    onIncrement: (id: string) => void
    onChangeIcon: (id: string, icon: IconKey | null) => void
}

export type GridItem = {
  id: string
  name: string
  total: number
  progress: number
  type: "book" | "series" | "anime" | "movie" | "other"
  status: "pending" | "in-progress" | "done"
  icon: ItemIcon
  score?: number
  image?: string
  color?: string

  startDate?: string
  endDate?: string
}


export type ShelfVisibility = {
  image: boolean
  name: boolean
  progress: boolean
  percentage: boolean
  type: boolean
  score: boolean
  dates: boolean
}

export const DEFAULT_VISIBILITY: ShelfVisibility = {
  image: true,
  name: true,
  progress: true,
  percentage: true,
  type: false,
  score: false,
  dates: true
}


export type IconKey = keyof typeof ICONS
export type ItemIcon = IconKey | null