// components/ProtectedRoutes.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoutes() {
    const { isAuthenticated, isLoading } = useAuth();  // Получить isLoading из AuthContext

    if (isLoading) {
        return null;  // Вернуть null, пока идет загрузка
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default ProtectedRoutes;
