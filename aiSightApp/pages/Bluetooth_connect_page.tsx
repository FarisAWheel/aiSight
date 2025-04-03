import React, { useEffect, useState } from "react";
import GradientBackground from "../components/GradientBackground";
import LeftBackArrowButton from "../components/LeftBackArrowButton";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useBLE from "../hooks/useBLE";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";


const BluetoothPage = ({ navigation }: { navigation: any }) => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    retrieveWebserverCredentials,
    bleManager,
  } = useBLE();

  const [credentials, setCredentials] = useState<{ssid: string; password: string } | null>(null); 

  useEffect(() => {
    const setupBluetooth = async () => {
      const permissionsGranted = await requestPermissions();
      if (!permissionsGranted) {
        console.error("Permissions not granted");
        return;
      }
      //EDITED: make sure the state is checked before scanning for devices
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
  }, []);

  useEffect(() => {
    async function getCredentials() {
      try {
        const retrievedCredentials = await retrieveWebserverCredentials();
        setCredentials(retrievedCredentials);
        console.log("SSID:", retrievedCredentials.ssid);
        console.log("Password:", retrievedCredentials.password);
      } catch (e) {
        console.error("Failed to get credentials", e);
      }
    }

    if(connectedDevice){
      getCredentials();
    }

  }, [connectedDevice])

  return (
    <GradientBackground>
      <LeftBackArrowButton onPress={() => navigation.navigate("Welcome")} />
      {allDevices.length === 0 && (
        <View style={styles.centeredView}>
          <MaterialCommunityIcons name="glasses" size={124} color="white" />
          <Text style={styles.mainText}>Searching for a device...</Text>
        </View>
      )}
      {/* EDITED: made the length to 0 to show all devices */}
      {allDevices.length > 0 && !connectedDevice && (
        <View style={styles.centeredView}>
          <MaterialCommunityIcons name="glasses" size={124} color="white" />
          <Text style={styles.mainText}>Devices found</Text>
          <View style={styles.buttonsContainer}>
            {allDevices.slice(0,10).map((device) => (
              <Pressable
                style={styles.whiteButton}
                key={device.id}
                onPress={() => connectToDevice(device)}
              >
                {/* EDITED: if a device has no name it will show "Unnamed device" */}
                <Text style={styles.textCenter}>{device.name || "Unnamed device"}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {connectedDevice && (
        <>
          <View>
            <MaterialCommunityIcons name="glasses" size={124} color="white" />
            <View style={styles.inlineView}>
              <Text style={styles.mainText}>Connected</Text>
              <MaterialCommunityIcons name="check" size={24} color="white" />
            </View>
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
