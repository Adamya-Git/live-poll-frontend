// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Teacher from './Teacher';
import Student from './Student';
import Home from './Home';

function App(){
  return (
    <Router>
      <div style={{padding:20}}>
        <h1>Live Poll (MVP)</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/teacher">Teacher</Link> | <Link to="/student">Student</Link>
        </nav>
        <hr/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/teacher" element={<Teacher/>}/>
          <Route path="/student" element={<Student/>}/>
        </Routes>
      </div>
    </Router>
  );
}
export default App;
