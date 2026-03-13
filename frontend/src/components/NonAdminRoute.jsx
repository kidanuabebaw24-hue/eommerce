import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NonAdminRoute = ({ children }) => {
    const { user } = useAuth();

    // If user is admin-only (has ADMIN role but not BUYER/SELLER), redirect to admin dashboard
    if (user?.roles?.includes('ADMIN') && user?.roles?.length === 1) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default NonAdminRoute;
