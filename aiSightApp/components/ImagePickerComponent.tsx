import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { loadModel, runModel } from '../utils/onnxModel';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';

export default function ImagePickerComponent() {
    const [image, setImage] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [model, setModel] = useState<InferenceSession | null>(null);

    useEffect(() => {
        (async () => {
            // Load the model
            const loadedModel = await loadModel();
            setModel(loadedModel);
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
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
        if (model) {
            const response = await fetch(uri);
            const blob = await response.blob();
            const imageData = await blob.arrayBuffer();
            const imageTensor = new Tensor('float32', new Float32Array(imageData), [1, 3, 640, 640]); // Adjust dimensions as needed
            const results = await runModel(model, imageTensor);
            setPredictions(Object.values(results));
            console.log(results);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <View style={styles.overlay}>
                {predictions.map((prediction, index) => (
                    <Text key={index} style={styles.predictionText}>
                        {prediction.label}: {prediction.confidence.toFixed(2)}
                    </Text>
                ))}
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