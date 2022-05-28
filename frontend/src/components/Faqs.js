import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Nav, Navbar, NavDropdown, Badge, Button, Card, Table, Row, Col, Form, OverlayTrigger, Tooltip, } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useContext, useSearchParams } from 'react';
import Header from '../components/Header';

import Faq from "react-faq-component";

const data = {
    
    rows: [
        {
            title: "Como adicionar um novo veículo?",
            content:"Dirija-se até à area de gestão da frota. Preencha os campos com as informações corretas. Nota:O id do dispositivo será proporcionado pela nossa equipa, sendo esta a peça fulcral para identificar-mos o seu veículo.",
        },
        {
            title: "Como editar/eliminar um veículo?",
            content:
                "Na área de gestão de frota encontrará ambas as opções, quanto à edição apenas será necessária em caso de substituição de dispositos.",
        },
        {
            title: "Como criar um marcador personalizado?",
            content: "Com o mapa aberto clique em cima do local que tenciona guardar como marcador personalizado. Vão ser apresentadas as coordenadas(Longitude e Latitude desse local). A seguir apenas tem que copiar e colar estes dados para os campos de inserseção dos mesmos. Tem ainda a opção de adicionar um nome ao marcador.",
        },
        {
            title: "Como ativar/desativar marcadores?",
            content: "No canto superior esquerdo do seu mapa encontrará um menu com um botão para cada categoria de marcadores (i.e. Veículos, Hospitais ou marcadores personalizados), aí pode ativar ou esconder cada uma destas categorias.",
        },
    ],
};

const styles = {
    bgColor: 'white',
    titleTextColor: "blue",
    rowTitleColor: "blue",
    rowContentColor: 'grey',
    arrowColor: "red",
};

const config = {
    animate: true,
    arrowIcon: "V",
    tabFocus: true
};

export default function App() {

    return (
        <div>
            <Header></Header>
            <div >
            <Faq
                data={data}
                styles={styles}
                config={config}
            />
            </div>
        </div>
    );
}