import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthContext } from "./AuthContext";

type TimezoneContextType = {
    timezone: string;
    setTimezone: React.Dispatch<React.SetStateAction<string>>;
    timezones: string[];
};

export const TimezoneContext = createContext<TimezoneContextType | null>(null)

export const useTimezoneContext = () => {
    const context = useContext(TimezoneContext)

    if (!context) {
        throw new Error("useTimezoneContext debe usarse dentro de TimezoneProvider")
    }

    return context
}

export const TimezoneProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuthContext();

    const [timezone, setTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const timezones = [
        "UTC",
        ...Intl.supportedValuesOf("timeZone")
    ];

    useEffect(() => {
        if (user?.timezone) {
            setTimezone(user.timezone);
        }
    }, [user?.timezone]);

    return (
        <TimezoneContext.Provider value={{ timezone, setTimezone, timezones }}>
            {children}
        </TimezoneContext.Provider>
    )
}

