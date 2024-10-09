// Set your Cesium Ion Access Token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70';

// Initialize the Cesium Viewer in the HTML element with `cesiumContainer` and set OpenStreetMap as base imagery
const viewer = new Cesium.Viewer("cesiumContainer", {
  imageryProvider: Cesium.createOpenStreetMapImageryProvider({
    url: 'https://a.tile.openstreetmap.org/'
  }),
  baseLayerPicker: false // Hide base layer picker
});

// Add custom terrain for South Tyrol
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
  url: Cesium.IonResource.fromAssetId(2765075) // Replace with your DTM asset ID
});

// Add "Gefahrenbereiche" layer
Cesium.IonImageryProvider.fromAssetId(2764816).then((imageryProvider) => {
  viewer.imageryLayers.addImageryProvider(imageryProvider);
});

// Function to show risk areas
function showRiskAreas() {
  const level = document.getElementById("avalanche-level").value;
  const wind = document.getElementById("wind-direction").value;
  alert(`Lawinenstufe: ${level}, Windrichtung: ${wind}`);
  
  // Add a circle to represent the risk area
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(11.7, 46.6),
    ellipse: {
      semiMinorAxis: level * 1000, // Adjust radius based on level
      semiMajorAxis: level * 1000,
      material: Cesium.Color.RED.withAlpha(0.5)
    }
  });
}

// Handle file upload for GeoJSON data
document.getElementById("file-input").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const geojson = JSON.parse(e.target.result);
      Cesium.GeoJsonDataSource.load(geojson).then((dataSource) => {
        viewer.dataSources.add(dataSource);
        viewer.flyTo(dataSource);
      });
    };
    reader.readAsText(file);
  }
});

// Toggle drawing mode to add markers
let isDrawing = false;
function toggleDrawMode() {
  if (isDrawing) {
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  } else {
    viewer.screenSpaceEventHandler.setInputAction((click) => {
      const cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
      if (cartesian) {
        viewer.entities.add({
          position: cartesian,
          point: {
            pixelSize: 10,
            color: Cesium.Color.BLUE
          }
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  isDrawing = !isDrawing;
}

// Fly the camera to South Tyrol
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(11.7, 46.6, 4000),
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-30.0)
  }
});
