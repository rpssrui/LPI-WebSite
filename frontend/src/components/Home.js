import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Nav, Navbar, NavDropdown, Badge, Button, Card, Table, Row, Col, Form, OverlayTrigger, Tooltip, } from 'react-bootstrap';
import Header from '../components/Header';


const Home = () => {
    function getVeiculos() {

    }

    return (
        <tudo>
            <Header></Header>
            
            <Container fluid>
                <br></br>
                <Row>
                    <Col md="8">
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">Adicionar Nome ao User e ir Buscar</Card.Title>
                                <p className="card-category">Sistema de Localização</p>
                            </Card.Header>
                            <Card.Body>
                                <div className="ct-chart" id="chartHours">

                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <div className="legend">
                                    <i></i>
                                    <Button href="/mapa">Abrir Mapa?</Button>  <i></i>
                                    <i></i>
                                    <Button href="/mapa-info">Como funciona?</Button> 
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>

                </Row>
                <br></br>
                <Row>
                    <Col lg="3" sm="6">
                        <Card className="card-stats">
                            <Card.Body>
                                <Row>
                                    <Col xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <i className="nc-icon nc-chart text-warning"></i>
                                        </div>
                                    </Col>
                                    <Col xs="7">
                                        <div className="numbers">
                                            <Card.Title as="h4">Frota</Card.Title>
                                            <Card.Subtitle>X veiculos</Card.Subtitle>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer>
                                <hr></hr>
                                <div className="stats">
                                    <i></i>
                                    <Button href="/gerir-frota">Gestão</Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg="3" sm="6">
                        <Card className="card-stats">
                            <Card.Body>
                                <Row>
                                    <Col xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <i className="nc-icon nc-favourite-28 text-primary"></i>
                                        </div>
                                    </Col>
                                    <Col xs="7">
                                        <div className="numbers">
                                            <Card.Title as="h4">Updates</Card.Title>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer>
                                <hr></hr>
                                <div className="stats">
                                    Ultima Atualização: Adicionar data às coordenadas
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </tudo >
    );
}


export default Home;