"use client";

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DEFAULT_POSITION = [43.652, -79.379];

const EditMap = ({ givenCoords, onSelectLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(
    givenCoords ? givenCoords : DEFAULT_POSITION
  );
  const [address, setAddress] = useState("");

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

  const Markers = () => {
    useMapEvents({
      click(e) {
        const newPosition = [e.latlng.lat, e.latlng.lng];
        setMarkerPosition(newPosition);
        onSelectLocation(newPosition);
      },
    });

    return markerPosition ? (
      <Marker position={markerPosition} icon={customIcon} />
    ) : null;
  };

  useEffect(() => {
    onSelectLocation(markerPosition);
  }, [markerPosition]);

  const handleAddressSearch = async () => {
    if (!address) return;

    const query = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      const newPosition = [parseFloat(lat), parseFloat(lon)];
      setMarkerPosition(newPosition);
      onSelectLocation(newPosition);
    } else {
      alert("Address not found.");
    }
  };

  return (
    <>
      {/* Address Search */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-1/2 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-white"
        />
        <button
          type="button"
          onClick={handleAddressSearch}
          className = "mt-0 text-gray-200 hover:text-white p-2 rounded-full bg-gray-600/50 hover:bg-gray-700 "
        >
          Search
        </button>
      </div>

      <MapContainer
        style={{ width: "100%", height: "30rem" }}
        center={markerPosition}
        zoom={13}
        scrollWheelZoom={true}
      >
        <MapController position={markerPosition} />
        <Markers />
        <TileLayer
          attribution='&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </>
  );
};

export default EditMap;
