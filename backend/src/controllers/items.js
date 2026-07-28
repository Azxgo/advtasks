import Item from "../models/items.js"

export const getItems = async (req, res) => {
    try {
        const items = await Item.find().sort({ position: 1 })
        res.status(200).json(items)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const createItem = async (req, res) => {
    try {
        const lastItem = await Item.findOne().sort({ position: -1 })
        const nextPosition = lastItem ? lastItem.position + 1 : 0

        const item = await Item.create({
            ...req.body,
            color: "text-gray-500",
            position: nextPosition
        })
        res.status(201).json(item)
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
}

export const updateItem = async (req, res) => {
    try {
        const { id } = req.params

        const updated = await Item.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            { new: true }
        )

        if (!updated) {
            return res.status(404).json({ message: "Item no encontrado" })
        }

        res.status(200).json(updated)
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
}

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params
        const deletedItem = await Item.findByIdAndDelete(id)

        if (!deletedItem) {
            return res.status(404).json({ message: "Item no encontrado" })
        }
        res.status(200).json({ message: "Item eliminado", item: deletedItem })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const ReOrderItem = async (req, res) => {
    try {
        const { items } = req.body

        const bulk = items.map(item => ({
            updateOne: {
                filter: { _id: item.id },
                update: { position: item.position }
            }
        }))

        await Item.bulkWrite(bulk)
        res.status(200).json({ message: "Orden actualizado" })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const updateProgress = async (req, res) => {
    try {
        const { id } = req.params
        const { progress } = req.body

        const item = await Item.findById(id)

        if (!item) {
            return res.status(404).json({ message: "Item no encontrado" })
        }

        const safeProgress = Math.min(progress, item.total)

        item.progress = safeProgress
        await item.save()

        res.status(200).json(item)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}