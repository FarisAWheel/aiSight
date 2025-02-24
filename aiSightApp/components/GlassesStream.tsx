import { BleManager } from "react-native-ble-plx";
import Video from "react-native-video";
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

const GlassesStream = () => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [networkDetectedModalShown, showNetworkDetectedModal] = useState(false);
  const [hotspotModalShown, showHotspotModal] = useState(false);
  let ssidInput = "";
  let passwordInput = "";

  useEffect(() => {
    let ssidInfo;
    NetworkInfo.getSSID().then((ssid) => (ssidInfo = ssid));
    if (ssidInfo) setSsid(ssidInfo);
    if (ssid && !password) showNetworkDetectedModal(true);
    else if (!ssid && !password) showHotspotModal(true);
  }, []);

  return (
    <View>
      {ssid && password && (
        <Video
          source={{ uri: "http://132.170.59.98:5000/stream" }}
          style={{ width: 300, height: 300 }}
        />
      )}
      <Modal
        transparent={true}
        visible={networkDetectedModalShown}
        onRequestClose={() => showNetworkDetectedModal(false)}
      >
        <View style={styles.centeredView}>
          <Text>Detected you are on {ssid}</Text>
          <Text>Please enter the password for this network</Text>
          <TextInput
            placeholder="Password"
            onChangeText={(text) => (passwordInput = text)}
          />
          <Pressable onPress={() => setPassword(passwordInput)}>
            <Text>Connect</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              showNetworkDetectedModal(false);
              showHotspotModal(true);
            }}
          >
            <Text>Use hotspot</Text>
          </Pressable>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={hotspotModalShown}
        onRequestClose={() => showHotspotModal(false)}
      >
        <View style={styles.centeredView}>
          <Text>Please enter the credentials for your phone's hotspot</Text>
          <TextInput
            placeholder="SSID"
            onChangeText={(text) => (ssidInput = text)}
          />
          <TextInput
            placeholder="Password"
            onChangeText={(text) => (passwordInput = text)}
          />
          <Pressable
            onPress={() => {
              setSsid(ssidInput);
              setPassword(passwordInput);
              showHotspotModal(false);
            }}
          >
            <Text>Connect</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GlassesStream;
