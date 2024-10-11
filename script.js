// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

// Initialize the viewer and load terrain
async function initializeViewer() {
  try {
    // Create the Cesium Viewer and load custom terrain
    const viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(1), // Use the Cesium World Terrain
      baseLayerPicker: false // Hide base layer picker if you only want custom layers
    });

    // Optional: Fly to a specific location to verify 3D terrain
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(11.362, 46.498, 3000), // South Tyrol area
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-30.0)
      }
    });
    
  } catch (error) {
    console.error("Error initializing Cesium viewer:", error);
  }
}

// Call the async function to initialize the viewer
initializeViewer();
