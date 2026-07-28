import { Navigate, Outlet } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext"

export const PublicRoutes = () => {
    const { user, isGuest, loading } = useAuthContext()

    // Importante, esto se hace para que el protect routes se monte despues que el usuario login
    if (loading) {
        return null;
    }

    if (user || isGuest) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}