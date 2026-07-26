import { useState, useEffect } from "react";

const MapPicker = ({ onLocationSelect, initialLocation = null }) => {
  const [location, setLocation] = useState(
    initialLocation || { latitude: 17.3850, longitude: 78.4867 }
  );
  const [address, setAddress] = useState("Hyderabad");

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const addressName = data.address?.road || data.address?.neighbourhood || data.address?.suburb || "Selected Location";
      setAddress(`${addressName} (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    } catch (error) {
      console.error("Reverse geocode error:", error);
      setAddress(`Selected Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
      reverseGeocode(initialLocation.latitude, initialLocation.longitude);
    }
  }, [initialLocation]);

  const handleLatChange = (e) => {
    const newLat = parseFloat(e.target.value);
    if (!isNaN(newLat)) {
      const newLocation = { ...location, latitude: newLat };
      setLocation(newLocation);
      reverseGeocode(newLat, newLocation.longitude);
      onLocationSelect(newLocation);
    }
  };

  const handleLngChange = (e) => {
    const newLng = parseFloat(e.target.value);
    if (!isNaN(newLng)) {
      const newLocation = { ...location, longitude: newLng };
      setLocation(newLocation);
      reverseGeocode(newLocation.latitude, newLng);
      onLocationSelect(newLocation);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      setLocation(newLocation);
      reverseGeocode(newLocation.latitude, newLocation.longitude);
      onLocationSelect(newLocation);
    } catch (error) {
      alert("Could not get your location. Please enable location services.");
    }
  };

  return (
    <div className="map-picker">
      <label>
        Select Location
        <p className="map-info" style={{ margin: "0.5rem 0", fontSize: "0.9rem", color: "#666" }}>
          {address}
        </p>
      </label>
      
      <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f0f8f0", borderRadius: "8px" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Latitude
            <input
              type="number"
              step="0.0001"
              value={location.latitude}
              onChange={handleLatChange}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Longitude
            <input
              type="number"
              step="0.0001"
              value={location.longitude}
              onChange={handleLngChange}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </label>
        </div>
        <button 
          type="button"
          onClick={handleUseCurrentLocation}
          style={{
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "#0f766e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.95rem"
          }}
        >
          📍 Use Current Location
        </button>
      </div>
      
      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
        Current coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
      </p>
    </div>
  );
};

export default MapPicker;
