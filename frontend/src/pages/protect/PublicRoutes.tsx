import { Navigate, Outlet } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext"

export const PublicRoutes = () => {
    const { user, isGuest, loading } = useAuthContext()

    // Importante, esto se hace para que el protect routes se monte despues que el usuario login
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin border-2 border-zinc-400 border-t-transparent rounded-full w-18 h-18 mb-2" />
            </div>
        )
    }

    if (user || isGuest) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}