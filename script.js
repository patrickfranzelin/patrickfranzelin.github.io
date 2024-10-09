Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70';

// Initialize the Cesium Viewer with no initial imagery provider
const viewer = new Cesium.Viewer("cesiumContainer", {
  imageryProvider: false, // Start with no imagery provider
  baseLayerPicker: false // Hide base layer picker
});

// Load your custom imagery layer from Cesium Ion (Asset ID: 3954)
async function loadCustomImagery() {
  const layer = await Cesium.IonImageryProvider.fromAssetId(3954);
  viewer.imageryLayers.addImageryProvider(layer);
}

// Call the function to load the custom imagery
loadCustomImagery();

// Set custom terrain to South Tyrol terrain using your Ion Asset ID
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
  url: Cesium.IonResource.fromAssetId(2765075) // Replace with your DTM asset ID
});

// Fly the camera to South Tyrol
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(11.7, 46.6, 4000), // Coordinates for South Tyrol
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-30.0)
  }
});
