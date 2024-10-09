<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Karte mit CesiumJS</title>
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
    
    <!-- Control Elements -->
    <div>
        <label for="avalanche-level">Lawinenstufe:</label>
        <select id="avalanche-level">
            <option value="1">1 - Gering</option>
            <option value="2">2 - Mäßig</option>
            <option value="3">3 - Erheblich</option>
            <option value="4">4 - Groß</option>
            <option value="5">5 - Sehr Groß</option>
        </select>

        <label for="wind-direction">Windrichtung:</label>
        <select id="wind-direction">
            <option value="N">N</option>
            <option value="NE">NE</option>
            <option value="E">E</option>
            <option value="SE">SE</option>
            <option value="S">S</option>
            <option value="SW">SW</option>
            <option value="W">W</option>
            <option value="NW">NW</option>
        </select>
        <button onclick="showRiskAreas()">Gefahrenbereiche anzeigen</button>
    </div>

    <script>
        // Set Cesium Ion access token
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxOThjMGZlYy1iMzg0LTQwZGMtYjkwOC1lYWYyNzk2YmU4YTkiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDkwMzR9.n-rdNmKW7KIrAFkCraPYXbIVcbs-A4ONQVkqh_OsCdU';

        // Initialize the Cesium Viewer with default settings
        const viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: Cesium.createWorldTerrain(),
            imageryProvider: Cesium.createOpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
            }),
            baseLayerPicker: false,
            timeline: false,
            animation: false
        });

        // Load your DGM terrain from Cesium Ion
        viewer.terrainProvider = Cesium.createWorldTerrain({
            url: Cesium.IonResource.fromAssetId(2764800)
        });

        // Load the hazard map imagery layer
        viewer.imageryLayers.addImageryProvider(
            new Cesium.IonImageryProvider({ assetId: 2764816 })
        );

        // Function to show risk areas based on avalanche level and wind direction
        function showRiskAreas() {
            const level = document.getElementById("avalanche-level").value;
            const wind = document.getElementById("wind-direction").value;
            console.log(`Lawinenstufe: ${level}, Windrichtung: ${wind}`);
            
            // Example of displaying a risk area (position and radius based on avalanche level)
            const center = Cesium.Cartesian3.fromDegrees(11.7, 46.6); // Center of the hazard zone
            const radius = level * 1000; // Radius based on avalanche level

            viewer.entities.add({
                position: center,
                ellipse: {
                    semiMinorAxis: radius,
                    semiMajorAxis: radius,
                    material: Cesium.Color.RED.withAlpha(0.5),
                    outline: true,
                    outlineColor: Cesium.Color.RED
                }
            });
        }
    </script>
</body>
</html>
