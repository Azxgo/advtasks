import { useEffect, useState } from "react"
import { useAuthContext } from "../../context/AuthContext"

type Props = {}

const formatName = (name: string) => {
    return name.toUpperCase()
}

export function LevelBar({ }: Props) {
    const { user, isGuest } = useAuthContext()

    const [time, setTime] = useState("")

    const expForLevel = (level: number) => {
        return 50 * level ** 3
    }

    const level = user?.level ?? 1
    const totalExp = user?.totalExp ?? 0

    const previousLevelExp =
        level === 1
            ? 0
            : expForLevel(level)

    const nextLevelExp =
        expForLevel(level + 1)

    const currentExpInLevel =
        totalExp - previousLevelExp

    const expNeededForLevel =
        nextLevelExp - previousLevelExp

    const progress =
        (currentExpInLevel / expNeededForLevel) * 100

    const safeProgress = Math.max(
        0,
        Math.min(progress, 100)
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(
                new Date().toLocaleTimeString("es-CL", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                })
            )
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex w-full bg-indigo-300 dark:bg-indigo-600/50 rounded-lg px-4 py-3">
            <div className="flex w-full gap-3 items-center">

                <div className="min-w-15 font-karnivore text-2xl">
                    {time}
                </div>
                {isGuest ? (
                    <div className="font-karnivore text-2xl">
                        {formatName("GUEST")}
                    </div>
                ) : (
                    <div className="font-karnivore text-2xl">
                        {formatName(user?.name ?? "")}
                    </div>
                )}

            </div>

            <div className="flex flex-col w-full gap-1">
                <div className="flex justify-between">
                    <p className="font-karnivore">
                        Lv. {level}
                    </p>

                    <p className="font-karnivore">
                        EXP Total: {totalExp}
                    </p>
                </div>

                <div className="relative group w-full">
                    <div className="w-full bg-gray-300 dark:bg-zinc-500  rounded-md h-4 overflow-hidden">
                        <div
                            className="bg-indigo-500 dark:bg-indigo-400 h-full transition-all duration-500"
                            style={{
                                width: `${safeProgress}%`
                            }}
                        />

                        <p className="absolute inset-0 flex items-center 
                        justify-center opacity-0  group-hover:opacity-100 
                        transition-opacity duration-100 text-[10px] 
                        select-none font-karnivore">
                            {currentExpInLevel} / {expNeededForLevel} EXP
                        </p>
                    </div>
                </div>


            </div>
        </div >
    )
}