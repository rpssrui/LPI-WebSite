import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Nav, Navbar, NavDropdown, Badge, Button, Card, Table, Row, Col, Form, OverlayTrigger, Tooltip, } from 'react-bootstrap';
import Header from '../components/Header';
import { useRef, useState, useEffect, useContext, useSearchParams } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, FeatureGroup, useMapEvents } from 'react-leaflet'
import { useParams, useNavigate } from 'react-router-dom';
import L from "leaflet"
import ambulanceIcon from '../components/ambulance-icon.png'
import hositalIcon from '../components/hospitalIcon.png'
import customMarkerIcon from '../components/customMarker-icon.png'

function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        click(ev) {
            setPosition(ev.latlng)
        },
    })
    return position === null ? null : (
        <Marker position={position}>
            <Popup>Latitude:{position.lat} <br></br>Longitude:{position.lng} </Popup>
        </Marker>
    )
}


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
function getHospitalIcon() {

    return L.icon({
        iconUrl: hositalIcon,

        iconSize: [35, 35], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
}

function getCustomMarkerIcon() {

    return L.icon({
        iconUrl: customMarkerIcon,

        iconSize: [35, 35], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
}

const Home = () => {

    let { id } = useParams();

    const tk = sessionStorage.getItem("token");
    const [coordenadas, setCoordenadas] = useState([])
    const [veiculos, setVeiculos] = useState([])
    const [teste, setTeste] = useState([])
    const [err, setErr] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const [hospitais, setHospitais] = useState([]);
    const [customMarkers, setCustomMarkers]=useState([]);

    let navigate = useNavigate();

    const [countVeiculos, setCountVeiculos] = useState('');
    const [hora, setHora] = useState('');

    const [userMarkerLat,setUserMarkerLat]=useState('');
    const [userMarkerLong,setUserMarkerLong]=useState('');
    const [userMarkerName,setUserMarkerName]=useState('');


    useEffect(() => {
        axios.get('http://127.0.0.1:5000/homeInfo/' + id, { headers: { "Authorization": tk } })

            .then(res => {
                console.log(res);
                setCountVeiculos(res.data.info.nrveiculos);
                setHora(res.data.info.hora);
            })
            .catch(err => {
                console.log(err);
                setErr(err);
            })

    }, []);

    useEffect(() => {
        async function getData1() {
            await axios.get('http://127.0.0.1:5000/mapa/' + id, { headers: { "Authorization": tk } })
                .then(res => {
                    console.log(res)
                    setVeiculos(res.data.data.veiculos)
                    setCoordenadas(res.data.data.coordenadas)
                    setHospitais(res.data.data.hospitais)
                    setCustomMarkers(res.data.data.customMarkers)
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
                setCustomMarkers(res.data.data.customMarkers)

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


    function addCustomMarker() {
        console.log(userMarkerName+userMarkerLat+userMarkerLong)
        axios.post('http://127.0.0.1:5000/addCustomMarker/' + id, JSON.stringify({ name: userMarkerName, latitude: userMarkerLat, longitude: userMarkerLong}), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false
        }).then((response) => {
            console.log(response.data);
        })
        //window.location.reload(true);

    }




    return (

        <div>

            <Header></Header>

            <Row>
                <Col>
                    <MapContainer center={[41.1579448, -8.6291053]} zoom={7} style={{ width: "1550px", marginTop: "50px", marginLeft: "50px", marginBottom: "50px" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <LayersControl position="topleft">

                            <LayersControl.Overlay name="Veículos">
                                <FeatureGroup>
                                    {coordenadas.map(coordenada => (

                                        <Marker position={[coordenada.latitude, coordenada.longitude]} icon={getIcon()}>

                                            <Popup>Matricula: {veiculos[coordenada.veiculo_id - 1].matricula} <br></br> Tipo: {veiculos[coordenada.veiculo_id - 1].tipo}</Popup>

                                        </Marker>
                                    ))}
                                </FeatureGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay name="Meus Marcadores">
                                <FeatureGroup>
                                    {customMarkers.map(customMarker => (


                                        <Marker position={[customMarker.latitude, customMarker.longitude]} icon={getCustomMarkerIcon()}>

                                            <Popup>{customMarker.name}</Popup>

                                        </Marker>
                                    ))}
                                </FeatureGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay name="Hospitais">
                                <FeatureGroup>
                                    {hospitais.map(hospital => (


                                        <Marker position={[hospital.Latitude, hospital.Longitude]} icon={getHospitalIcon()}>

                                            <Popup>{hospital.Nome}</Popup>

                                        </Marker>
                                    ))}
                                </FeatureGroup>
                            </LayersControl.Overlay>

                           
                            <LocationMarker />

                        </LayersControl>

                    </MapContainer>
                </Col>
                <Col>
                    <div>
                        <Card className="card-stats" style={{ marginRight: "20px", marginTop: "50px" }}>
                            <Card.Body>
                                <Row>
                                    <Col xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <i className="nc-icon nc-favourite-28 text-primary"></i>
                                        </div>
                                    </Col>
                                    <Col xs="7">
                                        <div className="numbers">
                                            <Card.Title as="h4" style={{ marginLeft: '-50%' }}>Updates</Card.Title>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer>
                                <hr></hr>
                                <div className="stats">
                                    Ultima Atualização: {hora}
                                </div>
                            </Card.Footer>
                        </Card>
                    </div>
                    <div>
                        <Card className="card-stats" style={{ marginRight: "20px", marginTop: "50px" }}>
                            <Card.Body>
                                <Row>
                                    <Col xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <i className="nc-icon nc-favourite-28 text-primary"></i>
                                        </div>
                                    </Col>
                                    <Col xs="7">
                                        <div className="numbers">
                                            <Card.Title as="h6" style={{ marginLeft: '-70%' }}>Novo marcador personalizado</Card.Title>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer>
                                <Form onSubmit={addCustomMarker}>
                                    <label>Latitude</label>
                                    <input
                                        type="text"
                                        id="latUserMarker"
                                        onChange={(e) => setUserMarkerLat(e.target.value)}
                                        style={{ width: "200px" }}
                                        >


                                    </input>
                                    <label>Longitude</label>
                                    <input
                                        type="text"
                                        id="longUserMarker"
                                        onChange={(e) => setUserMarkerLong(e.target.value)}
                                        style={{ width: "200px", }}
                                        >
                                    </input>
                                    <label>Nome</label>
                                    <input
                                        type="text"
                                        id="nomeUserMarker"
                                        onChange={(e) => setUserMarkerName(e.target.value)}
                                        style={{ width: "200px", }}
                                       >
                                    </input>
                                    <Button type="submit" variant="outline-success" active style={{ marginTop: '20px', width: "200px" }} >Adicionar </Button>
                                </Form>
                            </Card.Footer>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );


}


export default Home;