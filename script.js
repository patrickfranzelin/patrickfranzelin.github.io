const map = L.map('map').setView([46.6, 11.7], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function showRiskAreas() {
    const level = document.getElementById("avalanche-level").value;
    const wind = document.getElementById("wind-direction").value;
    alert(`Lawinenstufe: ${level}, Windrichtung: ${wind}`);
    L.circle([46.6, 11.7], { radius: level * 1000, color: 'red' }).addTo(map);
}

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
