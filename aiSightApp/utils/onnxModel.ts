import { InferenceSession, Tensor } from 'onnxruntime-react-native';

const modelPath = require('../assets/models/model.onnx'); 

export async function loadModel() {
  const session = await InferenceSession.create(modelPath);
  return session;
}

export async function runModel(session: InferenceSession, imageTensor: Tensor) {
  const feeds = { input: imageTensor };
  const results = await session.run(feeds);
  return results;
}