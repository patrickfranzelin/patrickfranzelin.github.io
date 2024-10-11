// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

async function initializeViewer() {
  try {
    // Initialize the Cesium Viewer with custom options
    const viewer = new Cesium.Viewer("cesiumContainer", {
      baseLayerPicker: false,
      imageryProvider: false
    });

    // Load and set the custom terrain provider
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(2764800);
    viewer.terrainProvider = terrainProvider;

    // Load the custom imagery layers
    const imageryProvider1 = await Cesium.IonImageryProvider.fromAssetId(3954);
    viewer.imageryLayers.addImageryProvider(imageryProvider1);

    // Set the initial view to a specific area
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(11.362, 46.498, 15000),
      orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-30) }
    });

    let drawing = false;
    let routePositions = [];
    let polyline;

    window.startRouteDrawing = function () {
      drawing = true;
      routePositions = [];
      if (polyline) viewer.entities.remove(polyline);

      viewer.screenSpaceEventHandler.setInputAction(async (click) => {
        if (drawing) {
          const cartesian = viewer.scene.pickPosition(click.position);
          if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const terrainAdjustedPoint = await Cesium.sampleTerrainMostDetailed(terrainProvider, [cartographic]);
            const terrainPosition = Cesium.Cartesian3.fromRadians(
              terrainAdjustedPoint[0].longitude,
              terrainAdjustedPoint[0].latitude,
              terrainAdjustedPoint[0].height
            );
            routePositions.push(terrainPosition);
            updatePolyline();
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    function updatePolyline() {
      if (polyline) viewer.entities.remove(polyline);
      polyline = viewer.entities.add({
        polyline: {
          positions: routePositions,
          width: 5,
          material: Cesium.Color.BLUE,
          clampToGround: true
        }
      });
    }

    window.finishRoute = function () {
      drawing = false;
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      calculateDistanceAndElevation();
    };

    window.clearRoute = function () {
      routePositions = [];
      if (polyline) viewer.entities.remove(polyline);
      document.getElementById("distance").textContent = "0 km";
      document.getElementById("elevation").textContent = "0 m";
    };

    window.showRiskAreas = function () {
      const level = document.getElementById("avalanche-level").value;
      const wind = document.getElementById("wind-direction").value;
      alert(`Lawinenstufe: ${level}, Windrichtung: ${wind}`);
    };

    window.markDangerIntersections = function () {
      routePositions.forEach(position => {
        const danger = Math.random() > 0.5;  // Example danger detection
        if (danger) {
          viewer.entities.add({
            position: position,
            point: { pixelSize: 8, color: Cesium.Color.RED }
          });
        }
      });
    };

    function calculateDistanceAndElevation() {
      let totalDistance = 0;
      let totalElevationGain = 0;
      for (let i = 1; i < routePositions.length; i++) {
        const start = Cesium.Cartographic.fromCartesian(routePositions[i - 1]);
        const end = Cesium.Cartographic.fromCartesian(routePositions[i]);
        const geodesic = new Cesium.EllipsoidGeodesic(start, end);
        totalDistance += geodesic.surfaceDistance;
        const elevationDiff = end.height - start.height;
        if (elevationDiff > 0) totalElevationGain += elevationDiff;
      }
      document.getElementById("distance").textContent = (totalDistance / 1000).toFixed(2) + " km";
      document.getElementById("elevation").textContent = totalElevationGain.toFixed(0) + " m";
    }
  } catch (error) {
    console.error("An error occurred while initializing the Cesium viewer:", error);
  }
}

// Call the function to initialize the Cesium viewer
initializeViewer();
