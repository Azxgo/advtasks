import { useMemo } from "react"
import type { GridItem } from "../types/Shelf"
import { type OrderState } from "../types/Order"
import type { FiltersState } from "../types/Filters"

type Props = {
    items: GridItem[]
    order: OrderState[] | null
    filters: FiltersState[]
}

export function useShelfItems({ items, order, filters }: Props) {
    return useMemo(() => {
        let result = [...items]

        if (filters.length) {
            result = result.filter(item => {
                return filters.every(filter => {
                    const value = item[filter.key as keyof GridItem]

                    if (value == null) return null

                    if (Array.isArray(filter.value)) {
                        if (filter.value.length === 0) return true
                        return filter.value.includes(String(value))
                    } 

                    switch (filter.operator) {
                        case "contains":
                            return String(value)
                                .toLowerCase()
                                .includes(String(filter.value).toLowerCase())

                        case "equals":
                            return value === filter.value

                        case "gt":
                            return Number(value) > Number(filter.value)

                        case "lt":
                            return Number(value) < Number(filter.value)

                        default: 
                            return true
                    }
                })
            })
        }

        if (order?.length) {
            result.sort((a, b) => {
                for (const rule of order) {
                    let diff = 0

                    if (rule.key === "progress" || rule.key === "total") {
                        const aPct = a.total ? a.progress / a.total : 0
                        const bPct = b.total ? b.progress / b.total : 0
                        diff = aPct - bPct
                    } else {
                        diff = String(a[rule.key]).localeCompare(String(b[rule.key]))
                    }

                    if (diff !== 0) {
                        return rule.direction === "asc" ? diff : -diff
                    }
                }
                return 0
            })
        }

        return result
    }, [items, filters, order])
}