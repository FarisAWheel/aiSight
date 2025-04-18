import {
  Pressable,
  View,
  StyleSheet,
  Text,
  Switch,
  ScrollView,
} from "react-native";
import LeftBackArrowButton from "../components/LeftBackArrowButton";
import GradientBackground from "../components/GradientBackground";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { RadioGroup } from "react-native-radio-buttons-group";

const SettingButton = ({
  text,
  textColor = "black",
  icon,
  actionIcon,
  onPress,
}: {
  text: string;
  textColor?: string;
  icon: any;
  actionIcon?: any;
  onPress?: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.settingsButton}>
      <View style={styles.iconAndTextContainer}>
        <View style={styles.actionIcon}>{icon}</View>
        <Text style={{ color: textColor }}>{text}</Text>
      </View>
      <View>{actionIcon}</View>
    </Pressable>
  );
};

const SettingsPage = ({ navigation }: { navigation: any }) => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const toggleTTS = () => setIsTTSEnabled((previousState) => !previousState);
  const [isDropdownOpen, openDropdown] = useState(false);
  const toggleDropdown = () => openDropdown((previousState) => !previousState);
  const [selectedVoice, setSelectedVoice] = useState("1");

  return (
    <>
      <GradientBackground style={styles.pagePadding}>
        <LeftBackArrowButton onPress={() => navigation.navigate("Home")} />
        <View style={styles.background}>
          <View style={styles.titleContainer}>
            <Feather name="settings" size={20} color="black" />
            <Text style={styles.title}>Settings</Text>
          </View>
          <Text style={styles.sectionHeading}>General</Text>
          <View style={styles.sectionBackground}>
            <SettingButton
              text="Help"
              icon={<EvilIcons name="question" size={18} color="#A7A7A7" />}
              actionIcon={
                <Feather name="chevron-right" size={18} color="#A7A7A7" />
              }
              onPress={() => navigation.navigate('Help')}
            />
            <View style={styles.separator} />
            <SettingButton
              text="Object History"
              icon={<Octicons name="history" size={12} color="#A7A7A7" />}
              actionIcon={
                <Feather name="chevron-right" size={18} color="#A7A7A7" />
              }
              onPress={() => navigation.navigate("ObjectHistory")}
            />
            <View style={styles.separator} />
            <SettingButton
              text="Connect to another device"
              icon={
                <MaterialCommunityIcons
                  name="bluetooth-connect"
                  size={14}
                  color="#A7A7A7"
                />
              }
              actionIcon={
                <Feather name="chevron-right" size={18} color="#A7A7A7" />
              }
              onPress={() => navigation.navigate("Bluetooth")}
            />
            <View style={styles.separator} />
          </View>
          <Text style={styles.sectionHeading}>Text-to-speech</Text>
          <View style={styles.sectionBackground}>
            <SettingButton
              text="Text-to-speech"
              icon={
                <MaterialCommunityIcons
                  name="text-to-speech"
                  size={14}
                  color="#A7A7A7"
                />
              }
              actionIcon={
                <Switch value={isTTSEnabled} onValueChange={toggleTTS} />
              }
              onPress={toggleTTS}
            />
            <View style={styles.separator} />
            <View style={styles.dropdownContainer}>
              <SettingButton
                text="Edit Voice"
                icon={<Feather name="edit-2" size={12} color="#A7A7A7" />}
                actionIcon={
                  <Feather
                    name="chevron-right"
                    size={18}
                    color="#A7A7A7"
                    style={{
                      transform: [
                        { rotate: isDropdownOpen ? "-90deg" : "0deg" },
                      ],
                    }}
                  />
                }
                onPress={toggleDropdown}
              />
              <ScrollView
                style={[
                  styles.dropdown,
                  { display: isDropdownOpen ? "flex" : "none" },
                ]}
              >
                <RadioGroup
                  radioButtons={[
                    {
                      id: "1",
                      label: "Default voice",
                      value: "default",
                      size: 14,
                      containerStyle: { gap: 16 },
                      borderSize: 1,
                      borderColor: "#A0D2EC",
                      color: "#A0D2EC",
                    },
                  ]}
                  containerStyle={{ alignItems: "flex-start" }}
                  selectedId={selectedVoice}
                  onPress={setSelectedVoice}
                />
              </ScrollView>
              <View style={styles.separator} />
            </View>
          </View>
          <Text style={styles.sectionHeading}>Delete</Text>
          <View style={styles.sectionBackground}>
            <SettingButton
              text="Remove current connection"
              textColor="red"
              icon={<Feather name="trash-2" size={14} color="red" />}
            />
          </View>
        </View>
      </GradientBackground>
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
  },

  pagePadding: {
    padding: 20,
  },

  background: {
    backgroundColor: "white",
    paddingInline: 34,
    paddingVertical: 51,
    borderRadius: 54,
    width: "100%",
  },

  sectionHeading: {
    fontSize: 10,
    color: "#555555",
    marginBottom: 8,
    marginLeft: 8,
  },

  sectionBackground: {
    backgroundColor: "#D9D9D995",
    paddingInline: 18,
    paddingVertical: 24,
    borderRadius: 14,
    marginBottom: 12,
  },

  settingsButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconAndTextContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  actionIcon: {
    width: 18,
    height: 18,
    backgroundColor: "white",
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  separator: {
    height: 1,
    backgroundColor: "#55555554",
    marginVertical: 10,
    width: "100%",
  },

  dropdownContainer: {
    position: "relative",
  },

  dropdown: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 8,
    top: "100%",
    maxHeight: 64,
    width: "100%",
    flexDirection: "column",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    zIndex: 1,
  },
});

export default SettingsPage;
