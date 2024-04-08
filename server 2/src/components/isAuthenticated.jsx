import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const useAuthStatus = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('/api/auth/status'); // Replace with your actual endpoint
                console.log(response);
                setIsAuthenticated(response.data.isAuthenticated);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    return { isAuthenticated, loading };
};

function IsAuthenticated({ children }) {
    const { isAuthenticated, loading } = useAuthStatus();
    if (loading) {
        return <div>Loading...</div>; // Or any loading indicator
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default IsAuthenticated;
