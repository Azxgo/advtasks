import { useAuthContext } from "../../context/AuthContext"
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectRoutes = () => {
    const { user, isGuest, loading } = useAuthContext()

    const location = useLocation();

    // Importante, esto se hace para que el protect routes se monte despues que el usuario login
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin border-2 border-zinc-400 border-t-transparent rounded-full w-18 h-18 mb-2" />
            </div>
        )
    }
    
    if (!user && !isGuest) {
        return <Navigate to="/start" state={{ from: location }} replace />;
    }


    return <Outlet />
}