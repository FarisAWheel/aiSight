import React from "react";
import GradientBackground from "../components/GradientBackground";
import LeftBackArrowButton from "../components/LeftBackArrowButton";
import GlassesStream from "../components/GlassesStream";
import { BleManager } from "react-native-ble-plx";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NetworkInfo } from "react-native-network-info";
import useBLE from "../hooks/useBLE";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const SERVICE_UUID = "7744f639-d553-4757-9868-404fe754ea34";
const CHARACTERISTIC_UUID = "bf16bfa0-4a61-47a8-9d4f-02c27947d36a";

const BluetoothPage = ({ navigation }: { navigation: any }) => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [networkDetectedModalShown, showNetworkDetectedModal] = useState(false);
  const [hotspotModalShown, showHotspotModal] = useState(false);
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

  useEffect(() => {
    console.log(allDevices);
    console.log(connectedDevice);
  });

  useEffect(() => {
    if (ssid && password) {
      console.log("ssid: ", ssid);
      console.log("password: ", password);
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
      {connectedDevice && (
        <View>
          <MaterialCommunityIcons name="glasses" size={124} color="white" />
          <View style={styles.inlineView}>
            <Text style={styles.mainText}>Connected</Text>
            <MaterialCommunityIcons name="check" size={24} color="white" />
          </View>
        </View>
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
  },

  inlineView: {
    display: "flex",
    gap: "4px",
  },
});

export default BluetoothPage;
