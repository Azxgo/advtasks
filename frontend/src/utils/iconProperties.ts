import * as FaIcons from "react-icons/fa"

export const ICON_PROPERTIES = {
    image: FaIcons.FaImage,
    name: FaIcons.FaFont,
    progress: FaIcons.FaChartBar,
    percentage: FaIcons.FaPercentage,
    type: FaIcons.FaLayerGroup,
    score: FaIcons.FaStar,
    dates: FaIcons.FaCalendarAlt,
} as const

export const ICON_SORT = {
    name: FaIcons.FaFont,
    total: FaIcons.FaPercentage,
    progress: FaIcons.FaChartBar,
    type: FaIcons.FaLayerGroup,
    status: FaIcons.FaTasks,
    score: FaIcons.FaStar,

    startDate: FaIcons.FaCalendarAlt,
    endDate: FaIcons.FaCalendarCheck
} as const

export const ICON_FILTERS = {
    name: FaIcons.FaFont,
    progress: FaIcons.FaChartBar,
    type: FaIcons.FaLayerGroup,
    status: FaIcons.FaTasks,
    startDate: FaIcons.FaCalendarAlt,
    endDate: FaIcons.FaCalendarCheck
} as const


