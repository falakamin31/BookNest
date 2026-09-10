import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoutes = () => {
    const { token } = useAuth();

    return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoutes;
