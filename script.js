Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

try {
  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider:
      await Cesium.CesiumTerrainProvider.fromIonAssetId(2764800),
  });
} catch (error) {
  console.log(error);
}
