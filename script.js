// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

async function initializeViewer() {
  try {
    // Initialize the Cesium Viewer with custom options
    const viewer = new Cesium.Viewer("cesiumContainer", {
      baseLayerPicker: false,
      imageryProvider: false  // Disable default imagery provider
    });

    // Load and set the custom terrain provider
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(2764800);
    viewer.terrainProvider = terrainProvider;

    // Load custom imagery layers
    const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3954);
    viewer.imageryLayers.addImageryProvider(imageryProvider);

    const imageryProvider2 = await Cesium.IonImageryProvider.fromAssetId(2764816);
    viewer.imageryLayers.addImageryProvider(imageryProvider2);

    // Set the initial view to a specific area
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(11.362, 46.498, 15000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-30)
      }
    });
  } catch (error) {
    console.error("An error occurred while initializing the Cesium viewer:", error);
  }
}

// Route upload and draw mode functions
function uploadRoute() {
  const fileInput = document.getElementById("file-input");
  fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        const geojsonDataSource = new Cesium.GeoJsonDataSource();
        geojsonDataSource.load(data).then(function(dataSource) {
          viewer.dataSources.add(dataSource);
          viewer.flyTo(dataSource);
        });
      };
      reader.readAsText(file);
    }
  });
}

let isDrawing = false;
function toggleDrawMode() {
  if (isDrawing) {
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    console.log("Zeichenmodus deaktiviert");
  } else {
    viewer.screenSpaceEventHandler.setInputAction(function(event) {
      const cartesian = viewer.camera.pickEllipsoid(event.position);
      if (cartesian) {
        viewer.entities.add({
          position: cartesian,
          point: { pixelSize: 10, color: Cesium.Color.RED }
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    console.log("Zeichenmodus aktiviert");
  }
  isDrawing = !isDrawing;
}

// Call the function to initialize the Cesium viewer
initializeViewer();
