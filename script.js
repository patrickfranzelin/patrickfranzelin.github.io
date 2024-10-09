<div id="cesiumContainer" style="width: 100%; height: 100vh;"></div>
<script src="https://cdn.jsdelivr.net/npm/cesium@1.122.0/Build/Cesium/Cesium.js"></script>
<script>
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70';

    const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: new Cesium.CesiumTerrainProvider({
            url: Cesium.IonResource.fromAssetId(2764800)
        })
    });

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(11.7, 46.6, 200),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-30.0),
        }
    });

    console.log("DTM Loaded? Check for errors in the console.");
</script>
