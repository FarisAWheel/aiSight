import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { loadModel, runModel } from '../utils/onnxModel';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';


export default function ImagePickerComponent() {
    const [image, setImage] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [model, setModel] = useState<InferenceSession | null>(null);

    // Loads the model
    useEffect(() => {
        (async () => {
            console.log("Loading model...");
            const loadedModel = await loadModel();
            setModel(loadedModel);
            console.log("Model loaded successfully");
        })();
    }, []);

    // Handles images picking, then calls processImage to eventually run inf
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            if (result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                setImage(uri);
                processImage(uri);
            }
        }
    };

    const processImage = async (uri: string) => {
        console.log("Processing image:", uri);
        if (model) {
            console.log("Model is loaded, running inference...");

            try {
                const canvas = new Canvas();
                canvas.width = 640;
                canvas.height = 640;

                const ctx = canvas.getContext('2d');
                const img = new CanvasImage(canvas);
                img.src = uri;

                img.addEventListener('load', async () => {
                    ctx.drawImage(img, 0, 0, 640, 640);

                    const imageData = ctx.getImageData(0, 0, 640, 640);
                    const { data } = imageData;
                    const floatData = new Float32Array(640 * 640 * 3);

                    // Convert RGBA to RGB and normalize
                    let j = 0;
                    for (let i = 0; i < data.length; i += 4) {
                        floatData[j++] = data[i] / 255.0;     // R
                        floatData[j++] = data[i + 1] / 255.0; // G
                        floatData[j++] = data[i + 2] / 255.0; // B
                    }

                    const imageTensor = new Tensor('float32', floatData, [1, 3, 640, 640]);
                    console.log("Image tensor created:", imageTensor);

                    // Run inference
                    const results = await runModel(model, imageTensor);
                    console.log("Inference results:", results);

                    setPredictions(Object.values(results));
                });
            } catch (error) {
                console.error("Error processing image:", error);
            }
        } else {
            console.log("Model is not loaded");
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <View style={styles.overlay}>
                {predictions.length > 0 ? (
                    predictions.map((prediction, index) => (
                        <Text key={index} style={styles.predictionText}>
                            {prediction.label}: {prediction.confidence.toFixed(2)}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.predictionText}>No predictions</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
    },
    predictionText: {
        color: 'white',
        fontSize: 16,
    },
});