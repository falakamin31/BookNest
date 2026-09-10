import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoutes = () => {
    const { token } = useAuth();

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
