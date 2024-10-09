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
    
    <!-- Steuerungselemente -->
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
        <input type="file" id="file-input" accept=".geojson">
        <button onclick="toggleDrawMode()">Route einzeichnen</button>
    </div>

    <script>
        // Cesium Ion Token einrichten
        Cesium.Ion.defaultAccessToken = 'YOUR_CESIUM_ION_ACCESS_TOKEN';

        // Cesium Viewer initialisieren
        const viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: Cesium.createWorldTerrain(),
            imageryProvider: Cesium.createOpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/' 
            }),
            baseLayerPicker: false,
            timeline: false,
            animation: false
        });

        // DGM als 3D-Terrain hinzufügen
        const terrainTileset = new Cesium.Cesium3DTileset({
            url: Cesium.IonResource.fromAssetId(YOUR_DGM_ASSET_ID) 
        });
        viewer.scene.primitives.add(terrainTileset);

        // Funktion zum Anzeigen der Gefahrenbereiche basierend auf Lawinenstufe und Windrichtung
        function showRiskAreas() {
            const level = document.getElementById("avalanche-level").value;
            const wind = document.getElementById("wind-direction").value;
            console.log(`Lawinenstufe: ${level}, Windrichtung: ${wind}`);
            
            // Beispiel-Gefahrenbereich anzeigen (Position und Radius basierend auf Lawinenstufe)
            const center = Cesium.Cartesian3.fromDegrees(11.7, 46.6); // Zentrum der Gefahrenzone
            const radius = level * 1000; // Radius basierend auf der Lawinenstufe

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

        // Funktion zum Hochladen einer GeoJSON-Datei und Anzeige auf der Karte
        document.getElementById("file-input").addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        const dataSource = new Cesium.GeoJsonDataSource();
                        dataSource.load(data).then(() => {
                            viewer.dataSources.add(dataSource);
                            console.log("GeoJSON-Daten erfolgreich geladen.");
                        });
                    } catch (error) {
                        console.error("Fehler beim Parsen der Datei:", error);
                    }
                };
                reader.readAsText(file);
            }
        });

        // Modus zum Zeichnen von Routen ein- und ausschalten
        let isDrawing = false;
        function toggleDrawMode() {
            if (isDrawing) {
                viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                console.log("Zeichenmodus deaktiviert.");
            } else {
                viewer.screenSpaceEventHandler.setInputAction(function(event) {
                    const cartesian = viewer.camera.pickEllipsoid(event.position);
                    if (cartesian) {
                        const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
                        viewer.entities.add({
                            position: Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude),
                            point: { pixelSize: 10, color: Cesium.Color.BLUE }
                        });
                        console.log("Marker hinzugefügt bei:", cartographic);
                    }
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                console.log("Zeichenmodus aktiviert.");
            }
            isDrawing = !isDrawing;
        }
    </script>
</body>
</html>
