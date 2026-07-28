import { createContext, useContext, useState, type ReactNode } from "react"
import { apiClient } from "../config/apiClient"
import type { TotalStatsAttributes } from "../types/Stats"

type StatsContextType = {
    statsAttributes: TotalStatsAttributes;
    setStatsAttributes: React.Dispatch<React.SetStateAction<TotalStatsAttributes>>;
    fetchStats: () => Promise<void>;
    resetStats: () => Promise<void>;
}

export const StatsContext = createContext<StatsContextType | null>(null)

export const useStatsContext = () => {
    const context = useContext(StatsContext)

    if (!context) {
        throw new Error("useStatsContext debe usarse dentro de StatsProvider")
    }
    return context

}

export const StatsProvider = ({ children }: { children: ReactNode }) => {

    const [statsAttributes, setStatsAttributes] = useState<TotalStatsAttributes>({
        work: 0,
        learning: 0,
        creative: 0,
        social: 0,
        recreation: 0,
    });

    const fetchStats = async () => {

        const res = await apiClient("/api/users/getStatsById", {})

        if (!res.ok) {
            console.log(await res.text())
            return
        }

        const data = await res.json()
        setStatsAttributes(data)
    }

    const resetStats = async () => {
        try {
            const res = await apiClient("/api/users/resetStats", {
                method: "PATCH",
            });

            if (!res.ok) {
                throw new Error("Error al reiniciar estadísticas");
            }

            setStatsAttributes({
                work: 0,
                learning: 0,
                creative: 0,
                social: 0,
                recreation: 0,
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <StatsContext.Provider value={{ statsAttributes, setStatsAttributes, fetchStats, resetStats }}>
            {children}
        </StatsContext.Provider>
    )
}