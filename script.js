// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";


async function initializeViewer() {
  try {
    const viewer = new Cesium.Viewer("cesiumContainer", {
      baseLayerPicker: false,
      imageryProvider: false
    });

    // Load and set the custom terrain provider
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(2764800);
    viewer.terrainProvider = terrainProvider;

    // Load custom imagery layers
    const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3954);
    viewer.imageryLayers.addImageryProvider(imageryProvider);
    const imageryProvider2 = await Cesium.IonImageryProvider.fromAssetId(2764816);
    viewer.imageryLayers.addImageryProvider(imageryProvider2);

    // Initial view
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(11.362, 46.498, 15000),
      orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-30) }
    });

    // Route-drawing
    let routePositions = [];
    let routeEntity = null;

    window.startRouteDrawing = function() {
      viewer.screenSpaceEventHandler.setInputAction((click) => {
        const cartesian = viewer.scene.pickPosition(click.position);
        if (cartesian) {
          routePositions.push(cartesian);
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
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    window.showRiskAreas = function() {
      const level = document.getElementById("avalanche-level").value;
      const wind = document.getElementById("wind-direction").value;
      alert(`Gefahrenstufe: ${level}, Windrichtung: ${wind}`);
    };

    window.clearRoute = function() {
      routePositions = [];
      if (routeEntity) {
        viewer.entities.remove(routeEntity);
        routeEntity = null;
      }
    };

    window.finishRoute = function() {
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

  } catch (error) {
    console.error("An error occurred while initializing Cesium viewer:", error);
  }
}

// Initialize the Cesium viewer
initializeViewer();
