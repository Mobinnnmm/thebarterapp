"use client";

import { MapContainer, TileLayer, useMapEvents, Marker, Circle } from "react-leaflet";
import { useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const SortMap = ({onSelectLocation, onSelectRadius}) => {
  const [markerPosition, setMarkerPosition] = useState([43.652, -79.379]);
  const [radius, setRadius] = useState(2500); 
  const circleRef = useRef(null); 

  const customIcon = new L.Icon({
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Create marker and circle on map click
  const Markers = () => {
    useMapEvents({
      click(e) {
        const newPosition = [e.latlng.lat, e.latlng.lng];
        setMarkerPosition(newPosition);
        onSelectLocation(newPosition);
        if (circleRef.current) {
          circleRef.current.setLatLng(e.latlng).setRadius(radius);
        }
      },
    });

    return markerPosition ? (
      <>
        <Marker position={markerPosition} icon={customIcon} />
        <Circle
          ref={circleRef}
          center={markerPosition}
          radius={radius}
          color="red"
          fillColor="red"
          fillOpacity={0.2}
        />
      </>
    ) : null;
  };

  const handleSliderChange = (e) => {
    const newRadius = parseInt(e.target.value, 10);
    setRadius(newRadius);
    onSelectRadius(newRadius);
    // Update the circle radius
    if (circleRef.current) {
      circleRef.current.setRadius(newRadius);
    }
  };

  return (
    <>
      <MapContainer
        style={{ width: "50%", height: "30rem" }}
        center={[43.652, -79.379]}
        zoom={12}
        scrollWheelZoom={true}
      >
        <Markers />
        <TileLayer
          attribution="&copy; <a href='http://openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>

      {/* Slider forr radius */}
      <div className="pt-4">
        <label htmlFor="radiusSlider">Range: {radius} Meters </label>
        <input
          id="radiusSlider"
          type="range"
          min="1000"
          max="20000"
          step="100"
          value={radius}
          onChange={handleSliderChange}
        />
      </div>
    </>
  );
};

export default SortMap;

