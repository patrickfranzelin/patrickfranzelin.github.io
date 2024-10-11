// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

async function initializeViewer() {
  // Initialize the Cesium Viewer with Cesium World Terrain (3D)
  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: false,
  });

  // Load custom imagery layer
  try {
    const imageryLayer = await Cesium.IonImageryProvider.fromAssetId(2764816);
    const layer = viewer.imageryLayers.addImageryProvider(imageryLayer);
    viewer.zoomTo(layer);

    // Remove loading overlay once the layer has loaded
    document.getElementById("loadingOverlay").style.display = "none";
  } catch (error) {
    console.error("Error loading imagery layer:", error);
  }
}

// Call the function to initialize the Cesium viewer
initializeViewer();
