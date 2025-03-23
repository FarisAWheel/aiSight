import { useMemo, useState } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";
import * as ExpoDevice from "expo-device";

interface BLEApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  allDevices: Device[];
  connectToDevice(device: Device): void;
  connectedDevice: Device | null;
  retrieveWebserverCredentials(): Promise<{ ssid: string; password: string }>;
}

const SERVICE_UUID = "bd2ffd83-7385-440c-880d-b20f78825585";
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
    } else {
      return true;
    }
  };

  const scanForPeripherals = () => {
    if (!ExpoDevice.isDevice) {
      setTimeout(() => {
        setAllDevices([
          { id: "12345", name: "aiSight glasses" },
          { id: "6789", name: "aiSight glasses 2" },
        ] as Device[]);
      }, 2000);
      return;
    }
    bleManager.startDeviceScan(
      [SERVICE_UUID],
      { scanMode: 2 },
      (error, _device) => {
        if (error) {
          console.error(error);
          return;
        }
      }
    );
  };

  const connectToDevice = async (device: Device) => {
    if (!ExpoDevice.isDevice) {
      setConnectedDevice(device);
      return;
    }
    const deviceConnection = await bleManager.connectToDevice(device.id);
    setConnectedDevice(deviceConnection);
    await deviceConnection.discoverAllServicesAndCharacteristics();
    bleManager.stopDeviceScan();
  };

  const retrieveWebserverCredentials = async () => {
    if (!connectedDevice) {
      throw new Error("No connected device");
    }
    const ssidCharacteristic =
      await connectedDevice.readCharacteristicForService(
        SERVICE_UUID,
        WEBSERVER_SSID_CHARACTERISTIC_UUID
      );
    if (!ssidCharacteristic.value) {
      throw new Error("Could not read SSID characteristic value");
    }
    const passwordCharacteristic =
      await connectedDevice.readCharacteristicForService(
        SERVICE_UUID,
        WEBSERVER_PASSWORD_CHARACTERISTIC_UUID
      );
    if (!passwordCharacteristic.value) {
      throw new Error("Could not read password characteristic value");
    }
    return {
      ssid: ssidCharacteristic.value,
      password: passwordCharacteristic.value,
    };
  };

  return {
    scanForPeripherals,
    requestPermissions,
    allDevices,
    connectToDevice,
    connectedDevice,
    retrieveWebserverCredentials,
  };
}

export default useBLE;
