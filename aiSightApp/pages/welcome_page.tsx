import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import GradientBackground from "../components/GradientBackground";

//welcome page
const WelcomePage = ({navigation}:{navigation:any}) => {
    return (
        <GradientBackground>
                <Text style={styles.helloText}>Hello,</Text>
                <Text style={styles.welcomeText}>Welcome to AiSight</Text>
                <View style={styles.line} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Bluetooth");
        }}
      >
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Help");
        }}
      >
        <Text style={styles.buttonText}>Help</Text>
      </TouchableOpacity>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  helloText: {
    fontSize: 48,
    fontStyle: "italic",
    color: "white",
  },
  welcomeText: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },
  line: {
    width: 150,
    height: 1,
    backgroundColor: "white",
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5, // For Android shadow
    marginTop:20,
  },
  buttonText: {
    fontSize: 18,
    color: "#9BB5DE",
    fontWeight: "bold",
  },
});

export default WelcomePage;
