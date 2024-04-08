import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function Note() {
    const [noteData, setNoteData] = useState(null); // Initialize noteData as null
    const { noteID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://notie.onrender.com/api/classNotes/${noteID}`)
            .then(res => res.json())
            .then(data => {
                setNoteData(data);
            })
            .catch(err => console.log(err));
    }, [noteID]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-white">
            <nav className="text-purple-700 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-semibold"><Link to="/">Home</Link></h1>
                    <button onClick={handleLogout} className="bg-purple-700 text-purple-200 px-4 py-2 rounded shadow">
                        Log Out
                    </button>
                </div>
                <button onClick={handleGoBack} className="bg-red-200 text-red-700 px-3 py-1 rounded mx-1 mt-8">Go Back</button>
            </nav>
            <div className="mt-6 px-12">
                {noteData && (
                    <>
                        <h2 className="text-2xl mb-6 font-semibold">{noteData.title}</h2>
                        <div className="border border-solid border-black rounded-lg h-auto text-left p-4">
                            <p>{noteData.content}.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Note;
