import React, { useState, useEffect } from "react";
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useParams, useNavigate } from 'react-router-dom';

function DataMapa() {
    let { id } = useParams();
    let navigate = useNavigate();

    const queryParams = new URLSearchParams(window.location.search)
    const tk = queryParams.get('tk');
    const [coordenadas, setCoordenadas] = useState([])
    const [err, setErr] = useState('');

    setInterval(() => {
        axios.get('http://127.0.0.1:5000/mapa/' + id, { headers: { "Authorization": tk } })
            .then(res => {
                console.log(res)
                setCoordenadas(res.data.coordenadas)
            })
            .catch(erro => {
                console.log(erro)
                setErr(erro)
            })
    }, 30000)

    if (err) {
        return (
            <div>
                {navigate("/errorPage")}
            </div>
        )
    }

    else
        return (

            <div>

                <MapContainer center={[41.1579448, -8.6291053]} zoom={7}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {coordenadas.map(coordenada => (
                        <Marker position={[coordenada.latitude, coordenada.longitude]}></Marker>
                    ))}

                </MapContainer>
            </div>
        );


}


export default DataMapa;