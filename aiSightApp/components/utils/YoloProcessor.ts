import * as ort from 'onnxruntime-react-native';
import RNFS from 'react-native-fs';

export type YOLOResult = {
  boxes: { x: number; y: number; width: number; height: number }[];
};

export async function loadYOLOModel(): Promise<ort.InferenceSession | null> {
  try {
    const modelPath = 'aiSightApp/assets/yolov8n.onnx';
    console.log('Loading YOLO model from:', modelPath);
    return await ort.InferenceSession.create(modelPath);
  } catch (err) {
    console.error('Error loading YOLO model:', err);
    return null;
  }
}

export async function runYOLOInference(
  session: ort.InferenceSession | null,
  imageData: Float32Array
): Promise<YOLOResult | null> {
  if (!session) {
    console.error('Inference session is null');
    return null;
  }

  try {
    const inputTensor = new ort.Tensor('float32', imageData, [1, 3, 640, 640]);
    const results = await session.run({ images: inputTensor });

    // Mock example post-processing
    const boxes = [
      { x: 100, y: 150, width: 50, height: 70 }, 
    ];

    return { boxes };
  } catch (err) {
    console.error('Error during inference:', err);
    return null;
  }
}