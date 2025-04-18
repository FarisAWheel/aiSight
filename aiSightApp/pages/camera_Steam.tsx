import React from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useState, useEffect } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { loadModel, runModel } from '../utils/onnxModel';
import { captureRef } from 'react-native-view-shot';

// Import the types locally since we'll use the implementations from onnxModel.ts
type Tensor = {
  data: Float32Array;
  dims: number[];
  type: string;
};

const CameraPage = () => {
  /** MJPEG endpoint exposed by the ESP32 soft‑AP */
  const cameraViewStream = 'http://192.168.4.1/stream';

  // Added ref to control WebView and view for capture
  const webviewRef = useRef<WebView>(null);
  const captureViewRef = useRef<View>(null);
  
  // Add state for detection
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<any[]>([]);
  const [modelSession, setModelSession] = useState<any>(null);

  // Load model on component mount
  useEffect(() => {
    const initModel = async () => {
      try {
        const session = await loadModel();
        setModelSession(session);
        console.log("Model initialized successfully");
      } catch (error) {
        console.error("Failed to initialize model:", error);
        Alert.alert("Error", "Failed to initialize the detection model. Please restart the app.");
      }
    };
    initModel();
  }, []);

  // Function to capture a screenshot and run detection
  const captureAndDetect = async () => {
    if (!captureViewRef.current || isProcessing) return;
    if (!modelSession) {
      Alert.alert("Error", "Model is not ready yet. Please wait a moment and try again.");
      return;
    }
    
    try {
      setIsProcessing(true);
      console.log("Starting capture process...");
      
      // Take screenshot of the view containing the WebView
      const uri = await captureRef(captureViewRef, {
        format: 'jpg',
        quality: 0.8,
        result: 'tmpfile',
      }).catch(error => {
        console.error("Screenshot capture failed:", error);
        throw new Error("Failed to capture image");
      });
      
      console.log("Screenshot captured at:", uri);
      
      // Validate the captured file exists
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists || fileInfo.size === 0) {
        throw new Error("Captured image file is invalid or empty");
      }
      
      // Resize the image for YOLO model
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 640, height: 640 } }],
        { format: ImageManipulator.SaveFormat.JPEG, compress: 0.9 }
      ).catch(error => {
        console.error("Image resizing failed:", error);
        throw new Error("Failed to resize image");
      });
      
      console.log("Image resized successfully");
      
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      }).catch(error => {
        console.error("Base64 conversion failed:", error);
        throw new Error("Failed to convert image to base64");
      });
      
      if (!base64) {
        throw new Error("Base64 conversion resulted in empty string");
      }
      
      console.log("Image converted to base64, length:", base64.length);
      
      // Convert base64 to tensor and run model
      const imageTensor = await imageToTensor(base64, 640, 640);
      console.log("Image converted to tensor, dims:", imageTensor.dims);
      
      // Run the model on the image tensor
      const results = await runModel(modelSession, imageTensor);
      console.log("Detection complete, found", results.length, "objects");
      
      // Set detection results
      setDetectionResults(results);
    } catch (error: any) {
      console.error("Error during capture and detection:", error);
      Alert.alert("Error", error.message || "Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Helper function to convert image to tensor
  const imageToTensor = async (base64Image: string, width: number, height: number): Promise<Tensor> => {
    try {
      console.log("Starting tensor conversion...");
      
      // Convert base64 to Uint8Array
      const binaryString = atob(base64Image);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      console.log("Binary data created, length:", bytes.length);
      
      // Use jpeg-js to decode the JPEG image
      const jpeg = require('jpeg-js');
      const rawImageData = jpeg.decode(bytes, { useTArray: true });
      
      if (!rawImageData || !rawImageData.data) {
        throw new Error("Failed to decode JPEG image");
      }
      
      console.log("JPEG decoded successfully");
      
      // Prepare the tensor data with normalization (0-1)
      const tensor = new Float32Array(1 * 3 * height * width);
      const stride = height * width;
      
      // Convert RGB to tensor format with normalization
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixelIndex = (y * width + x) * 4; // RGBA
          
          // Normalize to 0-1 range and convert to RGB order
          tensor[y * width + x] = rawImageData.data[pixelIndex] / 255.0; // R
          tensor[stride + y * width + x] = rawImageData.data[pixelIndex + 1] / 255.0; // G
          tensor[2 * stride + y * width + x] = rawImageData.data[pixelIndex + 2] / 255.0; // B
        }
      }
      
      console.log("Tensor conversion complete");
      
      // Create and return the tensor
      return {
        data: tensor,
        dims: [1, 3, height, width],
        type: 'float32',
      };
    } catch (error) {
      console.error("Error in imageToTensor:", error);
      throw new Error("Failed to convert image to tensor format");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Camera Stream</Text>

      {/* Wrap WebView in a View with ref for capturing */}
      <View ref={captureViewRef} collapsable={false} style={styles.captureContainer}>
        <WebView
          ref={webviewRef}
          source={{ uri: cameraViewStream }}
          originWhitelist={['*']}
          mixedContentMode="always"
          allowsInlineMediaPlayback
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          scalesPageToFit
          style={styles.stream}
        />
      </View>

      {/* Refresh button */}
      <TouchableOpacity style={styles.button} onPress={() => webviewRef.current?.reload()}>
        <Text style={styles.buttonText}>Refresh Stream</Text>
      </TouchableOpacity>

      {/* Detect button */}
      <TouchableOpacity 
        style={[styles.button, styles.detectButton, isProcessing && styles.buttonDisabled]} 
        onPress={captureAndDetect}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Detect Objects</Text>
        )}
      </TouchableOpacity>
      
      {/* Results summary */}
      {detectionResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsHeader}>Detection Results:</Text>
          {detectionResults.slice(0, 5).map((detection, index) => (
            <Text key={index} style={styles.resultItem}>
              {detection.className}: {(detection.confidence * 100).toFixed(1)}%
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10 
  },
  headerText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  captureContainer: {
    width: Dimensions.get('window').width - 20,
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  stream: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  button: {
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  detectButton: {
    backgroundColor: '#34C759',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultItem: {
    fontSize: 14,
    marginBottom: 4,
  }
});

export default CameraPage;
