import { FaTimes } from "react-icons/fa"
import { useMenu } from "./MenuRoot"

export function MenuCloseButton() {
  const { closeMenu } = useMenu()

  return (
    <div
      role="button"
      onClick={(e) => {
        e.stopPropagation()
        closeMenu()
      }}
      className="
        w-6 h-6 flex items-center justify-center rounded-md
        text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition
      "
    >
      <FaTimes />
    </div>
  )
}