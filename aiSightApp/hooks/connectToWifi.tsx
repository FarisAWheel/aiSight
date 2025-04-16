import { PermissionsAndroid } from "react-native";
import WifiManager from "react-native-wifi-reborn";

interface WifiConnectionOptions {
    ssid: string;
    password: string;
    isWep?: boolean;
    isHidden?: boolean;
}

async function connectToWifi(
    ssid: string,
    password: string,
    isWep: boolean = false,
    isHidden: boolean = false
): Promise<void> {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location permission is required for WiFi connections",
                message:
                    "This app needs location permission as this is required to scan for WiFi networks.",
                buttonNegative: "DENY",
                buttonPositive: "ALLOW",
            }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            try {
                await WifiManager.connectToProtectedSSID(ssid, password, isWep, isHidden);
                console.log("Connected successfully!");

                try {
                    const currentSsid = await WifiManager.getCurrentWifiSSID();
                    console.log("Your current connected WiFi SSID is " + currentSsid);
                } catch (error) {
                    console.error("Cannot get current SSID!", error);
                }
            } catch (error) {
                console.error("Connection failed!", error);
            }
        } else {
            console.warn("Location permission denied.");
        }
    } catch (error) {
        console.error("Error requesting location permission", error);
    }
}

export default connectToWifi;
