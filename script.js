// Karte initialisieren
const map = L.map('map').setView([46.6, 11.7], 10);

// Testen Sie zuerst mit OpenStreetMap-Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Alternative Tile-URL als Backup, falls OpenStreetMap nicht funktioniert
const alternativeTileLayer = 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY';

// Funktion zum Anzeigen der Gefahrenbereiche basierend auf Lawinenstufe und Windrichtung
function showRiskAreas() {
    const level = document.getElementById("avalanche-level").value;
    const wind = document.getElementById("wind-direction").value;
    console.log(`Lawinenstufe: ${level}, Windrichtung: ${wind}`);
    
    // Beispiel-Gefahrenbereich anzeigen
    L.circle([46.6, 11.7], { radius: level * 1000, color: 'red' }).addTo(map);
}

// Datei hochladen und auf der Karte anzeigen
document.getElementById("file-input").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                L.geoJSON(data).addTo(map);
                console.log("Route erfolgreich geladen.");
            } catch (error) {
                console.error("Fehler beim Parsen der Datei:", error);
            }
        };
        reader.readAsText(file);
    }
});

// Modus zum Zeichnen von Routen ein- und ausschalten
let isDrawing = false;
function toggleDrawMode() {
    if (isDrawing) {
        map.off("click", addMarker);
        console.log("Zeichenmodus deaktiviert.");
    } else {
        map.on("click", addMarker);
        console.log("Zeichenmodus aktiviert.");
    }
    isDrawing = !isDrawing;
}

// Marker zur Karte hinzufügen
function addMarker(e) {
    L.marker(e.latlng).addTo(map);
    console.log("Marker hinzugefügt bei:", e.latlng);
}

// Überprüfe die Konsole auf Fehler und alternative Tile-Layer verwenden
map.on('tileerror', function(error, tile) {
    console.error("Fehler beim Laden der Tile:", error);
    console.log("Versuche alternativen Tile-Layer zu laden.");
    
    // Wechsel auf alternative Tile-URL
    L.tileLayer(alternativeTileLayer, {
        attribution: '&copy; OpenWeatherMap contributors'
    }).addTo(map);
});
