<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cesium Simple Test</title>
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
        // Set Cesium Ion access token
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxOThjMGZlYy1iMzg0LTQwZGMtYjkwOC1lYWYyNzk2YmU4YTkiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDkwMzR9.n-rdNmKW7KIrAFkCraPYXbIVcbs-A4ONQVkqh_OsCdU';

        // Initialize Cesium Viewer
        const viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: Cesium.createWorldTerrain(),
            baseLayerPicker: false,
            timeline: false,
            animation: false
        });

        // Load Terrain from Cesium Ion
        viewer.terrainProvider = Cesium.createWorldTerrain({
            url: Cesium.IonResource.fromAssetId(YOUR_TERRAIN_ASSET_ID) // Replace with your terrain asset ID
        });

        // Load Imagery Overlay (e.g., Avalanche Risk Areas)
        viewer.imageryLayers.addImageryProvider(
            new Cesium.IonImageryProvider({ assetId: YOUR_IMAGERY_ASSET_ID }) // Replace with your imagery asset ID
        );

        console.log("Cesium Ion access test completed.");
    </script>
</body>
</html>
