import React, { useState, useEffect } from "react";
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function DataMapa() {
    let { id } = useParams();
    let navigate = useNavigate();

    const tk = sessionStorage.getItem("token");
    const [coordenadas, setCoordenadas] = useState([])
    const [err, setErr] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/mapa/' + id, { headers: { "Authorization": tk } })
            .then(res => {
                console.log(res)
                setCoordenadas(res.data.coordenadas)
            })
            .catch(erro => {
                console.log(erro)
                setErr(erro)
            })
    }, []);

    const getAnswer = async () => {
        axios.get('http://127.0.0.1:5000/mapa/' + id, { headers: { "Authorization": tk } })
            .then(res => {
                console.log(res)
                setCoordenadas(res.data.coordenadas)
            })
            .catch(erro => {
                console.log(erro)
                setErr(erro)
            })
    };

    useEffect(() => {
        const timer = setInterval(getAnswer, 20000);
        return () => clearInterval(timer);
    }, []);


    return (

        <div>
            <Header></Header>

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