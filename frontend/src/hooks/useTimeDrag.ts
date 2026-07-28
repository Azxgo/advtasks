import { useRef } from "react";

type TimeField = "hour" | "minute";

export function useTimeDrag(
    time: number,
    field: TimeField,
    onChange: (value: number) => void,
    onSave: (value: number) => void
) {
    const startY = useRef(0);
    const startValue = useRef(0);
    const lastValue = useRef(time);

    const startDrag = (e: React.MouseEvent) => {
        startY.current = e.clientY;
        startValue.current = time;

        const handleMouseMove = (e: MouseEvent) => {
            const diff = startY.current - e.clientY;

            const sensitivity = field === "hour" ? 10 : 5;

            if (Math.abs(diff) < sensitivity) return;

            let newValue = lastValue.current;

            if (diff > 0) {
                if (newValue === 0) {
                    newValue = -1
                } else if (newValue > 0) {
                    newValue--
                }
            }

            if (diff < 0) {
                if (newValue === -1) {
                    newValue = 0
                } else {
                    newValue++
                }
            }

            if (field === "hour" && newValue !== -1) {
                newValue = Math.min(23, newValue);
            }

            if (field === "minute" && newValue !== -1) {
                newValue = Math.min(59, newValue);
            }

            if (newValue !== lastValue.current) {
                lastValue.current = newValue;

                startY.current = e.clientY

                onChange(newValue);
            }

        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);

            onSave(lastValue.current);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return { startDrag };
}