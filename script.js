// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

async function initializeViewer() {
  try {
    // Initialize the Cesium Viewer with custom options
    const viewer = new Cesium.Viewer("cesiumContainer", {
      baseLayerPicker: true,       // Show base layer picker
      imageryProvider: false,      // Disable default imagery provider initially
    });

    // Load and set the custom terrain provider
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(2765075);
    viewer.terrainProvider = terrainProvider;

    // Load the custom imagery layer with a red tint
    const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(2764816);
    const imageryLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);

    // Apply a red color tint to the imagery layer
    imageryLayer.color = Cesium.Color.RED.withAlpha(0.5); // Adjust alpha as needed

    // Set the initial view to a specific area
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(11.362, 46.498, 15000),  // Adjust coordinates and altitude as needed
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-30),
      },
    });
  } catch (error) {
    console.error("An error occurred while initializing the Cesium viewer:", error);
  }
}

// Call the function to initialize the Cesium viewer
initializeViewer();
