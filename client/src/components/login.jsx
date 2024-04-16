import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://notie.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const { token } = await response.json();
            localStorage.setItem('token', token);
            navigate('/');
        }
        catch (err) {
            setError(err.message);
        }
    };

    return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white shadow-xl shadow-purple-200 rounded-lg max-w-sm">
                    <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input required className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <input required className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:bg-purple-700">
                            Login
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div className="text-center mt-4">
                        <p>Dont Have an Account? Register <a className="text-purple-600 hover:text-purple-800" href="/register">Here</a></p>
                    </div>
                </div>
            </div>
  );
}

export default Login;