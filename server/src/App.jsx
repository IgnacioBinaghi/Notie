import './App.css';
import Home from "./components/home"
import ViewClass from "./components/viewClass"
import Note from "./components/note"
import Login from "./components/login"
import Register from "./components/register"
import IsAuthenticated from "./components/isAuthenticated"
import CreateClass from "./components/createClass"
import CreateNote from "./components/createNote"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route exact path="/" element={<IsAuthenticated><Navigate to="/home" /></IsAuthenticated>} />
          <Route exact path="/home" element={<IsAuthenticated><Home /></IsAuthenticated>} />
          <Route exact path="/classes/:classID" element={<IsAuthenticated><ViewClass /></IsAuthenticated>} />
          <Route exact path="/classNotes/:noteID" element={<IsAuthenticated><Note /></IsAuthenticated>} />
          <Route exact path="/createClass" element={<IsAuthenticated><CreateClass /></IsAuthenticated>} />
          <Route exact path="/createNote/:classID" element={<IsAuthenticated><CreateNote /></IsAuthenticated>} />


          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </div>
  );
}


export default App;
