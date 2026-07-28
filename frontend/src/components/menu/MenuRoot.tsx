import { createContext, useContext, useRef, useState } from "react"

type Ctx = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    anchorRef: React.RefObject<HTMLButtonElement | null>
    closeMenu: () => void
}

const MenuContext = createContext<Ctx | null>(null)

export function MenuRoot({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
    const [open, setOpen] = useState(false)
    const anchorRef = useRef<HTMLButtonElement | null>(null)

    const closeMenu = () => {
        onClose?.()
        setOpen(false)
    }

    return (
        <MenuContext.Provider value={{ open, setOpen, anchorRef, closeMenu }}>
            {children}
        </MenuContext.Provider>
    )
}

export function useMenu() {
    const ctx = useContext(MenuContext)
    if (!ctx) throw new Error("Los compoenentes deben estar dentro de <MenuRoot>")
    return ctx
}