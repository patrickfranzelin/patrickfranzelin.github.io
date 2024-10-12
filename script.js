// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

async function initializeViewer() {
  try {
    const viewer = new Cesium.Viewer("cesiumContainer", {
      baseLayerPicker: false,
      imageryProvider: false
    });
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(2764800);
    viewer.terrainProvider = terrainProvider;

    const imageryProvider1 = await Cesium.IonImageryProvider.fromAssetId(3954);
    viewer.imageryLayers.addImageryProvider(imageryProvider1);

    const imageryProvider2 = await Cesium.IonImageryProvider.fromAssetId(2764816);
    viewer.imageryLayers.addImageryProvider(imageryProvider2);

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(11.362, 46.498, 15000),
      orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-30) }
    });

    let drawing = false;
    let routePositions = [];
    let polyline;
    let activeRiskLayer;

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

    const riskFileMapping = {
      "1": {
        "N": 2768822,
        "NE": 2768823,
        "E": 2768824,
        "SE": 2768825,
        "S": 2768826,
        "SW": 2768827,
        "W": 2768828,
        "NW": 2768829
      },
      "2": {
        "N": 2768823,
        "NE": 2768831,
        "E": 2768825,
        "SE": 2768833,
        "S": 2768834,
        "SW": 2768835,
        "W": 2768836,
        "NW": 2768824,
      },
      "3": {
        "N": 2768838,
        "NE": 2768839,
        "E": 2768825,
        "SE": 2768841,
        "S": 2768842,
        "SW": 2768843,
        "W": 2768844,
        "NW": 2768845
      }
    };

    window.showRiskAreas = async function () {
      const level = document.getElementById("avalanche-level").value;
      const wind = document.getElementById("wind-direction").value;

      const fileId = riskFileMapping[level][wind];
      if (!fileId) {
        alert("No data available for the selected level and direction.");
        return;
      }

      // Remove the current risk layer if it exists
      if (activeRiskLayer) {
        viewer.imageryLayers.remove(activeRiskLayer);
      }

      // Load the new imagery provider and add it to the viewer with a color shader
      const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(fileId);
      activeRiskLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);

      activeRiskLayer.alpha = 0.8;

      // Apply custom color ramp through a color shader material
      activeRiskLayer.material = new Cesium.Material({
        fabric: {
          type: 'ColorRamp',
          uniforms: {
            colors: [
              new Cesium.Color(1.0, 1.0, 0.0, 1.0),  // Yellow for low values
              new Cesium.Color(1.0, 0.5, 0.0, 1.0),  // Orange for medium-low values
              new Cesium.Color(1.0, 0.0, 0.0, 1.0),  // Red for high values
            ],
          },
          source: `
            uniform sampler2D image;
            czm_material czm_getMaterial(czm_materialInput materialInput) {
                czm_material material = czm_getDefaultMaterial(materialInput);
                vec2 st = materialInput.st;
                vec4 color = texture2D(image, st);

                // Apply a simple color ramp
                float intensity = color.r; // Assume single-band grayscale
                if (intensity < 0.4) {
                    material.diffuse = vec3(1.0, 1.0, 0.0); // Yellow
                } else if (intensity < 0.6) {
                    material.diffuse = vec3(1.0, 0.5, 0.0); // Orange
                } else {
                    material.diffuse = vec3(1.0, 0.0, 0.0); // Red
                }

                material.alpha = color.a * 0.8;
                return material;
            }
          `,
        },
      });

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(11.362, 46.498, 15000)
      });
    };

    window.markDangerIntersections = function () {
      routePositions.forEach(position => {
        const danger = Math.random() > 0.5;
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

initializeViewer();
