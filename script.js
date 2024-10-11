// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

async function initializeViewer() {
  try {
    const viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: await Cesium.createWorldTerrain(),
      baseLayerPicker: false,
    });
    
    // Additional viewer settings if necessary
    viewer.scene.globe.depthTestAgainstTerrain = true;
  } catch (error) {
    console.error("Error initializing Cesium viewer:", error);
  }
}

// Call the function to initialize the Cesium viewer
initializeViewer();
