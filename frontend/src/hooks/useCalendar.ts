import { useMemo, useState } from "react"

export function useCalendar({ currentDate }: { currentDate: Date }) {
    const [calendarMonth, setCalendarMonth] = useState(new Date())

    // Devuelve el dia de la semana como numero
    const dayOfWeek = (currentDate.getDay() + 6) % 7

    // Construye el inicio de una semana
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek)

    // Crea un array de 7 dias
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            // Suma dias en el startOfWeeks
            const date = new Date(startOfWeek)
            date.setDate(startOfWeek.getDate() + i)

            // Contruye el objeto el dia
            return {
                dayName: date.toLocaleString("en-US", { weekday: "short" }),
                dayNumber: date.getDate(),
                fulldate: date
            }
        })
    }, [currentDate])


    // Toma el primer dia del mes
    const startOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
    // Toma el ultimo dia del mes
    const endOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0)
    // Toma el dia de la semana en la que empieza
    const startDay = (startOfMonth.getDay() + 6) % 7
    // Calcula los dias totales en el mes
    const daysInMonth = endOfMonth.getDate()

    const calendarDays = [
        ...Array(startDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
    ]

    return {
        calendarMonth,
        setCalendarMonth,
        startOfWeek,
        weekDays,
        calendarDays,
    }
}