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

const SERVICE_UUID = "7744f639-d553-4757-9868-404fe754ea34";
const CHARACTERISTIC_UUID = "bf16bfa0-4a61-47a8-9d4f-02c27947d36a";

const BluetoothPage = ({ navigation }: { navigation: any }) => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [networkDetectedModalShown, showNetworkDetectedModal] = useState(false);
  const [hotspotModalShown, showHotspotModal] = useState(false);
  const { requestPermissions } = useBLE();
  let ssidInput = "";
  let passwordInput = "";

  useEffect(() => {
    let ssidInfo;
    NetworkInfo.getSSID().then((ssid) => (ssidInfo = ssid));
    if (ssidInfo) setSsid(ssidInfo);
    if (ssid && !password) showNetworkDetectedModal(true);
    else if (!ssid && !password) showHotspotModal(true);
  }, []);

  useEffect(() => {
    if (ssid && password) {
      console.log("ssid: ", ssid);
      console.log("password: ", password);
      if (__DEV__) {
        const manager = new BleManager();
        manager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
          if (device?.name === "SmartGlasses") {
            manager.stopDeviceScan();
            device.connect().then(() => {
              device.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID,
                btoa(JSON.stringify({ ssid, password })),
              );
            });
          }
        });
      }
    }
  });

  return (
    <GradientBackground>
      <LeftBackArrowButton onPress={() => navigation.navigate("Welcome")} />
      <GlassesStream />
    </GradientBackground>
  );
};

export default BluetoothPage;
