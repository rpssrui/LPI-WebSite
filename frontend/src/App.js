import './App.css';
import React, { useState, useEffect } from 'react';
import DataMapa from "./components/Coordenadas"
import Register from "./components/Register"
import Login from './components/Login';
import Home from './components/Home';
import ErrorPage from './components/ErrorPage';
import Frota from './components/Frota';
import Help from './components/Help';
import AboutUs from './components/AboutUs';
import { BrowserRouter as Router, Route, Routes,useNavigate } from 'react-router-dom';




function App() {

  return (
    <div>
      <Router>
        <Routes>
        <Route index element={<Login/>} />
          <Route path="/login" element={<Login></Login>} />
          <Route path="/register" element={<Register></Register>} />
          <Route path="/mapa/:id" element={<DataMapa></DataMapa>} />
          <Route path="/home/:id" element={<Home></Home>}/>
          <Route path="/errorPage" element={<ErrorPage></ErrorPage>} />
          <Route path="/frota/:id" element={<Frota></Frota>} />
          <Route path="/faqs" element={<Help></Help>} />
          <Route path="/aboutUs" element={<AboutUs></AboutUs>} />
        </Routes>
      </Router>
    </div>
  );

}

export default App;