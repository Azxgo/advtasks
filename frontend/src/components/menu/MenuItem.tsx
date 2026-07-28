import { useMenu } from "./MenuRoot"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    closeOnClick?: boolean
    noHover?: boolean
}

export function  MenuItem({ onClick, closeOnClick = true, noHover = false, className = "", ...props }: Props) {
    const { setOpen } = useMenu()

    return (
        <button
            className={`flex items-center w-full rounded px-3 transition ${className} 
            ${noHover ? "cursor-default" : "hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"} `}
            {...props}
            onClick={(e) => {
                onClick?.(e)
                if (closeOnClick) {
                    setOpen(false)
                }
            }}
        />
    )
}