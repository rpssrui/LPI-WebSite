import './App.css';
import React, { useState, useEffect } from 'react';
import DataMapa from "./components/Coordenadas"
import Register from "./components/Register"
import Login from './components/Login';
import Home from './components/Home';
import ErrorPage from './components/ErrorPage';
import { BrowserRouter as Router, Route, Routes,useNavigate } from 'react-router-dom';



function App() {

  return (
    <div>
      <Router>
        <Routes>
        <Route index element={<Login/>} />
          <Route path="/login" element={<Login></Login>} />
          <Route path="/register" element={<Register></Register>} />
          <Route path="/mapa" element={<DataMapa></DataMapa>} />
          <Route path="/home/:id" element={<Home></Home>}/>
          <Route path="/errorPage" element={<ErrorPage></ErrorPage>} />
        </Routes>
      </Router>
    </div>
  );

}

export default App;