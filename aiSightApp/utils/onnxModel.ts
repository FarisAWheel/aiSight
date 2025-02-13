import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { Asset } from "expo-asset";

export async function loadModel() {
  const modelAsset = Asset.fromModule(require("../assets/models/yolov8n.onnx"));
  await modelAsset.downloadAsync();
  const session = await InferenceSession.create(
    modelAsset.localUri || modelAsset.uri
  );
  return session;
}

export async function runModel(session: InferenceSession, imageTensor: Tensor) {
  console.log("Model input:", session.inputNames);
  const feeds = { images: imageTensor };
  const results = await session.run(feeds);

  return results;
}
