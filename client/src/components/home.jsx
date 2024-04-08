import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function Home() {

    const [classes, setClasses] = useState([{}])
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const isAuthenticated = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) { // Check if token exists
                const userId = jwtDecode(token).userId;
                const response = await fetch(`https://notie.onrender.com/api/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setClasses(data);
            }
        } catch (err) {
            console.log(err);
            setError('Failed to fetch classes');
        }

        setLoading(false);
    };
    
    useEffect(() => {
        fetchClasses();
    }, []);

    const deleteClass = async (class_id) => {
        try{
            const token = localStorage.getItem('token');
            const userId = jwtDecode(token).userId
            const response = await fetch(`https://notie.onrender.com/api/deleteClass/${class_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ class_id, userId }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            fetchClasses();
        } catch (err) {
            setError(error);
        }
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    

    if (loading) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <nav className="text-purple-700 p-4">
                <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-semibold"><Link to="/">Home</Link></h1>
                    <button className="bg-purple-700 text-purple-200 px-4 py-2 rounded shadow" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </nav>
            <div className="container mx-auto p-4">
                <div className="flex items-center border-2 p-2 rounded">
                    <span className="text-purple-700 mr-2">🔍</span>
                    <input 
                        className="bg-transparent p-2 w-full focus:outline-none" 
                        type="text" 
                        placeholder="Search For Classes"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="mt-6">
                    <h2 className="text-purple-700 font-semibold">Your Notes</h2>
                    <div className="mt-2">
                        {classes.filter(myClass => myClass.className && myClass.className.toLowerCase().includes(search.toLowerCase())).map((myClass, index) => {
                            if (myClass.className === 'Personal Notes') {
                                return (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-200 rounded my-2">
                                <span className="font-medium">{myClass.className || 'No Class Name'}</span>
                                <div>
                                <Link to={`/classes/${myClass._id}`} className="bg-purple-200 text-purple-700 px-3 py-1 rounded mx-1">
                                    Open
                                </Link>
                                </div>
                            </div>);
                            }
                            else{
                                return (<div key={index} className="flex items-center justify-between p-4 bg-gray-200 rounded my-2">
                                <span className="font-medium">{myClass.className || 'No Class Name'}</span>
                                <div>
                                <Link to={`/classes/${myClass._id}`} className="bg-purple-200 text-purple-700 px-3 py-1 rounded mx-1">Open</Link>
                                <Link to={`/classes/${myClass._id}/edit`} className="bg-green-200 text-green-700 px-3 py-1 rounded mx-1">Edit</Link>
                                <button onClick={() => deleteClass(myClass._id)} className="bg-red-200 text-red-700 px-3 py-1 rounded mx-1">Delete</button>
                                </div>
                            </div>
                            );}
                        }
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6">
                    <Link to="/createClass" className="mt-2 bg-purple-700 text-white px-6 py-2 rounded shadow w-full">
                        Add New Class
                    </Link>
            </div>
        </div>
    );
}
export default Home
