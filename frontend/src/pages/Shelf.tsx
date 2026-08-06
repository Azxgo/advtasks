//import { useEffect, useState } from "react";
//import { ToolBar } from "../components/shelf/ToolBar";
//import { DEFAULT_VISIBILITY, type GridItem, type IconKey, type ShelfVisibility } from "../types/Shelf"
//import { GridShelf } from "../components/shelf/GridShelf";
//import { ItemModal } from "../components/shelf/ItemModal";
//import { ListShelf } from "../components/shelf/ListShelf";
//import type { OrderState } from "../types/Order";
//import type { FiltersState } from "../types/Filters";
//
//type ViewMode = "grid" | "list"
//type ImageMode = "square" | "poster"
//
//const VIEWS = {
//    grid: GridShelf,
//    list: ListShelf
//} as const
//
//export default function Shelf() {
//    const [view, setView] = useState<ViewMode>("grid")
//    const [imageMode, setImageMode] = useState<ImageMode>("square")
//
//    const [visibility, setVisibility] = useState<ShelfVisibility>(() => {
//        const saved = localStorage.getItem("shelf_visibility")
//        return saved ? JSON.parse(saved) : DEFAULT_VISIBILITY
//    })
//
//    const [order, setOrder] = useState<OrderState[]>(() => {
//        const saved = localStorage.getItem("shelf_order")
//        return saved
//            ? JSON.parse(saved)
//            : [{ key: "name", direction: "asc" }]
//    })
//
//    const [filters, setFilters] = useState<FiltersState[]>(() => {
//        const saved = localStorage.getItem("shelf_filters")
//        return saved ? JSON.parse(saved) : []
//    })
//
//    const [items, setItems] = useState<GridItem[]>([])
//
//    const ViewComponent = VIEWS[view]
//
//    const [openModal, setOpenModal] = useState(false)
//    const [editingItem, setEditingItem] = useState<GridItem | null>(null)
//
//    useEffect(() => {
//        localStorage.setItem(
//            "shelf_visibility",
//            JSON.stringify(visibility)
//        )
//    }, [visibility])
//
//    const handleSubmitItem = async (data: Omit<GridItem, "id">, id?: string) => {
//        if (id) {
//            const res = await fetch(`http://localhost:3000/api/item/update/${id}`, {
//                method: "PUT",
//                headers: { "Content-Type": "application/json" },
//                body: JSON.stringify(data)
//            })
//
//            const updated: GridItem = await res.json()
//
//            setItems(items =>
//                items.map(item => item.id === id ? updated : item)
//            )
//        } else {
//            const res = await fetch("http://localhost:3000/api/item/add", {
//                method: "POST",
//                headers: { "Content-Type": "application/json" },
//                body: JSON.stringify(data)
//            })
//
//            const created: GridItem = await res.json()
//
//            setItems(items => [...items, created])
//        }
//    }
//
//    const handleDeleteItem = async (id: string) => {
//        await fetch(`http://localhost:3000/api/item/delete/${id}`, {
//            method: "DELETE"
//        })
//
//        setItems(prev => prev.filter(item => item.id !== id))
//    }
//
//    const handleChangeIcon = async (id: string, icon: IconKey | null) => {
//        setItems(items =>
//            items.map(item =>
//                item.id === id
//                    ? { ...item, icon }
//                    : item
//            )
//        )
//
//        await fetch(`http://localhost:3000/api/item/update/${id}`, {
//            method: "PUT",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify({ icon })
//        })
//    }
//
//    const incrementItem = (id: string) => {
//        setItems(items =>
//            items.map(item => {
//                if (item.id !== id) return item
//
//                const next = Math.min(item.progress + 1, item.total)
//
//                fetch(`http://localhost:3000/api/item/progress/${id}`, {
//                    method: "PATCH",
//                    headers: { "Content-Type": "application/json" },
//                    body: JSON.stringify({ progress: next })
//                })
//
//                return { ...item, progress: next }
//            })
//        )
//    }
//
//
//    useEffect(() => {
//        const fetchItems = async () => {
//            try {
//                const res = await fetch("http://localhost:3000/api/item/getAll")
//                const data: GridItem[] = await res.json()
//                setItems(data)
//            } catch (error) {
//                console.error("Error al cargar items", error)
//            }
//        }
//
//        fetchItems()
//    }, [])
//
//    useEffect(() => {
//        localStorage.setItem(
//            "shelf_order",
//            JSON.stringify(order)
//        )
//    }, [order])
//
//    useEffect(() => {
//        localStorage.setItem(
//            "shelf_filters",
//            JSON.stringify(filters)
//        )
//    }, [filters])
//
//    return (
//        <section className="flex flex-col gap-4">
//            <ToolBar
//                order={order}
//                filters={filters}
//                view={view}
//                imageMode={imageMode}
//                visibility={visibility}
//                onVisibilityChange={setVisibility}
//                onViewChange={setView}
//                onImageModeChange={setImageMode}
//                onOrderChange={setOrder}
//                onFilterChange={setFilters}
//                onAddClick={() => setOpenModal(true)}
//            />
//
//            <ViewComponent
//                order={order}
//                filters={filters}
//                items={items}
//                setItems={setItems}
//                imageMode={imageMode}
//                visibility={visibility}
//                onEdit={(item) => {
//                    setEditingItem(item)
//                    setOpenModal(true)
//                }}
//                onDelete={handleDeleteItem}
//                onIncrement={incrementItem}
//                onChangeIcon={handleChangeIcon}
//            />
//
//            {openModal && (
//                <ItemModal
//                    item={editingItem ?? undefined}
//                    onClose={() => {
//                        setOpenModal(false)
//                        setEditingItem(null)
//                    }}
//                    onSubmit={handleSubmitItem}
//                />
//            )}
//        </section>
//    )
//}