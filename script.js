// Initialize the Leaflet map
const map = L.map('map').setView([46.6, 11.7], 10); // Center on a default location

// Add a tile layer (OpenStreetMap as a base layer)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Example function for showing risk areas
function showRiskAreas() {
    const level = document.getElementById("avalanche-level").value;
    const wind = document.getElementById("wind-direction").value;
    console.log(`Lawinenstufe: ${level}, Windrichtung: ${wind}`);
    // Add circle or other markers on map as an example
    L.circle([46.6, 11.7], { radius: level * 1000, color: 'red' }).addTo(map);
}

// Toggle drawing mode for adding markers on click
let isDrawing = false;
function toggleDrawMode() {
    if (isDrawing) {
        map.off("click", addMarker);
        console.log("Draw mode deactivated.");
    } else {
        map.on("click", addMarker);
        console.log("Draw mode activated.");
    }
    isDrawing = !isDrawing;
}

// Function to add markers
function addMarker(e) {
    L.marker(e.latlng).addTo(map);
    console.log("Marker added at:", e.latlng);
}
