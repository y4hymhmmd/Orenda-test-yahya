import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const token = localStorage.getItem('token');

    // Kalau nggak ada token, redirect ke login
    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
