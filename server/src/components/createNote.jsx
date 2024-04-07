import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function CreateNote() {
    const [noteName, setNoteName] = useState();
    const [noteContent, setNoteContent] = useState();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { classID } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/CreateNote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ noteName, noteContent, classID}),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            navigate(`/classes/${classID}`);
        } catch (err) {
            setError(error);
        }
    
    };

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-xl shadow-purple-200 rounded-lg max-w-full">
            <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">Create Note</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input required className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" type="text" placeholder="Note Name" value={noteName} onChange={(e) => setNoteName(e.target.value)} />
                        <textarea required className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-48 mt-12" type="text" placeholder="Note Content" value={noteContent} onChange={(e) => setNoteContent(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:bg-purple-700">Create Note</button>
                    <button onClick={handleGoBack} className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:bg-red-700">Go Back</button>
                </form>
            </div>
        </div>    
    )
}

export default CreateNote;