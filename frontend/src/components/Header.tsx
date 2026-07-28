import { FaEllipsisV, FaMoon, FaPoll, FaSignOutAlt, FaSun, FaSyncAlt, FaTrashAlt, FaUserSlash } from "react-icons/fa";
import { MenuButton } from "./menu/MenuButton";
import { MenuRoot } from "./menu/MenuRoot";
import { MenuContent } from "./menu/MenuContent";
import { MenuItem } from "./menu/MenuItem";
import { useStatsContext } from "../context/StatsContext";
import { useTasksActions } from "../hooks/useTasksActions";
import { apiClient } from "../config/apiClient";
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { ConfirmModal } from "./ui/ConfirmModal";
import { useThemeContext } from "../context/ThemeContext";
import { useTasksContext } from "../context/TasksContext";

type ConfirmState = {
    isOpen: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    onConfirm: () => void;
};

export function Header({ }) {
    const { resetStats } = useStatsContext()
    const { setTasks, updateTask } = useTasksContext();
    const { deleteAllTasksByUser } = useTasksActions(updateTask, setTasks)
    const { getUserInfo, logout, isGuest, quitGuest, deleteUser } = useAuthContext()

    console.log(isGuest)

    const { dark, setDark } = useThemeContext()

    const [confirmModal, setConfirmModal] = useState<ConfirmState>({
        isOpen: false,
        title: "",
        description: "",
        confirmText: "",
        onConfirm: () => { },
    });

    const openConfirmModal = ({ title, description, confirmText, onConfirm, }: Omit<ConfirmState, "isOpen">) => {
        setConfirmModal({
            isOpen: true,
            title,
            description,
            confirmText,
            onConfirm,
        });
    };

    const resetLevel = async () => {
        const res = await apiClient(`/api/users/resetLevel`, {
            method: "PATCH"
        })

        if (res.ok) {
            await getUserInfo();
        }
    }

    return (
        <div className="flex items-center justify-between w-full 
        bg-blue-900/10 dark:bg-zinc-900/30 py-2 px-3 z-50
        border-b border-zinc-300 dark:border-zinc-600
        transition-colors duration-300 
        ">
            <div className="font-karnivore text-gray-600 dark:text-white">
                AdvTasks
            </div>

            <div>
                <MenuRoot>
                    <MenuButton
                        className="rounded-md flex items-center justify-center backdrop-blur 
                        text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-white  hover:text-gray-900
                        
                        transition duration-400 p-2 hover:bg-gray-300 dark:hover:bg-zinc-700 "
                    >
                        <FaEllipsisV />
                    </MenuButton>
                    <MenuContent position="bottom">
                        <MenuItem closeOnClick={false} noHover={true}>
                            <div className="flex h-full items-center gap-3 py-2">
                                <div className="flex items-center">
                                    <div
                                        onClick={() => setDark(!dark)}
                                        className={`relative w-14 h-7 rounded-full transition-colors duration-300
                                ${dark ? "bg-zinc-600" : "bg-gray-300"}`}
                                    >
                                        <span
                                            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-lg
                                        transition-transform duration-300
                                        ${dark ? "translate-x-7" : "translate-x-0"}  `}
                                        ></span>
                                    </div>

                                    <div
                                        onClick={() => setDark(!dark)}
                                        className="px-4 py-2 rounded-lg "
                                    >
                                        {dark ? <FaSun /> : <FaMoon />}
                                    </div>
                                </div>
                            </div>
                        </MenuItem>
                        <MenuItem
                            className="flex w-full gap-2 py-2 items-center rounded-lg cursor-pointer whitespace-nowrap"
                            onClick={() =>
                                openConfirmModal({
                                    title: "¿Borrar todas las tareas?",
                                    description: "Esta accion eliminará todas tus tareas. ¡No podrás revertir esta acción!",
                                    confirmText: "Si, borrar",
                                    onConfirm: async () => {
                                        await deleteAllTasksByUser();
                                        setConfirmModal(prev => ({ ...prev, isOpen: false }))
                                    }
                                })
                            }
                        >
                            <FaTrashAlt color="gray" size={22} />
                            <p className="text-md font-semibold">Borrar todas las tareas</p>
                        </MenuItem>
                        <MenuItem
                            className="flex w-full gap-2 py-2 items-center rounded-lg cursor-pointer"
                            onClick={() =>
                                openConfirmModal({
                                    title: "¿Reiniciar Nivel?",
                                    description: "Tu nivel volverá a 1 y tu experiencia a 0. ¡No podrás revertir esta acción!",
                                    confirmText: "Reiniciar",
                                    onConfirm: async () => {
                                        await resetLevel();
                                        setConfirmModal(prev => ({ ...prev, isOpen: false }))
                                    }
                                })
                            }
                        >
                            <FaSyncAlt color="gray" size={22} />
                            <p className="text-md font-semibold">Reiniciar Nivel</p>
                        </MenuItem>
                        <MenuItem
                            className="flex w-full gap-2 py-2 items-center rounded-lg cursor-pointer"
                            onClick={() =>
                                openConfirmModal({
                                    title: "¿Reiniciar estadisticas?",
                                    description: "Se perderán todas las estadísticas acumuladas. ¡No podrás revertir esta acción!",
                                    confirmText: "Reiniciar",
                                    onConfirm: async () => {
                                        await resetStats();
                                        setConfirmModal(prev => ({ ...prev, isOpen: false }))
                                    }
                                })
                            }
                        >
                            <FaPoll color="gray" size={22} />
                            <p className="text-md font-semibold">Reiniciar Estadisticas</p>
                        </MenuItem>
                        {isGuest ? (
                            <MenuItem
                                className="flex w-full gap-2 py-2 items-center rounded-lg cursor-pointer"
                                onClick={quitGuest}
                            >
                                <FaSignOutAlt color="gray" size={22} />
                                <p className="text-md font-semibold">Cerrar Sesiónn</p>
                            </MenuItem>
                        ) : (
                            <>
                                <MenuItem
                                    className="flex w-full gap-2 py-2 items-center rounded-lg cursor-pointer"
                                    onClick={() =>
                                        openConfirmModal({
                                            title: "¿Borrar Usuario?",
                                            description: "Se perderá todo lo relacionado a este usuario. ¡No podrás revertir esta acción!",
                                            confirmText: "Borrar",
                                            onConfirm: async () => {
                                                await deleteUser();
                                                setConfirmModal(prev => ({ ...prev, isOpen: false }))
                                            }
                                        })
                                    }
                                >
                                    <FaUserSlash color="gray" size={22} />
                                    <p className="text-md font-semibold">Borrar Usuario</p>
                                </MenuItem>
                                <MenuItem
                                    className="flex w-full gap-2 py-2 items-center rounded-lg cursor-pointer"
                                    onClick={logout}
                                >
                                    <FaSignOutAlt color="gray" size={22} />
                                    <p className="text-md font-semibold">Cerrar Sesión</p>
                                </MenuItem>
                            </>

                        )}

                    </MenuContent>
                </MenuRoot>
            </div>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                description={confirmModal.description}
                confirmText={confirmModal.confirmText}
                onConfirm={confirmModal.onConfirm}
                onCancel={() =>
                    setConfirmModal(prev => ({
                        ...prev,
                        isOpen: false,
                    }))
                }
            />
        </div >


    )
}