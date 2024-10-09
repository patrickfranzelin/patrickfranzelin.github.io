// script.js

// Set your Cesium Ion Access Token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70';

// Initialize the Cesium Viewer in the `cesiumContainer` element with world terrain
const viewer = new Cesium.Viewer("cesiumContainer", {
  imageryProvider: new Cesium.IonImageryProvider({ assetId: 3954 }), // Satellite imagery
  baseLayerPicker: false // Hide base layer picker
});

// Set custom terrain to South Tyrol terrain using your Ion Asset ID
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
  url: Cesium.IonResource.fromAssetId(2765075) // Replace with your South Tyrol terrain Asset ID
});

// Fly the camera to South Tyrol
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(11.362, 46.498, 4000), // Coordinates for South Tyrol
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-30.0)
  }
});

// Add Cesium OSM Buildings layer
Cesium.createOsmBuildingsAsync().then((buildingTileset) => {
  viewer.scene.primitives.add(buildingTileset);
});
