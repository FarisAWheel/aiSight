import React, { useEffect, useState } from "react";
import GradientBackground from "../components/GradientBackground";
import LeftBackArrowButton from "../components/LeftBackArrowButton";
import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import useBLE from "../hooks/useBLE";
import connectToWifi from "../hooks/connectToWifi";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import { Device } from "react-native-ble-plx";

const BluetoothPage = ({ navigation }: { navigation: any }) => {
  const {
    requestPermissions,
    scanForPeripherals,
    stopScan,
    allDevices,
    connectToDevice,
    connectedDevice,
    retrieveWebserverCredentials,
    bleManager,
    disconnectDevice,
  } = useBLE();

  const [credentials, setCredentials] = useState<{ssid: string; password: string } | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWifiConnecting, setIsWifiConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  useEffect(() => {
    // Only scan if we're not connected AND not in the process of connecting
    if(!connectedDevice && !isConnecting && !isWifiConnecting) {
      const setupBluetooth = async () => {
        const permissionsGranted = await requestPermissions();
        if (!permissionsGranted) {
          console.error("Permissions not granted");
          return;
        }
        
        const subscription = bleManager.onStateChange((state) => {
          if (state === "PoweredOn") {
            console.log("BLE state: PoweredOn - starting scan");
            scanForPeripherals();
            subscription.remove();
          } else {
            console.warn("BLE state:", state);
          }
        }, true);
      };

      setupBluetooth();
    }
    else if (connectedDevice && !isWifiConnecting) {
      const getCredentials = async () => {
        try {
          let retrievedCredentials = await retrieveWebserverCredentials();
          setCredentials(retrievedCredentials);
          console.log("SSID:", retrievedCredentials.ssid);
          console.log("Password:", retrievedCredentials.password);
          return retrievedCredentials;
        } catch (e) {
          console.error("Failed to get credentials", e);
          return null;
        }
      };

      const connectWiFi = async () => {
        try {
          // Set flag to prevent rescanning
          setIsWifiConnecting(true);
          setConnectionStatus("Retrieving WiFi credentials...");
          
          let credentials = await getCredentials();
          
          if(credentials) {
            setConnectionStatus("Got credentials, disconnecting Bluetooth...");
            console.log("Disconnecting Bluetooth to let ESP32 start WiFi AP");
            
            // 1. Disconnect Bluetooth FIRST to let ESP32 start its WiFi AP
            disconnectDevice();
            
            // 2. Wait for ESP32 to set up its WiFi access point
            setConnectionStatus("Waiting for device to start WiFi...");
            
            setTimeout(async () => {
              setConnectionStatus("Connecting to WiFi network...");
              try {
                // 3. Now connect to the WiFi network
                console.log(`Attempting to connect to WiFi network: ${credentials.ssid}`);
                
                // Modified to handle the result of connectToWifi
                try {
                  // Call connectToWifi and wait for result
                  await connectToWifi(credentials.ssid, credentials.password);
                  
                  // After 3 seconds, check if we're connected to the right network
                  setTimeout(async () => {
                    try {
                      // Import this at the top of your file
                      const WifiManager = require("react-native-wifi-reborn").default;
                      const currentSsid = await WifiManager.getCurrentWifiSSID();
                      
                      console.log(`Currently connected to: ${currentSsid}`);
                      if (currentSsid === credentials.ssid) {
                        console.log("✅ WiFi connection SUCCESSFUL!");
                        setConnectionStatus("WiFi connected successfully!");
                      } else {
                        console.log(`❌ Connected to wrong network: ${currentSsid}`);
                        setConnectionStatus(`Connected to different network: ${currentSsid}`);
                      }
                    } catch (e) {
                      console.error("Error checking WiFi connection:", e);
                      setConnectionStatus("Could not verify WiFi connection");
                    }
                  }, 3000);
                  
                } catch (error) {
                  console.error("Connection function threw error:", error);
                  setConnectionStatus("WiFi connection failed");
                }
              } catch (err) {
                console.error("Error connecting to WiFi:", err);
                setConnectionStatus("WiFi connection error");
              }
            }, 18000); // Wait 18 seconds for ESP32 to start its WiFi AP
          } else {
            setConnectionStatus("Failed to get WiFi credentials");
            setIsWifiConnecting(false);
          }
        } catch (error) {
          console.error("Error during WiFi connection process:", error);
          setConnectionStatus("Error during WiFi connection process");
          setIsWifiConnecting(false);
        }
      };
      
      connectWiFi();
    }
  }, [connectedDevice, isConnecting, isWifiConnecting]);
  
  const handleDeviceConnect = async (device: Device) => {
    setIsConnecting(true);  // Set connecting state to prevent rescans
    stopScan();             // Immediately stop scanning
    try {
      await connectToDevice(device);
    } catch (error) {
      console.error("Failed to connect to device:", error);
      Alert.alert("Connection Error", "Failed to connect to device. Please try again.");
    }
    setIsConnecting(false); // Reset after connection attempt completes
  };

  return (
    <GradientBackground>
      <LeftBackArrowButton onPress={() => navigation.navigate("Welcome")} />
      
      {allDevices.length === 0 && !isConnecting && !isWifiConnecting && !connectedDevice && (
        <View style={styles.centeredView}>
          <MaterialCommunityIcons name="glasses" size={124} color="white" />
          <Text style={styles.mainText}>Searching for a device...</Text>
        </View>
      )}
      
      {isConnecting && !connectedDevice && (
        <View style={styles.centeredView}>
          <MaterialCommunityIcons name="glasses" size={124} color="white" />
          <Text style={styles.mainText}>Connecting...</Text>
        </View>
      )}
      
      {allDevices.length > 0 && !connectedDevice && !isConnecting && !isWifiConnecting && (
        <View style={styles.centeredView}>
          <MaterialCommunityIcons name="glasses" size={124} color="white" />
          <Text style={styles.mainText}>Devices found</Text>
          <View style={styles.buttonsContainer}>
            {allDevices.slice(0,10).map((device) => (
              <Pressable
                style={styles.whiteButton}
                key={device.id}
                onPress={() => handleDeviceConnect(device)}
              >
                <Text style={styles.textCenter}>{device.name || "Unnamed device"}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      
      {(connectedDevice || isWifiConnecting) && (
        <>
          <View style={styles.centeredView}>
            <MaterialCommunityIcons name="glasses" size={124} color="white" />
            <View style={styles.inlineView}>
              <Text style={styles.mainText}>Connected</Text>
              <MaterialCommunityIcons name="check" size={24} color="white" />
            </View>
            {isWifiConnecting && connectionStatus && (
              <Text style={styles.statusText}>{connectionStatus}</Text>
            )}
          </View>
          <Pressable
            style={styles.nextButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="arrow-forward" size={30} color="black" />
          </Pressable>
        </>
      )}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    color: "white",
    fontSize: 20,
    marginBottom: 16,
  },
  statusText: {
    color: "#e0e0e0",
    fontSize: 16,
    marginTop: 10,
  },
  inlineView: {
    flexDirection: "row",
    gap: 4,
  },
  whiteButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
  },
  buttonsContainer: {
    flexDirection: "column",
    gap: 8,
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 70,
    right: 30,
    fontWeight: "bold",
  },
  textCenter: {
    textAlign: "center",
  },
});

export default BluetoothPage;