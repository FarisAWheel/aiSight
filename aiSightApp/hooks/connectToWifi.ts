import { PermissionsAndroid, Platform } from "react-native";
import WifiManager from "react-native-wifi-reborn";

async function connectToWifi(
    ssid: string,
    password: string,
    isWep: boolean = false,
    isHidden: boolean = false
): Promise<boolean> {
    console.log(`[WiFi] Starting connection to: ${ssid}`);
    try {
        // Step 1: Request location permission (needed for WiFi operations)
        console.log("[WiFi] Requesting location permission...");
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "WiFi connection requires location permission",
                buttonPositive: "OK",
                buttonNegative: "Cancel"
            }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("[WiFi] Permission granted, proceeding with connection");
            
            try {
                // Step 2: Make sure WiFi is enabled
                console.log("[WiFi] Ensuring WiFi is enabled...");
                if(Platform.OS === 'android') {
                    const isEnabled = await WifiManager.isEnabled();
                    if(!isEnabled) {
                        console.log("[WiFi] WiFi is disabled, enabling it");
                        await WifiManager.setEnabled(true);
                        // Give time for WiFi to fully enable
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
                
                // Step 3: Check current WiFi status
                console.log(`[WiFi] Checking current WiFi status...`);
                try {
                    const currentSsid = await WifiManager.getCurrentWifiSSID();
                    console.log(`[WiFi] Currently connected to: ${currentSsid}`);
                } catch (e) {
                    console.log(`[WiFi] Not connected to any network or error checking current network`);
                }
                
                // Step 4: Disconnect from any current WiFi
                console.log("[WiFi] Attempting to disconnect from current WiFi...");
                try {
                    await WifiManager.disconnect();
                    console.log("[WiFi] Disconnected from current WiFi");
                } catch (e) {
                    console.log("[WiFi] No WiFi to disconnect from or error disconnecting");
                    console.log("[WiFi] Error details:", e);
                }
                
                // Step 5: Force WiFi usage (with error handling)
                // console.log("[WiFi] Setting force WiFi usage...");
                // try {
                //     await WifiManager.forceWifiUsageWithOptions(true, { noInternet: true });
                //     console.log("[WiFi] Force WiFi usage set successfully");
                // } catch (e) {
                //     console.error("[WiFi] Error setting force WiFi usage:", e);
                //     // Continue anyway, as this might not be critical
                // }
                
                // Step 6: Attempt connection
                console.log(`[WiFi] Now attempting to connect to ${ssid}...`);
                try {
                    await WifiManager.connectToProtectedSSID(ssid, password, isWep, isHidden);
                    console.log("[WiFi] Connection request sent, waiting to verify");
                    
                    // Step 7: Wait to verify connection
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    
                    try {
                        const connectedSsid = await WifiManager.getCurrentWifiSSID();
                        console.log(`[WiFi] After connection attempt, connected to: ${connectedSsid}`);
                        
                        const isSuccess = connectedSsid === ssid;
                        console.log(`[WiFi] Connection ${isSuccess ? "SUCCESSFUL ✓" : "FAILED ✗"}`);
                        
                        return isSuccess;
                    } catch (e) {
                        console.error("[WiFi] Error getting current SSID after connection:", e);
                        return false;
                    }
                } catch (e) {
                    console.error("[WiFi] Error during connection attempt:", e);
                    // Check if the error message contains useful information
                    return false;
                }
            } catch (error) {
                console.error("[WiFi] Connection process failed:", error);
                return false;
            }
        } else {
            console.warn("[WiFi] Location permission denied");
            return false;
        }
    } catch (error) {
        console.error("[WiFi] Top-level error in WiFi connection process:", error);
        return false;
    }
}

export default connectToWifi;