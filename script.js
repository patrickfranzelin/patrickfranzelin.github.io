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

    // Load the custom imagery layer
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

    // Route-drawing setup
    let routePositions = [];
    let routeEntity = null;

    function addRoutePoint(click) {
      const cartesian = viewer.scene.pickPosition(click.position);
      if (cartesian) {
        routePositions.push(cartesian);

        // Update or create the polyline
        if (routeEntity) {
          routeEntity.polyline.positions = new Cesium.CallbackProperty(() => routePositions, false);
        } else {
          routeEntity = viewer.entities.add({
            polyline: {
              positions: new Cesium.CallbackProperty(() => routePositions, false),
              width: 4,
              material: Cesium.Color.RED,
            },
          });
        }
      }
    }

    // Enable route drawing on map click
    viewer.screenSpaceEventHandler.setInputAction(addRoutePoint, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Clear the route
    window.clearRoute = function() {
      routePositions = [];
      if (routeEntity) {
        viewer.entities.remove(routeEntity);
        routeEntity = null;
      }
    };

    // Finish the route (disable further editing)
    window.finishRoute = function() {
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

  } catch (error) {
    console.error("An error occurred while initializing Cesium viewer:", error);
  }
}

// Call the function to initialize the Cesium viewer
initializeViewer();
