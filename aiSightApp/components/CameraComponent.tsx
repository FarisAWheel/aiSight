import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { loadModel, runModel } from '../utils/onnxModel';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';

export default function CameraComponent() {
    const [hasPermission, setHasPermission] = useState(null);
    const [model, setModel] = useState<InferenceSession | null>(null);
    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            const loadedModel = await loadModel();
            setModel(loadedModel);
        })();
    }, []);

    const handleCameraStream = async (imageData: any) => {
        if (model && cameraRef.current) {
            const imageTensor = new Tensor('float32', imageData, [1, 3, 640, 640]); // Adjust dimensions as needed
            const results = await runModel(model, imageTensor);
            console.log(results);
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                ref={cameraRef}
                onCameraReady={handleCameraStream}
            />
            <View style={styles.overlay}>
                <Text>Predictions will be displayed here</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
    },
});