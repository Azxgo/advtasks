import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiClient } from "../config/apiClient";
import { useNavigate } from "react-router-dom";


type User = {
    _id: string
    email: string
    name: string
    level: number
    totalExp: number
}

type AuthContextType = {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    getUserInfo: () => void
    register: (name: string, email: string, password: string) => Promise<any>
    login: (email: string, password: string) => Promise<any>
    logout?: () => Promise<any>;
    guest: () => Promise<any>;
    quitGuest?: () => Promise<any>;
    isGuest: boolean | null
    deleteUser: () => Promise<any>;
    loading: boolean | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuthContext debe usarse dentro de AuthProvider")
    }

    return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isGuest, setIsGuest] = useState<boolean | null>(() => {
        return !!localStorage.getItem("guest_session_id")
    })

    const [loading, setIsLoading] = useState(true)

    const navigate = useNavigate();

    const getUserInfo = async () => {
        try {
            const res = await apiClient(`/api/users/getUserInfoById`,
                {}
            )

            if (!res.ok) {
                throw new Error()
            }

            const data = await res.json()
            setUser(data)
        } catch (e) {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await apiClient(`/api/auth/register`, {
                method: "POST",
                body: JSON.stringify({ name, email, password })
            })

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }

            const data = await res.json()

            if (data.accessToken) {
                localStorage.setItem("advTask_token", data.accessToken)
            }

            if (data.refreshToken) {
                localStorage.setItem("advTask_token_refreshToken", data.refreshToken)
            }

            await getUserInfo()

            return data

        } catch (err: any) {
            throw err
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const res = await apiClient(`/api/auth/login`, {
                method: "POST",
                body: JSON.stringify({ email, password })
            })

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }

            const data = await res.json()

            if (data.accessToken) {
                localStorage.setItem("advTask_token", data.accessToken)
            }

            if (data.refreshToken) {
                localStorage.setItem("advTask_token_refreshToken", data.refreshToken)
            }

            await getUserInfo()

            return data
        } catch (err: any) {
            throw err
        }
    }

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem(
                "advTask_token_refreshToken"
            );

            const res = await apiClient(`/api/auth/logout`, {
                method: "POST",
                body: JSON.stringify({ refreshToken })
            })

            if (!res.ok) {
                throw new Error("No se pudo cerrar la sesión");
            }

            localStorage.removeItem("advTask_token");
            localStorage.removeItem("advTask_token_refreshToken")
            setUser(null);

            navigate("/start");
        } catch (err: any) {
            console.error(err.response?.data || err);
            throw err
        }
    }

    const guest = async () => {
        try {
            let deviceId = localStorage.getItem("device_id")

            if (!deviceId) {
                deviceId = crypto.randomUUID()
                localStorage.setItem("device_id", deviceId)
            }

            const res = await apiClient(`/api/auth/guest`, {
                headers: {
                    "X-Device-Id": deviceId
                },
                method: "POST"
            })

            const data = await res.json()

            localStorage.setItem("guest_session_id", data.session_id)
            localStorage.setItem("guest_expires_at", data.expires_at)

            setUser(null)
            setIsGuest(true)

            return data
        } catch (err) {
            console.error(err)
        }
    }

    const quitGuest = async () => {
        try {
            const session_id = localStorage.getItem(
                "guest_session_id"
            );

            const res = await apiClient(`/api/auth/quitGuest`, {
                method: "POST",
                body: JSON.stringify({ session_id })
            })

            if (!res.ok) {
                throw new Error("No se pudo cerrar la sesión");
            }

            localStorage.removeItem("guest_session_id");
            localStorage.removeItem("guest_expires_at")

            setIsGuest(null)
            navigate("/start");
        } catch (err: any) {
            console.error(err.response?.data || err);
        }
    }

    const deleteUser = async () => {
        try {
            const res = await apiClient(`/api/users/deleteUser`, {
                method: "DELETE"
            })

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }

            localStorage.removeItem("advTask_token");
            localStorage.removeItem("advTask_token_refreshToken")

            setUser(null);

            navigate("/start");

        } catch (err: any) {
            throw err
        }
    }

    useEffect(() => {
        getUserInfo()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, getUserInfo, register, login, logout, guest, quitGuest, isGuest, deleteUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}