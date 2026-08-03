import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import type { Position } from "../types/Menu"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
    open: boolean
    onClose: () => void
    children: React.ReactNode
    anchorRef: React.RefObject<HTMLElement | null>
    position?: Position
    offset?: number
}

export function Menu({ open, onClose, children, anchorRef, position = "right", offset = 6 }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const [pos, setPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        if (!open) return

        function handlePointer(e: PointerEvent) {
            const target = e.target as Node

            if (
                ref.current?.contains(target) ||
                anchorRef.current?.contains(target)
            ) return

            onClose()
        }

        function handleScroll() {
            onClose()
        }

        document.addEventListener("pointerdown", handlePointer)
        window.addEventListener("scroll", handleScroll, true)
        return () => {
            document.removeEventListener("pointerdown", handlePointer)
            window.removeEventListener("scroll", handleScroll, true)
        }
    }, [open, onClose, anchorRef])

    useLayoutEffect(() => {
        if (!open || !anchorRef.current || !ref.current) return

        const menu = ref.current.getBoundingClientRect()
        const btn = anchorRef.current.getBoundingClientRect()

        let x = 0
        let y = 0

        const SCREEN_PADDING = 16;

        switch (position) {
            case "right":
                x = btn.right + offset
                y = btn.top

                if (x + menu.width > window.innerWidth - SCREEN_PADDING) {
                    x = btn.left - menu.width - offset
                }

                if (y + menu.height > window.innerHeight - SCREEN_PADDING) {
                    y = window.innerHeight - menu.height - SCREEN_PADDING
                }

                if (y < SCREEN_PADDING) {
                    y = SCREEN_PADDING
                }
                break

            case "left":
                x = btn.left - menu.width - offset
                y = btn.top

                if (x < SCREEN_PADDING) {
                    x = btn.right + offset
                }

                if (y + menu.height > window.innerHeight - SCREEN_PADDING) {
                    y = window.innerHeight - menu.height - SCREEN_PADDING
                }

                if (y < SCREEN_PADDING) {
                    y = SCREEN_PADDING
                }

                break

            case "bottom":
                x = btn.left
                y = btn.bottom + offset

                if (x + menu.width > window.innerWidth - SCREEN_PADDING) {
                    x = btn.right - menu.width
                }

                if (x < SCREEN_PADDING) {
                    x = SCREEN_PADDING
                }

                break

            case "top":
                x = btn.left + btn.width / 2 - menu.width / 2
                y = btn.top - menu.height - offset

                if (y < SCREEN_PADDING) {
                    y = btn.bottom + offset
                }

                if (x + menu.width > window.innerWidth - SCREEN_PADDING) {
                    x = window.innerWidth - menu.width - SCREEN_PADDING
                }

                if (x < SCREEN_PADDING) {
                    x = SCREEN_PADDING
                }

                break

            case "top-start":
                x = btn.left
                y = btn.top - menu.height - offset
                break

            case "top-end":
                x = btn.right - menu.width
                y = btn.top - menu.height - offset
                break
        }


        setPos({ x, y })
    }, [open])


    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={`absolute top-0 z-50 min-w-[150px] sm:min-w-[180px] 
                    border-[1.5px] 
                    shadow-[0_10px_30px_rgba(0,0,0,0.12)]
                    rounded-lg bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 
                    dark:text-white animate-scale-in
                    `}
                    style={{
                        position: "fixed",
                        left: pos.x,
                        top: pos.y
                    }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}