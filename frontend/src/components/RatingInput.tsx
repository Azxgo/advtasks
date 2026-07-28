type Props = {
    value: number | null
    onChange: (value: number) => void
}

export function RatingInput({ value, onChange }: Props) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => {
                const score = i + 1
                const active = value !== null && score <= value

                return (
                    <button
                        key={score}
                        type="button"
                        onClick={() => onChange(score)}
                        className={`h-7 w-7 rounded-full text-xs font-semibold
                            flex items-center justify-center transition-all duration-200
                            ${active
                                ? "bg-blue-500 text-white scale-110"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                    >
                        {score}
                    </button>
                )
            })}
        </div>
    )
}