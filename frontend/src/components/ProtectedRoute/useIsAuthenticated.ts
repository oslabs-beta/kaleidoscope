// useIsAuthenticated.ts
import { useState, useEffect } from 'react';

function useIsAuthenticated() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3001/auth/check', { 
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 200) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        })
        .catch(error => {
            setIsAuthenticated(false);
            setIsLoading(false);
        });
    }, []);

    return [isLoading, isAuthenticated];
}

export default useIsAuthenticated;
