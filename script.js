// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

async function initializeViewer() {
  // Initialize the Cesium Viewer in 2D mode
  const viewer = new Cesium.Viewer("cesiumContainer", {
    sceneMode: Cesium.SceneMode.SCENE2D, // Set to 2D
    baseLayerPicker: false,
  });

  // Hide the loading overlay after initialization
  document.getElementById("loadingOverlay").style.display = "none";
  
  // Load custom imagery layer
  try {
    const imageryLayer = await Cesium.IonImageryProvider.fromAssetId(2764816);
    viewer.imageryLayers.addImageryProvider(imageryLayer);
    viewer.zoomTo(viewer.imageryLayers); // Zoom to imagery layer
  } catch (error) {
    console.error("Error loading imagery layer:", error);
  }
}

// Call the function to initialize the Cesium viewer
initializeViewer();
