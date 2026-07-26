const MapDisplay = ({ latitude, longitude, title }) => {
  if (!latitude || !longitude) {
    return <p style={{ color: "#999" }}>Location not available</p>;
  }

  const googleMapsUrl = `https://www.google.com/maps/search/${latitude},${longitude}`;
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;

  return (
    <div style={{ marginTop: "1rem" }}>
      <div style={{ 
        padding: "1rem", 
        backgroundColor: "#f0f8f0", 
        borderRadius: "8px", 
        border: "1px solid #ddd",
        marginBottom: "1rem"
      }}>
        <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600" }}>
          📍 Location: {title}
        </p>
        <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#666" }}>
          Latitude: {latitude.toFixed(4)}, Longitude: {longitude.toFixed(4)}
        </p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0f766e",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            View on Google Maps
          </a>
          <a 
            href={openStreetMapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6b7280",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            View on OpenStreetMap
          </a>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;
