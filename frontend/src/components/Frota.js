import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Nav, Navbar, NavDropdown, Badge, Button, Card, Table, Row, Col, Form, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import Header from '../components/Header';
import { useRef, useState, useEffect, useContext, useSearchParams } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Frota = () => {
    let { id } = useParams();
    let navigate = useNavigate();
    const queryParams = new URLSearchParams(window.location.search)
    const tk = queryParams.get('tk');

    const [veiculos, setVeiculos] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        async function getData() {
            await axios
                .get('http://127.0.0.1:5000/frota/' + id, { headers: { "Authorization": tk } })
                .then((response) => {
                    // check if the data is populated
                    console.log(response.data.veiculos);
                    setVeiculos(response.data.veiculos);
                    // you tell it that you had the result
                    setLoadingData(false);
                });
        }
        if (loadingData) {
            // if the result is not ready so you make the axios call
            getData();
        }
    }, []);

    function deleteVeiculo(idVeiculo) {
        axios.delete('http://127.0.0.1:5000/removerVeiculo/' + idVeiculo).then((response) => {
            console.log(response.data);
        })
        window.location.reload(false);
    };

    return (
        <div>

            <Header></Header>
            <br></br>

            <Card>
                <Card.Header>
                    <Card.Title as="h4">Meus Veículos</Card.Title>
                    <p className="card-category">Editar/Remover veículos</p>
                </Card.Header>
                <Card.Body>
                    <table class="table table-borderless">
                        <th>Id</th>
                        <th>Matricula</th>
                        <th>Dispositivo</th>
                        <th>Tipo</th>
                        <th>Editar</th>
                        <th>Remover</th>
                        {veiculos.map((item =>
                            <tr>
                                <td>{item.id}</td>
                                <td>{item.matricula}</td>
                                <td>{item.device_id}</td>
                                <td>adicionar tipo</td>
                                <td> <Button variant="info" active style={{ marginBottom: '3px' }} onClick={handleShow}><FontAwesomeIcon icon={faCheck} /></Button></td>
                                <td> <Button variant="danger" active style={{ marginBottom: '3px' }} onClick={() => deleteVeiculo(item.id)} ><FontAwesomeIcon icon={faCheck} /></Button></td>
                            </tr>
                        ))}
                    </table>
                </Card.Body>
                <Card.Footer>
                    <div className="legend">
                    </div>
                </Card.Footer>
            </Card>

            <Card>
                <Card.Header>
                    <Card.Title as="h4">Adicionar um novo Veículo</Card.Title>
                    <p className="card-category"></p>
                </Card.Header>
                <Card.Body>

                </Card.Body>
                <Card.Footer>
                    <div className="legend">
                    </div>
                </Card.Footer>
            </Card>
            
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </div >
    )
}

export default Frota;