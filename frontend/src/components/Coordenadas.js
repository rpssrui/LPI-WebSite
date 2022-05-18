import React, { useState, useEffect } from "react";
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import L from "leaflet"
import ambulanceIcon from '../components/ambulance-icon.png'

function getIcon() {

    return L.icon({
        iconUrl: ambulanceIcon,

        iconSize: [35, 35], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
}


function DataMapa() {
    let { id } = useParams();

    const tk = sessionStorage.getItem("token");
    const [coordenadas, setCoordenadas] = useState([])
    const [veiculos, setVeiculos] = useState([])
    const [teste, setTeste] = useState([])
    const [err, setErr] = useState('');
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        async function getData1() {
            await axios.get('http://127.0.0.1:5000/mapa/' + id, { headers: { "Authorization": tk } })
                .then(res => {
                    console.log(res)
                    setVeiculos(res.data.data.veiculos)
                    setCoordenadas(res.data.data.coordenadas)

                    setLoadingData(false);
                })
        }
        if (loadingData) {
            // if the result is not ready so you make the axios call
            getData1();
        }
    }, []);

    const getAnswer = async () => {
        axios.get('http://127.0.0.1:5000/mapa/' + id, { headers: { "Authorization": tk } })
            .then(res => {
                console.log(res)
                setVeiculos(res.data.data.veiculos)
                setCoordenadas(res.data.data.coordenadas)

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
                <LayersControl position="topright">
                    <LayersControl.Overlay name="Marker with popup">
                        <Marker position={[41.1579448, -8.6291053]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </LayersControl.Overlay>

                </LayersControl>
                {coordenadas.map(coordenada => (

                    <Marker position={[coordenada.latitude, coordenada.longitude]} icon={getIcon()}>

                        <Popup>Matricula: {veiculos[coordenada.veiculo_id - 1].matricula} <br></br> Tipo: {veiculos[coordenada.veiculo_id - 1].tipo}</Popup>
                        ))
                    </Marker>
                ))}



            </MapContainer>



        </div>
    );


}


export default DataMapa;