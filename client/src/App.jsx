import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Home from "./components/home"
import ViewClass from "./components/viewClass"
import Note from "./components/note"
import Login from "./components/login"
import Register from "./components/register"
import IsAuthenticated from "./components/isAuthenticated"
import CreateClass from "./components/createClass"
import CreateNote from "./components/createNote"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<IsAuthenticated><Navigate to="/home" /></IsAuthenticated>} />
          <Route path="/home" element={<IsAuthenticated><Home /></IsAuthenticated>} />
          <Route path="/classes/:classID" element={<IsAuthenticated><ViewClass /></IsAuthenticated>} />
          <Route path="/classNotes/:noteID" element={<IsAuthenticated><Note /></IsAuthenticated>} />
          <Route path="/createClass" element={<IsAuthenticated><CreateClass /></IsAuthenticated>} />
          <Route path="/createNote/:classID" element={<IsAuthenticated><CreateNote /></IsAuthenticated>} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
