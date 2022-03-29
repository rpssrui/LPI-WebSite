import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
export const Coordenadas = ({ coordenadas }) => {
    return (
        <div>
            <MapContainer center={[41.1579448,-8.6291053]} zoom={7}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {coordenadas.latitude && coordenadas.longitude && <Marker position={[coordenadas.latitude, coordenadas.longitude]} />}
            </MapContainer>
        </div>
    );
};
