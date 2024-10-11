// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZjQ2MzU4Zi1kMWQ0LTQ0MTUtODU0OS0zZTI1NjhiN2FmZDMiLCJpZCI6MjQ2OTE4LCJpYXQiOjE3Mjg1MDk4NzN9.DbWm6ADaeMLM-K8qIISh9vi6QlU281OA30AQ6_mDs70";

// Initialize Cesium Viewer in the cesiumContainer
const viewer = new Cesium.Viewer("cesiumContainer", {
    baseLayerPicker: false, // Hide base layer picker
});

// Function to load custom imagery layer
async function loadImageryLayer() {
    try {
        const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(2764816);
        const imageryLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);
        viewer.zoomTo(imageryLayer);
    } catch (error) {
        console.error("Error loading imagery layer:", error);
    }
}

// Load custom imagery
loadImageryLayer();
