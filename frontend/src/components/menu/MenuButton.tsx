import { useMenu } from "./MenuRoot"

type Props = {
  children: React.ReactNode
  className?: string
}

export function MenuButton({ children, className }: Props) {
  const { setOpen, anchorRef } = useMenu()

  return (
    <button
      ref={anchorRef}
      className={className}
      onClick={(e) => {
        e.stopPropagation()
        setOpen(o => !o)
      }}
    >
      {children}
    </button>
  )
}