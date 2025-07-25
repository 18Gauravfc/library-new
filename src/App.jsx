import React from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../src/assets/Pages/Home';
import './index.css';
import './App.css';
import Signup from './assets/Pages/Signup';
import Login from './assets/Pages/Login';
 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
