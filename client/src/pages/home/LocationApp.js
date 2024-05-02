import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { v4 as uuidv4 } from 'uuid';  // Import UUID for temporary ID generation
import { base_url } from '../../utils/config';

// Configure Leaflet's icon default paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow
});

function LocationApp() {
  const [locations, setLocations] = useState([]);
  const [locationString, setLocationString] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${base_url}/api/businesslocations`)
      .then(response => response.json())
      .then(data => {
        setLocations(data.map(location => ({ ...location, added: false })));
      })
      .catch(error => console.error('Failed to fetch locations:', error));
  }, []);

  const handleToggleLocation = (locationId) => {
    setLocations(prev => prev.map(location => {
      if (location._id === locationId) {
        return { ...location, added: !location.added };
      }
      return location;
    }));
  };

  const handleAddLocation = (e) => {
    const { lat, lng } = e.latlng;
  
    // Remove previously selected location if any
    setLocations(prev => prev.filter(location => !location.added));
  
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        let locationName = data.address.city || data.address.town;
        if (!locationName) {
          // Use latitude and longitude as location name if city or town name is not available
          locationName = 'Unknown_location';
        }
        const completeAddress = locationName === "Unknown_location" ? locationName : `${locationName}, ${data.address.country}`;
        const newLocation = {
          _id: uuidv4(),
          lat: lat,
          lng: lng,
          name: completeAddress,
          added: true
        };
        const locationString = `${newLocation.name},${newLocation.lat},${newLocation.lng}`;
  
        console.log("New Location:", locationString);
        setLocations([newLocation]);
        setLocationString(locationName === "Unknown_location" ? `${lat},${lng}` : locationString);
      })
      .catch(error => {
        console.error("Error fetching city name:", error);
        // Use latitude and longitude as location name
        const newLocation = {
          _id: uuidv4(),
          lat: lat,
          lng: lng,
          name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          added: true
        };
        const locationString = `${newLocation.lat},${newLocation.lng}`;
  
        console.log("New Location:", locationString);
        setLocations([newLocation]);
        setLocationString(locationString);
      });
  };
  
  
  const handleRemoveLocation = () => {
    setLocations([]);
  };

  const navigateToRegister = () => {
    navigate(`/register/${locationString}`);
  };

  return (
    <div className="location-app">
      <br />
      <h1><center>Select locations</center></h1>
      <br />
      <MapContainer center={[15.9129, 79.7400]} zoom={7} style={{ width: '100%', height: '400px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <AddLocation handleAddLocation={handleAddLocation} />
        {locations.length > 0 && locations.map(location => (
          <LocationMarker
            key={location._id}
            location={location}
            onToggle={handleToggleLocation}
            onRemove={handleRemoveLocation}
          />
        ))}
      </MapContainer>
      <button className="button-set-location" onClick={navigateToRegister}>Set Location</button>
    </div>
  );
}

function AddLocation({ handleAddLocation }) {
  useMapEvents({
    click: handleAddLocation
  });

  return null;
}
function LocationMarker({ location, onToggle, onRemove }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, []);

  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    console.error('Invalid location data:', location);
    return null;
  }

  const handleClick = () => {
    if (location.added) {
      onRemove();
    } else {
      onToggle(location._id);
    }
  };

  return (
    <Marker
      position={[location.lat, location.lng]}
      ref={markerRef}
      eventHandlers={{
        click: handleClick
      }}
    >
      <Popup>
        {location.name !== "Unknown_location" ? (
          <>
            <strong>Location:</strong> {location.name}<br />
          </>
        ) : null}
        <strong>Coordinates:</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
      </Popup>
      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
        {location.name !== "Unknown_location" ? (
          <>
            {location.name} ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
          </>
        ) : (
          <>
            Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </>
        )}
      </Tooltip>
    </Marker>
  );
}

export default LocationApp;
