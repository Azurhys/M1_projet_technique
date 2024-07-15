import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css'
import Articles from './pages/Articles.jsx';
import Login from './pages/Login.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}> 
            <Route index element={<Home />} />
            <Route path="/articles" element={<Articles  />} /> 
            <Route path="/login" element={<Login />} />
          </Route>    
        </Routes>
  </BrowserRouter>
)
