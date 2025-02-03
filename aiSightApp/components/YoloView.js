import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Camera, CameraType } from "expo-camera"; // import Camera and CameraType
import { loadYOLOModel, runYOLOInference } from "./utils/YoloProcessor";
import BoundingBoxOverlay from "./BoundingBoxOverlay";
import { preprocessImage } from "./utils/preprocessImage";

const CameraView = () => {
  const cameraRef = useRef(null); // Correctly typing the ref
  const [model, setModel] = useState(null);
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    (async () => {
      const loadedModel = await loadYOLOModel();
      setModel(loadedModel);
    })();
  }, []);

  const captureFrame = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      const imageData = preprocessImage(photo);
      const results = await runYOLOInference(model, imageData);
      setBoxes(results && results.boxes ? results.boxes : []);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.back} // Use the CameraType enum if you want to specify front or back camera
        onCameraReady={captureFrame}
      />
      <BoundingBoxOverlay boxes={boxes} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 }
});

export default YoloView;
