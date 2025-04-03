import { useMemo, useState, useEffect } from "react";
import { BleManager, Device, Base64 } from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";
import * as ExpoDevice from "expo-device";

interface BLEApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  allDevices: Device[];
  connectToDevice(device: Device): Promise<void>;
  connectedDevice: Device | null;
  retrieveWebserverCredentials(): Promise<{ ssid: string; password: string }>;
  bleManager: BleManager; 
}

const SERVICE_UUID = ["bd2ffd83-7385-440c-880d-b20f78825585"];
const WEBSERVER_SSID_CHARACTERISTIC_UUID =
  "5629f669-08d5-43b6-a2f6-f69d249f628b";
const WEBSERVER_PASSWORD_CHARACTERISTIC_UUID =
  "f6e2e6c0-c178-4b1d-8c91-d1d3bc2617cb";

function useBLE(): BLEApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Scan Permission",
        message: "App requires bluetooth scanning",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Scan Permission",
        message: "App requires bluetooth connecting",
        buttonPositive: "OK",
      }
    );
    const bluetoothFineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Scan Permission",
        message: "App requires bluetooth fine location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      bluetoothFineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "App requires location permission",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return requestAndroid31Permissions();
      }
    }
    return true;
  };

  const scanForPeripherals = () => {
    if (!ExpoDevice.isDevice) { // if we are not in a physical device
      console.log("Mocking BLE devices (not a physical device)");
      setTimeout(() => {
        setAllDevices([
          { id: "12345", name: "aiSight glasses" },
          { id: "6789", name: "aiSight glasses 2" },
        ] as Device[]);
      }, 2000);
      return;
    }
  
    console.log("Scanning for all nearby BLE devices...");
    //EDITED: Passed in null instead of UUID to scan for all devices
    bleManager.startDeviceScan(SERVICE_UUID, null, (error, device) => {
      if (error) {
        console.error("Scan error:", error);
        return;
      }
  
      if (device) {
        setAllDevices((prevDevices) => {
          if (prevDevices.some((d) => d.id === device.id)) {
            return prevDevices;
          }
          console.log("Found device:", device.name || "Unnamed", "-", device.id);
          return [...prevDevices, device];
        });
      }
    });
  };
  

  const connectToDevice = async (device: Device) => {
    if (!ExpoDevice.isDevice) {
      setConnectedDevice(device);
      return;
    }

    try {
      const connection = await bleManager.connectToDevice(device.id);
      await connection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      setConnectedDevice(connection);
      console.log("Connected to", connection.name);
    } catch (e) {
      console.error("Connection error", e);
    }
  };

  const retrieveWebserverCredentials = async () => {
    if (!connectedDevice) {
      throw new Error("No connected device");
    }

    const ssidCharacteristic = await connectedDevice.readCharacteristicForService(
      SERVICE_UUID[0],
      WEBSERVER_SSID_CHARACTERISTIC_UUID
    );
    if (!ssidCharacteristic.value) {
      throw new Error("Could not read SSID characteristic value");
    }
    const passwordCharacteristic =
      await connectedDevice.readCharacteristicForService(
      SERVICE_UUID[0],
      WEBSERVER_PASSWORD_CHARACTERISTIC_UUID
    );
    if (!passwordCharacteristic.value) {
      throw new Error("Could not read password characteristic value");
    }
    return {
      ssid: atob(ssidCharacteristic.value),
      password: atob(passwordCharacteristic.value),
    };
  };

  return {
    scanForPeripherals,
    requestPermissions,
    allDevices,
    connectToDevice,
    connectedDevice,
    retrieveWebserverCredentials,
    bleManager,
  };
}

export default useBLE;
