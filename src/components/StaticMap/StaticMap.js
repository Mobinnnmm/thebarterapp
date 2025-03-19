"use client";

import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DEFAULT_POSITION = [43.652, -79.379];

const StaticMap = ( {givenCoords} ) => {

  const markerPosition = givenCoords ? givenCoords : DEFAULT_POSITION


  const customIcon = new L.Icon({
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const Markers = () => {
    // useMapEvents({
    //   click(e) {
    //     const newPosition = [e.latlng.lat, e.latlng.lng];
    //     setMarkerPosition(newPosition);
    //     console.log(newPosition)
    //     onSelectLocation(newPosition);  
    //   },
    // });

    return markerPosition ? <Marker position={markerPosition} icon={customIcon} /> : null;
  };

//   useEffect(() => {
  
//       onSelectLocation(markerPosition);
    
//   }, [markerPosition]);
    console.log(givenCoords)

  return (
    <MapContainer style={{ width: "100%", height: "30rem" }} center={markerPosition} zoom={13} scrollWheelZoom={true}>
      <Markers />
      <TileLayer
        attribution='&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default StaticMap;

