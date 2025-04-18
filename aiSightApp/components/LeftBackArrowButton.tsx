import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LeftBackArrowButton = ({ onPress }: { onPress: any }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="arrow-back" style={styles.arrow}></Ionicons>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 48,
    left: 22,
  },
  arrow: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default LeftBackArrowButton;
