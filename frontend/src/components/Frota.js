import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Nav, Navbar, NavDropdown, Badge, Button, Card, Table, Row, Col, Form, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import Header from '../components/Header';
import { useRef, useState, useEffect, useContext, useSearchParams } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MATRICULA_REGEX = /^(([A-Z]{2}-\d{2}-(\d{2}|[A-Z]{2}))|(\d{2}-(\d{2}-[A-Z]{2}|[A-Z]{2}-\d{2})))$/

const Frota = () => {
    let { id } = useParams();
    let navigate = useNavigate();
    const tk = sessionStorage.getItem("token");


    const [selectedOption, setSelectedOption] = useState();




    const [veiculos, setVeiculos] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [newMatricula, setNewMatricula] = useState('');
    const [validMatricula, setValidMatricula] = useState(false);
    const [matriculaFocus, setMatriculaFocus] = useState(false);

    const [newDevice, setNewDevice] = useState('');
    const [newTipo, setNewTipo] = useState('');

    useEffect(() => {
        setValidMatricula(MATRICULA_REGEX.test(newMatricula));
    }, [newMatricula])

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

    function addVeiculo() {
        console.log(newMatricula + "device:" + newDevice + "tipo" + newTipo)
        axios.post('http://127.0.0.1:5000/addVeiculo/' + id, JSON.stringify({ matricula: newMatricula, device_id: newDevice, tipo: newTipo }), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false
        }).then((response) => {
            console.log(response.data);
        })
        //window.location.reload(true);
    }

    function editarVeiculo() {


        axios.put('http://127.0.0.1:5000/editarVeiculo/' + selectedOption, JSON.stringify({ device_id: newDevice, tipo: newTipo }), {
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
                        <th>Tipo de Veículo</th>
                        <th>Remover</th>
                        {veiculos.map((item =>
                            <tr>
                                <td>{item.id}</td>
                                <td>{item.matricula}</td>
                                <td>{item.device_id}</td>
                                <td>{item.tipo}</td>
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
                    <Card.Title as="h4">Adicionar um novo Veículo &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Editar Veículo</Card.Title>
                    <p className="card-category"></p>
                </Card.Header>
                <Card.Body>
                    <Row>
                    <Col>
                    <Form onSubmit={addVeiculo}>
                        <label>Matricula</label>
                        <input
                            type="text"
                            id="matricula"
                            onChange={(e) => setNewMatricula(e.target.value)}
                            style={{ width: "300px" }}
                            placeholder="Ex: 33-RJ-36">


                        </input>
                        <p id="pwdnote" className={matriculaFocus && !validMatricula ? "instructions" : "offscreen"} style={{ marginLeft: "-16px", width: "450px" }}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Formato de matricula inválido.<br />
                            <br />
                        </p>
                        <label>Dispositivo</label>
                        <input
                            type="text"
                            id="device_id"
                            onChange={(e) => setNewDevice(e.target.value)}
                            style={{ width: "300px", }}
                            placeholder="Id do dispositivo"
                        >
                        </input>
                        <label>Tipo</label>
                        <select name="tipo" id="tipo" onChange={(e) => setNewTipo(e.target.value)} style={{ width: "300px" }}>
                            <option value="ABSC">ABSC</option>
                            <option value="VDTD">VDTD</option>
                            <option value="ABTM">ABTM</option>
                            <option value="ABCI">ABCI</option>
                            <option value="VLCI">VLCI</option>
                            <option value="VFCI">VFCI</option>
                            <option value="VRCI">VRCI</option>
                            <option value="VECI">VECI</option>
                            <option value="VTTU">VTTU</option>
                            <option value="VUCI">VUCI</option>
                            <option value="VTTR">VTTR</option>
                            <option value="VTTF">VTTF</option>
                            <option value="VTGC">VTGC</option>
                            <option value="VETA">VETA</option>
                            <option value="VAPA">VAPA</option>
                            <option value="VAME">VAME</option>
                            <option value="VE32">VE32</option>
                            <option value="VSAT">VSAT</option>
                            <option value="VSAE">VSAE</option>
                            <option value="VPME">VPME</option>
                            <option value="VCOT">VCOT</option>
                            <option value="VCOC">VCOC</option>
                            <option value="VTPT">VTPT</option>
                            <option value="VTPG">VTPG</option>
                            <option value="VOPE">VOPE</option>
                            <option value="VSAM">VSAM</option>
                            <option value="VALE">VALE</option>
                        </select>
                        <Button type="submit" variant="outline-success" active style={{ marginTop: '20px', width: "300px" }} >Adicionar <FontAwesomeIcon icon={faCheck} /></Button>
                    </Form>
                    </Col>
                    <Col> <Form onSubmit={editarVeiculo}>
                        <label>Id do Veículo</label>
                        <select name="id_veiculo" id="id_veiculo" style={{ width: "300px" }} onChange={(e) => setSelectedOption(e.target.value)}>
                            {veiculos.map(veiculo => (
                                <option>{veiculo.id}</option>

                            ))}

                        </select>
                        <label>Dispositivo</label><input
                            style={{ width: "300px" }}
                            type="text"
                            onChange={(e) => setNewDevice(e.target.value)}
                            id="device_id"></input>
                        <label>Tipo</label>
                        <select name="tipo" id="tipo" onChange={(e) => setNewTipo(e.target.value)} style={{ width: "300px" }}>
                            <option value="ABSC">ABSC</option>
                            <option value="VDTD">VDTD</option>
                            <option value="ABTM">ABTM</option>
                            <option value="ABCI">ABCI</option>
                            <option value="VLCI">VLCI</option>
                            <option value="VFCI">VFCI</option>
                            <option value="VRCI">VRCI</option>
                            <option value="VECI">VECI</option>
                            <option value="VTTU">VTTU</option>
                            <option value="VUCI">VUCI</option>
                            <option value="VTTR">VTTR</option>
                            <option value="VTTF">VTTF</option>
                            <option value="VTGC">VTGC</option>
                            <option value="VETA">VETA</option>
                            <option value="VAPA">VAPA</option>
                            <option value="VAME">VAME</option>
                            <option value="VE32">VE32</option>
                            <option value="VSAT">VSAT</option>
                            <option value="VSAE">VSAE</option>
                            <option value="VPME">VPME</option>
                            <option value="VCOT">VCOT</option>
                            <option value="VCOC">VCOC</option>
                            <option value="VTPT">VTPT</option>
                            <option value="VTPG">VTPG</option>
                            <option value="VOPE">VOPE</option>
                            <option value="VSAM">VSAM</option>
                            <option value="VALE">VALE</option>
                        </select>
 
                        <Button type="submit" variant="outline-success" active style={{ marginTop: '20px', width: "300px" }} >Guardar Alterações <FontAwesomeIcon icon={faCheck} /></Button>
                    </Form>
                    </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <div className="legend">
                    </div>
                </Card.Footer>
            </Card>

        </div >
    )
}

export default Frota;