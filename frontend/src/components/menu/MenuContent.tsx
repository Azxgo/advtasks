import type { Position } from "../../types/Menu"
import { Menu } from "../Menu"
import { useMenu } from "./MenuRoot"

type Props = {
    children: React.ReactNode
    position?: Position
    offset?: number

    closeOnOutside?: boolean
    onOutsideClick?: () => void
}

export function MenuContent({
    children,
    position,
    offset,
    closeOnOutside = true,
    onOutsideClick
}: Props) {
    const { open, closeMenu, anchorRef } = useMenu()

    function handleClose() {
        if (!closeOnOutside) return
    
        if (onOutsideClick) {
            onOutsideClick()
            return
        }

        closeMenu()
    }

    return (
        <Menu
            open={open}
            anchorRef={anchorRef}
            position={position}
            offset={offset}
            onClose={handleClose}
        >
            {children}
        </Menu>
    )
}