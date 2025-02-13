import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { loadModel, runModel } from '../utils/onnxModel';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import jpeg from 'jpeg-js';
import * as ImageManipulator from 'expo-image-manipulator';
global.Buffer = require('buffer').Buffer;

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

                // Resize the image to 640x640 using expo-image-manipulator
                console.log("Resizing image...");
                const manipResult = await ImageManipulator.manipulateAsync(
                    uri,
                    [{ resize: { width: 640, height: 640 } }],
                    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                );
                const resizedUri = manipResult.uri;

                // Fetch image as an ArrayBuffer
                console.log("Fetching image from URI...");
                const response = await fetch(resizedUri);
                const arrayBuffer = await response.arrayBuffer();
                console.log("Image fetched successfully");

                // Decode JPEG to RGBA using jpeg-js
                console.log("Decoding JPEG image...");
                const rawImageData = jpeg.decode(Buffer.from(arrayBuffer), { useTArray: true });
                const { data, width, height } = rawImageData;
                console.log("Image decoded successfully");

                // Convert RGBA to RGB and normalize
                console.log("Converting RGBA to RGB and normalizing...");
                const floatData = new Float32Array(width * height * 3);
                let j = 0;
                for (let i = 0; i < data.length; i += 4) {
                    floatData[j++] = data[i] / 255.0;     // R
                    floatData[j++] = data[i + 1] / 255.0; // G
                    floatData[j++] = data[i + 2] / 255.0; // B
                }
                console.log("Conversion and normalization done");

                const imageTensor = new Tensor('float32', floatData, [1, 3, height, width]);

                // Run inference
                console.log("Running model inference...");
                const results = await runModel(model, imageTensor);


                setPredictions(Object.values(results));

                console.log("Inference done");
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