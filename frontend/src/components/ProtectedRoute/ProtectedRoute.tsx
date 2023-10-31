// ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import useIsAuthenticated from './useIsAuthenticated';

interface Props {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: Props) {
    const [isLoading, isAuthenticated] = useIsAuthenticated();

    if (isLoading) {
        return <div>Loading...</div>;  // Render a loading spinner or some placeholder
    } else if (isAuthenticated) {
        return children;
    } else {
        return <Navigate to="/" replace />;
    }
}

export default ProtectedRoute;
