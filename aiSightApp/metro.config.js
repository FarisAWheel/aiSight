// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = wrapWithReanimatedMetroConfig(config);
const { getDefaultConfig } = require("@expo/metro-config");
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push("onnx");
module.exports = defaultConfig;