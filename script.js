// Map initialisieren
const map = L.map('map').setView([46.6, 11.7], 10);

// Mapbox-Satellitenkarte hinzufügen
L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}@2x?access_token=YOUR_MAPBOX_ACCESS_TOKEN`, {
  attribution: '© Mapbox © OpenStreetMap'
}).addTo(map);

// Funktion zur Anzeige von Lawinenrisikobereichen
function showRiskAreas() {
  const level = document.getElementById("avalanche-level").value;
  const wind = document.getElementById("wind-direction").value;
  
  alert(`Lawinenstufe: ${level}, Windrichtung: ${wind}`);
  
  // Beispiel-Risk Areas: In einer realen Anwendung würden GeoJSON-Daten geladen werden.
  L.circle([46.6, 11.7], { radius: level * 1000, color: 'red' }).addTo(map);
}

// Dateiupload verarbeiten
document.getElementById("file-input").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = JSON.parse(e.target.result);
      L.geoJSON(data).addTo(map);
    };
    reader.readAsText(file);
  }
});

// Routenzeichnen aktivieren
let isDrawing = false;
function toggleDrawMode() {
  if (isDrawing) {
    map.off("click", addMarker);
  } else {
    map.on("click", addMarker);
  }
  isDrawing = !isDrawing;
}

function addMarker(e) {
  L.marker(e.latlng).addTo(map);
}
