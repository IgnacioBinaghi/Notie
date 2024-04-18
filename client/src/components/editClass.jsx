import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


function editClass(){
    const isAuthenticated = localStorage.getItem('token');
    const navigate = useNavigate();
    const [className, setClassName] = useState('');
    const [error, setError] = useState('');
    const { classID } = useParams();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const token = localStorage.getItem('token');
            const response = await fetch(`https://notie.onrender.com/api/editClass/${classID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ className }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            
            navigate(`/home`);
        } catch (err) {
            console.log(err)
            setError(error);
        }
    };

    useEffect(() => {
        const fetchClassData = async () => {
            try{
                const token = localStorage.getItem('token');
                const response = await fetch(`https://notie.onrender.com/api/getClass/${classID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    credentials: 'include'
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }
                const { className } = await response.json();
                setClassName(className);
            }
            catch (err) {
                console.log(err)
                setError(err.message);
            }
        }
        fetchClassData();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-xl shadow-purple-200 rounded-lg max-w-sm">
            <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">Edit Class</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input required className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" type="text" placeholder="Class Name" value={className} onChange={(e) => setClassName(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:bg-purple-700">Submit Class Edit</button>
                    <button onClick={handleGoBack} className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:bg-red-700">Go Back</button>
                </form>
            </div>
        </div>
    );

}

export default editClass;