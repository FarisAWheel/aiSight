import { useState, useEffect, useRef } from "react";
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
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
  const contentHeight = useSharedValue(0);
  const measuredHeight = useRef(0);

  const onLayout = (e) => {
    measuredHeight.current = e.nativeEvent.layout.height;
    contentHeight.value = isExpanded
      ? withTiming(measuredHeight.current, { duration })
      : withTiming(0, { duration });
  };

  useEffect(() => {
    contentHeight.value = isExpanded
      ? withTiming(measuredHeight.current, { duration })
      : withTiming(0, { duration });
  }, [isExpanded]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: contentHeight.value,
  }));

  return (
    <View>
      <Pressable style={styles.accordionTrigger} onPress={onPress}>
        <View style={[styles.flex, { gap: 12, flex: 1 }]}>
          <View style={styles.accordionIconContainer}>{icon}</View>
          <Text style={{ flexShrink: 1, flexWrap: "wrap" }}>{triggerText}</Text>
        </View>
        <Entypo name="chevron-down" size={24} color="#A7A7A7" />
      </Pressable>
      <Animated.View
        key={`accordionItem_${viewKey}`}
        style={[styles.animatedView, animatedStyle, style]}
      >
        <View onLayout={onLayout} style={styles.wrapper}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const HelpPage = ({ navigation }: { navigation: any }) => {
  const [selectedKey, setSelectedKey] = useState<string>("");

  return (
    <GradientBackground style={styles.pagePadding}>
      <LeftBackArrowButton onPress={() => navigation.navigate("Settings")} />
      <View style={styles.pageContainer}>
        <View>
          <View style={styles.titleContainer}>
            <AntDesign name="questioncircleo" size={18} color="#A7A7A7" />
            <Text style={styles.title}>FAQs</Text>
          </View>
          <View>
            <Text style={styles.subtitle}>Frequently Asked Questions</Text>
          </View>
        </View>
        <View style={styles.faqContainer}>
          <View>
            <AccordionItem
              triggerText="How do I connect my device?"
              icon={<FontAwesome5 name="glasses" size={18} color="#A7A7A7" />}
              isExpanded={selectedKey === "device"}
              viewKey="device"
              onPress={() => setSelectedKey("device")}
            >
              <Text style={{marginLeft: 43, fontSize: 15}}>Fascinating question!</Text>
            </AccordionItem>
            <View style={styles.separator} />
            <AccordionItem
              triggerText="Why won't my feed display properly?"
              icon={<FontAwesome6 name="display" size={18} color= "#A7A7A7" />}
              isExpanded={selectedKey === "feed"}
              viewKey="feed"
              onPress={() => setSelectedKey("feed")}
            >
              <Text style={{marginLeft: 43, fontSize: 15}}>Fascinating question!</Text>
            </AccordionItem>
            <View style={styles.separator} />
            <AccordionItem
              triggerText="The text-to-speech isn't working"
              icon={
                <MaterialCommunityIcons
                  name="text-to-speech"
                  size={18}
                  color="#A7A7A7"
                />
              }
              isExpanded={selectedKey === "tts"}
              viewKey="feed"
              onPress={() => setSelectedKey("tts")}
            >
              <Text style={{marginLeft: 43, fontSize: 15}}>Fascinating question!</Text>
            </AccordionItem>
          </View>
        </View>
        <TouchableOpacity style={styles.bugButton}>
          <Text>Report a bug</Text>
          <FontAwesome5 name="bug" size={24} color="#A7A7A7" />
        </TouchableOpacity>
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
    display: "flex",
    flexDirection: "column",
    gap: 15,
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
    fontSize: 32,
    color: "#555555",
  },

  subtitle: {
    fontSize: 12,
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

  bugButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingVertical: 12,
    gap: 8,
  },
});
/*
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import GradientBackground from "../components/GradientBackground";
import LeftBackArrowButton from "../components/LeftBackArrowButton";

const FAQS = [
  { icon: "glasses", question: "How do I connect my device?" },
  { icon: "monitor", question: "Why won’t my feed display properly?" },
  { icon: "record-voice-over", question: "The text-to-speech isn’t working" },
  { icon: "heart-broken", question: "Why doesn’t my wife love me?" },
  { icon: "hammer", question: "How do you fix a broken marriage?" },
  { icon: "robot", question: "Will I ever see my son again?" },
];

export default function HelpPage({ navigation }) {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <LeftBackArrowButton onPress={() => navigation.goBack()} />

        <View style={styles.card}>
          <Text style={styles.title}>FAQs</Text>
          <Text style={styles.subtitle}>Frequently Asked Questions</Text>

          <View style={styles.listWrapper}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator>
              {FAQS.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.item}
                  activeOpacity={0.7}
                  onPress={() => {
                  }}
                >
                  <View style={styles.itemLeft}>
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={24}
                      color="#555"
                      style={styles.icon}
                    />
                    <Text style={styles.question}>{item.question}</Text>
                  </View>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.reportBtn} activeOpacity={0.7}>
            <Text style={styles.reportText}>Report a bug</Text>
            <MaterialCommunityIcons
              name="bug"
              size={20}
              color="#555"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  card: {
    flex: 1,
    margin: 16,
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
  },
  listWrapper: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CCC",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  icon: {
    marginRight: 12,
  },
  question: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E5EA",
    borderRadius: 16,
    paddingVertical: 14,
  },
  reportText: {
    fontSize: 16,
    color: "#333",
  },
});
*/
