"use client";

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Circle,
  useMap,
} from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DEFAULT_POSITION = [43.652, -79.379];

const SortMap = ({ onSelectLocation, onSelectRadius }) => {
  const [markerPosition, setMarkerPosition] = useState(DEFAULT_POSITION);
  const [radius, setRadius] = useState(2500);
  const [address, setAddress] = useState("");
  const circleRef = useRef(null);

  const customIcon = new L.Icon({
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const MapController = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(position, 13);
    }, [position]);
    return null;
  };

  // Click to place marker & circle
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
    if (circleRef.current) {
      circleRef.current.setRadius(newRadius);
    }
  };

  const handleAddressSearch = async () => {
    if (!address) return;

    const query = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      const newPos = [parseFloat(lat), parseFloat(lon)];
      setMarkerPosition(newPos);
      onSelectLocation(newPos);

      if (circleRef.current) {
        circleRef.current.setLatLng(newPos).setRadius(radius);
      }
    } else {
      alert("Address not found.");
    }
  };

  return (
    <>
      {/* Address search bar */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          className="w-1/2 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-white"
          type="text"
          placeholder="Search address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          
        />
        <button className = "mt-0 text-gray-200 hover:text-white p-2 rounded-full bg-gray-600/50 hover:bg-gray-700 transition-all"onClick={handleAddressSearch} style={{ padding: "0.5rem" }}>
          Search
        </button>
      </div>

      <MapContainer
        style={{ width: "50%", height: "30rem" }}
        center={DEFAULT_POSITION}
        zoom={12}
        scrollWheelZoom={true}
      >
        <MapController position={markerPosition} />
        <Markers />
        <TileLayer
          attribution="&copy; <a href='http://openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>

      {/* Radius Slider */}
      <div className="pt-4">
        <label htmlFor="radiusSlider">Range: {radius/1000} km  </label>
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
