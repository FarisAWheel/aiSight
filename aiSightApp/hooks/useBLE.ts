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
}

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
    bleManager.startDeviceScan(null, { scanMode: 2 }, (error, device) => {
      if (error) {
        console.error(error);
        return;
      }

      if (device && device.name?.includes("aiSight")) {
        setAllDevices((prev) => {
          if (prev.find((d) => d.id === device.id)) {
            return prev;
          }
          return [...prev, device];
        });
      }
    });
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

  return {
    scanForPeripherals,
    requestPermissions,
    allDevices,
    connectToDevice,
    connectedDevice,
  };
}

export default useBLE;
