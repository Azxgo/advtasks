import { useAuthContext } from "../../context/AuthContext"
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectRoutes = () => {
    const { user, isGuest, loading } = useAuthContext()

    const location = useLocation();

    // Importante, esto se hace para que el protect routes se monte despues que el usuario login
    if (loading) {
        return null; 
    }

    if (!user && !isGuest) {
        return <Navigate to="/start" state={{ from: location }} replace />;
    }


    return <Outlet />
}