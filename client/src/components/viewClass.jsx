import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

function ViewClass() {
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState('');
    const { classID } = useParams();
    const isAuthenticated = localStorage.getItem('token');

    const fetchNotes = async () => {
        try{
            fetch(`https://notie.onrender.com/api/classes/${classID}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setClasses(data);
                } else {
                    setClasses([data]); // If the response is not an array, convert it to an array with a single element
                }
            })
            .catch(err => console.log(err));
        }
        catch (error) {
            setError('Failed to fetch classes');
        }
    }

    useEffect(() => {
        fetchNotes();
    }, [classID]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (!isAuthenticated) {
        return <Redirect to="/login" />;
    }

    const deleteNote = async (noteID) => {
        try{
            const token = localStorage.getItem('token');
            const response = await fetch(`https://notie.onrender.com/api/deleteNote/${noteID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ noteID }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            fetchNotes();
        }
        catch (error) {
            setError(error);
        }
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value.toLowerCase());
    };

    const filteredNotes = classes.map(classItem => {
        if (classItem.notes) {
            return {
                ...classItem,
                notes: classItem.notes.filter(currNote => currNote.title.toLowerCase().includes(search))
            };
        } else {
            return classItem;
        }
    });

    return (
        <div className="min-h-screen bg-white">
            <nav className="text-purple-700 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-semibold"><Link to="/">Home</Link></h1>
                    <button onClick={handleLogout} className="bg-purple-700 text-purple-200 px-4 py-2 rounded shadow">
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
                        placeholder="Search For Notes"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="mt-6">
                    {filteredNotes.map(note => (
                        <div key={note._id}>
                            <h2 className="text-2xl font-semibold">{note.className}</h2>
                            <ul>
                                {note.notes.map((currNote, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-200 rounded my-2">
                                        <span className="font-medium">{currNote.title || 'No Class Name'}</span>
                                        <div>
                                        <Link to={`/classNotes/${currNote._id}`} className="bg-purple-200 text-purple-700 px-3 py-1 rounded mx-1">Open</Link>
                                        <Link to={`/classNotes/${currNote._id}/edit`} className="bg-green-200 text-green-700 px-3 py-1 rounded mx-1">Edit</Link>
                                        <Link onClick={() => deleteNote(currNote._id)} className="bg-red-200 text-red-700 px-3 py-1 rounded mx-1">Delete</Link>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6">
                    <Link to={`/createNote/${classID}`} className="mt-2 bg-purple-700 text-white px-6 py-2 rounded shadow w-full">
                        Add New Note
                    </Link>
            </div>
        </div>
    );
}

export default ViewClass;
