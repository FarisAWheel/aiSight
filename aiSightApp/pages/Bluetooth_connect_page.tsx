import React from "react";
import GradientBackground from "../components/GradientBackground";
import LeftBackArrowButton from "../components/LeftBackArrowButton";
import { useEffect } from "react";
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
  } = useBLE();

  useEffect(() => {
    async function scan() {
      const permissionsGranted = await requestPermissions();
      if (permissionsGranted) {
        scanForPeripherals();
      } else {
        console.error("Permissions not granted");
      }
    }

    scan();
  }, []);

  useEffect(() => {
    if (allDevices.length === 1) {
      connectToDevice(allDevices[0]);
    }
  });

  return (
    <GradientBackground>
      <LeftBackArrowButton onPress={() => navigation.navigate("Welcome")} />
      {allDevices.length === 0 && (
        <View style={styles.centeredView}>
          <MaterialCommunityIcons name="glasses" size={124} color="white" />
          <Text style={styles.mainText}>Searching for a device...</Text>
        </View>
      )}
      {allDevices.length > 1 && !connectedDevice && (
        <View style={styles.centeredView}>
          <MaterialCommunityIcons name="glasses" size={124} color="white" />
          <Text style={styles.mainText}>Multiple devices found</Text>
          <View style={styles.buttonsContainer}>
            {allDevices.map((device) => (
              <Pressable
                style={styles.whiteButton}
                key={device.id}
                onPress={() => connectToDevice(device)}
              >
                <Text style={styles.textCenter}>{device.name}</Text>
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
    display: "flex",
    flexDirection: "row",
    gap: 4,
  },

  whiteButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
  },

  buttonsContainer: {
    display: "flex",
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
