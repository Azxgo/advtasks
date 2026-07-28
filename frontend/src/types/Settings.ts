
import * as FaIcons from "react-icons/fa"
import type { IconType } from "react-icons"
import type { MenuView } from "./Menu"

export type SettingOption = {
    key: string,
    label: string,
    icon?: IconType
    view: MenuView
}

export const SETTINGS_OPTIONS: SettingOption[] = [
    {
        key: "visibility",
        label: "Visibilidad",
        icon: FaIcons.FaEye,
        view: "visibility",
    },
    {
        key: "layout",
        label: "Diseño",
        icon: FaIcons.FaLayerGroup,
        view: "layout",
    }
]

export type LayoutSettings = {
    view: "grid" | "list",
    image: "square" | "poster"
}

export const LAYOUT_OPTIONS: {
    key: keyof LayoutSettings
    label: string
    icon: IconType
}[] = [
        { key: "view", label: "Vista", icon: FaIcons.FaLayerGroup },
        { key: "image", label: "Imagen", icon: FaIcons.FaImage }

    ]
