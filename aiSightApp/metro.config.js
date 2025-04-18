/** @type {import('expo/metro-config').MetroConfig} */

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

// Get the default config
const defaultConfig = getDefaultConfig(__dirname);

// Add ONNX to the list of asset extensions
defaultConfig.resolver.assetExts.push("onnx");

// Apply Reanimated wrapper and export only once
module.exports = wrapWithReanimatedMetroConfig(defaultConfig);