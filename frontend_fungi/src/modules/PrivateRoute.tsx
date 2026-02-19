import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/Hooks.tsx';

interface PrivateRouteProps {
    IsAdmin: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({IsAdmin}) => {
    const user = useAppSelector((state) => state.user);

    if (!user.isAuthChecked || user.authRequestStatus === 'loading') {
        return <p>Loading…</p>;
    }

    if (!user.isLoggedIn || user.email === "") {
        return <Navigate to="/login" replace />;
    }

    if (IsAdmin && user.accessLvl != 2)
    {
        return <Navigate to="/mainpage" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
