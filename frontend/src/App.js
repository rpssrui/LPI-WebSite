import './App.css';
import React, { useState, useEffect } from 'react';
import {Coordenadas} from "./components/Coordenadas"


function App(){
  const [coordenadas,setCoordenadas]=useState({lat:null,lng:null});
  
  setInterval(() => {

    fetch("http://127.0.0.1:5000/mapa")
    .then(response=>
      response.json().then(data=>{
        setCoordenadas(data.coordenadas);
      }))
  },40000);

  console.log(coordenadas)

  return (
    <div>
      <Coordenadas coordenadas={coordenadas}/>
    </div>
  );

}

export default App;