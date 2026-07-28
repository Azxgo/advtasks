import {
    GiBriefcase,
    GiSpellBook,
    GiBrain,
    GiThreeFriends,
    GiPerspectiveDiceSix
} from "react-icons/gi";

import type { IconType } from "react-icons";
import type { TaskAttribute } from "../types/Tasks";

export const attributeIcons: Record<TaskAttribute, IconType> = {
    work: GiBriefcase,
    learning: GiSpellBook,
    creative: GiBrain,
    social: GiThreeFriends,
    recreation: GiPerspectiveDiceSix,
};