// Initialize Leaflet Map
const leafletMap = L.map('map').setView([46.6, 11.7], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(leafletMap);

function showRiskAreas() {
    const level = document.getElementById("avalanche-level").value;
    const wind = document.getElementById("wind-direction").value;
    alert(`Lawinenstufe: ${level}, Windrichtung: ${wind}`);
    L.circle([46.6, 11.7], { radius: level * 1000, color: 'red' }).addTo(leafletMap);
}

document.getElementById("file-input").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            L.geoJSON(data).addTo(leafletMap);
        };
        reader.readAsText(file);
    }
});

let isDrawing = false;
function toggleDrawMode() {
    if (isDrawing) {
        leafletMap.off("click", addMarker);
    } else {
        leafletMap.on("click", addMarker);
    }
    isDrawing = !isDrawing;
}

function addMarker(e) {
    L.marker(e.latlng).addTo(leafletMap);
}

// Initialize Cesium Viewer
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70';
const viewer = new Cesium.Viewer("cesiumContainer", {
    imageryProvider: new Cesium.IonImageryProvider({ assetId: 3954 }), // Satellite imagery
    baseLayerPicker: false
});

// Add custom terrain to Cesium
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: Cesium.IonResource.fromAssetId(2765075)
});

// Fly the camera to South Tyrol
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(11.362, 46.498, 4000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-30.0)
    }
});

// Optional: Add Cesium OSM Buildings
Cesium.createOsmBuildingsAsync().then((buildingTileset) => {
    viewer.scene.primitives.add(buildingTileset);
});
