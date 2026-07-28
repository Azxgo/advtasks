import { useRef, useState } from "react"

type Props = {
    text: string,
    children: React.ReactNode
}

export function AtributeToolTip({ text, children }: Props) {
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const parentRect = containerRef.current?.getBoundingClientRect()

        if (!parentRect) return

        timeoutRef.current = setTimeout(() => {
            setPos({
                x: rect.left - parentRect.left + rect.width / 2,
                y: rect.bottom - parentRect.top
            })
        }, 1400)
    }

    const handleLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setPos(null)
    }

    return (
        <div
            ref={containerRef}
            className="relative inline-block"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {children}

            {pos && (
                <div
                    className="absolute bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50"
                    style={{
                        top: pos.y + 6,
                        left: pos.x,
                        transform: "translateX(-50%)"
                    }}
                >
                    {text}
                </div>
            )}
        </div>
    )
}