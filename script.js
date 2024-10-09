<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cesium Test</title>
  <script src="https://cesium.com/downloads/cesiumjs/releases/latest/Build/Cesium/Cesium.js"></script>
  <link href="https://cesium.com/downloads/cesiumjs/releases/latest/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
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
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZTUyYWNmYy0wYmMxLTQzZjItYWYwNC01YzJkZDMwMDk1ZTciLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg0ODA1MDh9.NR2eMLQ5vscVQBOTsjYkhnaPikwPAmVPLCgMwQLadY4';

    // Initialize Cesium Viewer
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    });

    // Test fly-to location in San Francisco to confirm viewer setup
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400)
    });
  </script>
</body>
</html>
