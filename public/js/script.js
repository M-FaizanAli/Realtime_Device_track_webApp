const socket = io();

// Get user location and send to server
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.log("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Initialize Leaflet map
const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors"
}).addTo(map);

const markers = {};

// Handle location updates
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        // Update marker position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Add a new marker for this user
        markers[id] = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`User: ${id}`);
    }
});

// Remove marker on user disconnect
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
