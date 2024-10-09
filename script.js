<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cesium South Tyrol Viewer</title>
  <script src="https://cdn.jsdelivr.net/npm/cesium@1.122.0/Build/Cesium/Cesium.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/cesium@1.122.0/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
  <style>
      #cesiumContainer {
          width: 100%;
          height: 100vh;
          margin: 0;
          padding: 0;
      }
  </style>
</head>
<body>
  <div id="cesiumContainer"></div>
  <script>
    // Set your Cesium Ion Access Token
    Cesium.Ion.defaultAccessToken = 'YOUR_CESIUM_ACCESS_TOKEN';

    // Initialize the Cesium Viewer in the `cesiumContainer` element with world terrain
    const viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.IonImageryProvider({ assetId: 3954 }), // Satellite imagery
      baseLayerPicker: false // Hide base layer picker
    });

    // Set custom terrain to South Tyrol terrain using your Ion Asset ID
    viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
      url: Cesium.IonResource.fromAssetId(2765075) // Replace with your South Tyrol terrain Asset ID
    });

    // Fly the camera to South Tyrol
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(11.362, 46.498, 4000), // Coordinates for South Tyrol
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-30.0)
      }
    });

    // Add Cesium OSM Buildings layer
    Cesium.createOsmBuildingsAsync().then((buildingTileset) => {
      viewer.scene.primitives.add(buildingTileset);
    });
  </script>
</body>
</html>
