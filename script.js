// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

async function initializeViewer() {
  const viewer = new Cesium.Viewer("cesiumContainer", {
    baseLayerPicker: false,
    imageryProvider: false,
  });

  // Load terrain
  const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(2764800);
  viewer.terrainProvider = terrainProvider;

  // Add default imagery
  const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3954);
  viewer.imageryLayers.addImageryProvider(imageryProvider);

  let drawing = false;
  let routePositions = [];
  let polyline;

  // Start drawing route
  function startRouteDrawing() {
    drawing = true;
    routePositions = [];
    if (polyline) {
      viewer.entities.remove(polyline);
    }

    viewer.screenSpaceEventHandler.setInputAction((click) => {
      if (drawing) {
        const cartesian = viewer.scene.pickPosition(click.position);
        if (cartesian) {
          routePositions.push(cartesian);
          updatePolyline();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  // Update polyline for route drawing
  function updatePolyline() {
    if (polyline) {
      viewer.entities.remove(polyline);
    }

    polyline = viewer.entities.add({
      polyline: {
        positions: routePositions,
        width: 5,
        material: Cesium.Color.BLUE,
      },
    });
  }

  // Finish drawing route
  function finishRoute() {
    drawing = false;
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    calculateDistanceAndElevation();
  }

  // Clear route
  function clearRoute() {
    routePositions = [];
    if (polyline) {
      viewer.entities.remove(polyline);
    }
    document.getElementById("distance").textContent = "0 km";
    document.getElementById("elevation").textContent = "0 m";
  }

  // Show risk areas based on selected avalanche level and wind direction
  function showRiskAreas() {
    const level = document.getElementById("avalanche-level").value;
    const wind = document.getElementById("wind-direction").value;
    alert(`Lawinenstufe: ${level}, Windrichtung: ${wind}`);
    // Add your logic to display risk areas on the map
  }

  // Calculate total distance and elevation gain of the route
  function calculateDistanceAndElevation() {
    let totalDistance = 0;
    let totalElevationGain = 0;

    for (let i = 1; i < routePositions.length; i++) {
      const start = Cesium.Cartographic.fromCartesian(routePositions[i - 1]);
      const end = Cesium.Cartographic.fromCartesian(routePositions[i]);

      const geodesic = new Cesium.EllipsoidGeodesic(start, end);
      totalDistance += geodesic.surfaceDistance;

      const elevationDiff = end.height - start.height;
      if (elevationDiff > 0) {
        totalElevationGain += elevationDiff;
      }
    }

    document.getElementById("distance").textContent = (totalDistance / 1000).toFixed(2) + " km";
    document.getElementById("elevation").textContent = totalElevationGain.toFixed(0) + " m";
  }

  // Expose functions to global scope
  window.startRouteDrawing = startRouteDrawing;
  window.finishRoute = finishRoute;
  window.clearRoute = clearRoute;
  window.showRiskAreas = showRiskAreas;
}

// Call the initialize function
initializeViewer();
