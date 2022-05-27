import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Nav, Navbar, NavDropdown, Badge, Button, Card, Table, Row, Col, Form, OverlayTrigger, Tooltip, } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useContext, useSearchParams } from 'react';
const Header = () => {
    const tk = sessionStorage.getItem("token");

    let { id } = useParams();

    return (
        <div>
            <Navbar expand="lg"style={{ backgroundColor: "#C9060C", opacity:"75" }}>
                <Container>
                    <Navbar.Brand   href={"/home/" + id}>Ambulance Tracker</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse class="navbar-collapse" id="basic-navbar-nav">
                        <Nav  className="me-auto">
                            <Nav.Link href={"/home/" + id}>Home</Nav.Link>
                            <Nav.Link href={"/frota/" + id}>Frota</Nav.Link>
                        </Nav>
                        <Nav>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown" class="dropdown-menu dropdown-menu-end">
                                <NavDropdown.Item style={{color:"black"}} href="/faqs">Faqs</NavDropdown.Item>
                                <NavDropdown.Item style={{color:"black"}} href={"/frota/" + id}>Frota</NavDropdown.Item>
                                <NavDropdown.Item style={{color:"black"}} href="/aboutUs">AboutUs</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item style={{color:"black"}} href="/">Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div >
    );
}

export default Header;
