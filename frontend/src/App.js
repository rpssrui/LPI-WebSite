import './App.css';
import React, { useState, useEffect } from 'react';
import DataMapa from "./components/Coordenadas"
import Register from "./components/Register"

var cors = require('cors');
App.use(cors());
function App(){
  

  return (
    <div>
      <Register/>
    </div>
  );

}

export default App;