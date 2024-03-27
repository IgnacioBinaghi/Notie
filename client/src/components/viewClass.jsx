import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function ViewClass() {
    const [classes, setClasses] = useState([]);
    const { classID } = useParams();

    useEffect(() => {
        fetch(`/api/classes/${classID}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setClasses(data);
                } else {
                    setClasses([data]); // If the response is not an array, convert it to an array with a single element
                }
            })
            .catch(err => console.log(err));
    }, [classID]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
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
            </nav>
            <div className="container mx-auto p-4">
                <div className="flex items-center border-2 p-2 rounded">
                    <span className="text-purple-700 mr-2">🔍</span>
                    <input 
                        className="bg-transparent p-2 w-full focus:outline-none" 
                        type="text" 
                        placeholder="Search For Classes"
                    />
                </div>
                <div className="mt-6">
                    {classes.map(classItem => (
                        <div key={classItem._id}>
                            <h2 className="text-2xl font-semibold">{classItem.className}</h2>
                            <ul>
                                {classItem.notes.map((currNote, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-200 rounded my-2">
                                        <span className="font-medium">{currNote.title || 'No Class Name'}</span>
                                        <div>
                                        <Link to={`/classNotes/${currNote._id}`} className="bg-purple-200 text-purple-700 px-3 py-1 rounded mx-1">Open</Link>
                                        <Link to={`/classNotes/${currNote._id}/edit`} className="bg-green-200 text-green-700 px-3 py-1 rounded mx-1">Edit</Link>
                                        <Link to={`/classNotes/delete/${currNote._id}`} className="bg-red-200 text-red-700 px-3 py-1 rounded mx-1">Delete</Link>
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
