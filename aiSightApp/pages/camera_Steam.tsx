import React from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

// Added imports
import { useRef } from 'react';
import { TouchableOpacity } from 'react-native';

const CameraPage = () => {
  /** MJPEG endpoint exposed by the ESP32 soft‑AP */
  const cameraViewStream = 'http://192.168.4.1/stream';

  // Added ref to control WebView
  const webviewRef = useRef<WebView | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Camera Stream</Text>

      <WebView
        // Added ref prop for reload capability
        ref={webviewRef}
        source={{ uri: cameraViewStream }}

        /** Allow “insecure” (HTTP) content inside an HTTPS app shell */
        originWhitelist={['*']}
        mixedContentMode="always"                 // Android
        allowsInlineMediaPlayback                 // iOS autoplay

        /** Stability tweaks */
        javaScriptEnabled                        // not strictly needed for MJPEG
        domStorageEnabled
        startInLoadingState
        scalesPageToFit

        /** Some GPUs crash on MJPEG unless HW accel is off */
        // androidHardwareAccelerationDisabled={Platform.OS === 'android'}

        style={styles.stream}
      />

      {/* Added refresh button */}
      <TouchableOpacity style={styles.button} onPress={() => webviewRef.current?.reload()}>
        <Text style={styles.buttonText}>Refresh Stream</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  headerText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  stream: {
    width: Dimensions.get('window').width - 20,
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  // Added styles for button
  button: {
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraPage;
