import React from "react";
import GradientBackground from "../components/GradientBackground";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import LeftBackArrowButton from "../components/LeftBackArrowButton";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

function AccordionItem({
  isExpanded,
  children,
  viewKey,
  style,
  duration = 200,
  onPress,
  icon,
  triggerText,
}: {
  isExpanded: any;
  children: any;
  viewKey: string;
  style?: any;
  duration?: number;
  onPress?: () => void;
  icon: any;
  triggerText: string;
}) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <View>
      <Pressable style={styles.accordionTrigger} onPress={onPress}>
        <View style={[styles.flex, { gap: 12, flexWrap: "wrap" }]}>
          <View style={styles.accordionIconContainer}>{icon}</View>
          <Text style={{ flex: 1 }}>{triggerText}</Text>
        </View>
        <Entypo name="chevron-down" size={24} color="#A7A7A7" />
      </Pressable>
      <Animated.View
        key={`accordionItem_${viewKey}`}
        style={[styles.animatedView, bodyStyle, style]}
      >
        <View
          onLayout={(e) => {
            height.value = e.nativeEvent.layout.height;
          }}
          style={styles.wrapper}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const HelpPage = ({ navigation }: { navigation: any }) => {
  const selectedKey = useSharedValue("");

  return (
    <GradientBackground style={styles.pagePadding}>
      <LeftBackArrowButton onPress={() => navigation.navigate("Settings")} />
      <View style={styles.pageContainer}>
        <View style={styles.titleContainer}>
          <AntDesign name="questioncircleo" size={12} color="#A7A7A7" />
          <Text style={styles.title}>FAQs</Text>
        </View>
        <View>
          <Text style={styles.subtitle}>Frequently Asked Questions</Text>
        </View>
        <View style={styles.faqContainer}>
          <View>
            <AccordionItem
              triggerText="How do I connect my device?"
              icon={<FontAwesome5 name="glasses" size={18} color="#A7A7A7" />}
              isExpanded={selectedKey.value === "device"}
              viewKey="device"
              onPress={() => (selectedKey.value = "device")}
            >
              <Text>Fascinating question!</Text>
            </AccordionItem>
            <View style={styles.separator} />
            <AccordionItem
              triggerText="Why won't my feed display properly?"
              icon={<FontAwesome6 name="display" size={18} color="#A7A7A7" />}
              isExpanded={selectedKey.value === "feed"}
              viewKey="feed"
              onPress={() => (selectedKey.value = "feed")}
            >
              <Text>Fascinating question!</Text>
            </AccordionItem>
          </View>
        </View>
      </View>
    </GradientBackground>
  );
};

export default HelpPage;

const styles = StyleSheet.create({
  pagePadding: {
    paddingInline: 19,
    paddingVertical: 52,
  },

  pageContainer: {
    backgroundColor: "#FFFFFF",
    paddingInline: 33,
    paddingVertical: 55,
    borderRadius: 54,
    width: "100%",
  },

  wrapper: {
    width: "100%",
    position: "absolute",
    display: "flex",
  },

  animatedView: {
    width: "100%",
    overflow: "hidden",
  },

  titleContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontWeight: 500,
    fontSize: 24,
    color: "#555555",
  },

  subtitle: {
    fontSize: 8,
    color: "#A7A7A7",
    textAlign: "center",
    marginBottom: 26,
  },

  faqContainer: {
    backgroundColor: "#D9D9D965",
    borderRadius: 14,
    paddingInline: 16,
    paddingVertical: 22,
  },

  accordionTrigger: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  accordionIconContainer: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderRadius: 5,
  },

  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#A7A7A7",
    marginVertical: 10,
  },
});
