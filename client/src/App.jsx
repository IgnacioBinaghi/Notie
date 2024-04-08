import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Home from "./components/home"
import ViewClass from "./components/viewClass"
import Note from "./components/note"
import Login from "./components/login"
import Register from "./components/register"
import CreateClass from "./components/createClass"
import CreateNote from "./components/createNote"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/classes/:classID" element={<ViewClass />} />
          <Route path="/classNotes/:noteID" element={<Note />} />
          <Route path="/createClass" element={<CreateClass />} />
          <Route path="/createNote/:classID" element={<CreateNote />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
