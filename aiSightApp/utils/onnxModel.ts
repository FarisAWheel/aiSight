import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { Asset } from "expo-asset";

const classNames = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "backpack",
  "umbrella",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "dining table",
  "toilet",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "cell phone",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush"
];

export async function loadModel() {
  const modelAsset = Asset.fromModule(require("../assets/models/yolo11n.onnx"));
  await modelAsset.downloadAsync();
  const session = await InferenceSession.create(
    modelAsset.localUri || modelAsset.uri
  );
  return session;
}

export async function runModel(session: InferenceSession, imageTensor: Tensor) {
  console.log("Model input:", session.inputNames);

  // Run the model
  const feeds = { images: imageTensor };
  const results = await session.run(feeds);

  // Extract the output tensor
  const outputTensor = results.output0;
  console.log("Model output shape:", outputTensor.dims);

  // Reshape the output tensor to [8400, 84]
  const outputData = outputTensor.data as Float32Array;
  const outputTransposed = [];

  // Iterate through the output data and reshape it
  for (let i = 0; i < 8400; i++) {
    // Slice the output data into chunks of 84 elements
    outputTransposed.push(outputData.slice(i * 84, (i + 1) * 84));
  }

  // Filter detections and apply confidence threshold
  const detections = [];
  const confidenceThreshold = 0.7;

  // Iterate through the reshaped output data
  for (let i = 0; i < 8400; i++) {
    // Destructure the outputTransposed array
    // cx, cy: center x and y coordinates of the bounding box
    // w, h: width and height of the bounding box
    // ...classScores: array of class scores for each class
    const [cx, cy, w, h, ...classScores] = outputTransposed[i];

    // Apply sigmoid to convert logits to probabilities
    const classProbabilities = classScores.map(
      score => 1 / (1 + Math.exp(-score))
    );

    // Get the maximum class probability
    const maxScore = Math.max(...classProbabilities);

    // Get the class ID with the maximum probability
    const classId = classProbabilities.indexOf(maxScore);

    // If the maximum probability is greater than the confidence threshold
    if (maxScore > confidenceThreshold) {
      // Add the detection to the detections array
      detections.push({
        cx: cx / 640, // Normalize center x
        cy: cy / 640, // Normalize center y
        w: w / 640, // Normalize width
        h: h / 640, // Normalize height
        classId, // Class ID
        className: classNames[classId], // Add class name
        confidence: maxScore // Confidence score
      });
    }
  }

  //hey chat, its me tristan from hit show Turburculosis with Tristan. I'm here to help you on your journey to build this app. So sit back, and lets enjoy the ride before I die of tuberculosis.

  // Apply Non-Maximum Suppression (NMS)
  const nmsDetections = nms(detections, 0.1);

  // Convert normalized coordinates to pixel values
  const imgWidth = imageTensor.dims[3]; // Assuming imageTensor shape is [1, 3, H, W]
  const imgHeight = imageTensor.dims[2];
  const formattedDetections = nmsDetections.map(detection => ({
    ...detection,
    bbox: scaleCoords(imgWidth, imgHeight, detection)
  }));
  console.log("Detections:", formattedDetections);
  return formattedDetections;
}

// Helper function for Non-Maximum Suppression (NMS)
function nms(detections: any[], iouThreshold: number) {
  let sortedDetections = detections.sort((a, b) => b.confidence - a.confidence);
  const selectedDetections = [];

  while (sortedDetections.length > 0) {
    const current = sortedDetections.shift();
    selectedDetections.push(current);

    sortedDetections = sortedDetections.filter(detection => {
      const iou = calculateIOU(current, detection);
      return iou < iouThreshold;
    });
  }

  return selectedDetections;
}

// Helper function to calculate Intersection over Union (IOU)
function calculateIOU(box1: any, box2: any) {
  const x1 = Math.max(box1.cx - box1.w / 2, box2.cx - box2.w / 2);
  const y1 = Math.max(box1.cy - box1.h / 2, box2.cy - box2.h / 2);
  const x2 = Math.min(box1.cx + box1.w / 2, box2.cx + box2.w / 2);
  const y2 = Math.min(box1.cy + box1.h / 2, box2.cy + box2.h / 2);

  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const area1 = box1.w * box1.h;
  const area2 = box2.w * box2.h;
  const union = area1 + area2 - intersection;

  return intersection / union;
}

// Helper function to scale coordinates to image dimensions
function scaleCoords(imgWidth: number, imgHeight: number, detection: any) {
  return {
    x1: (detection.cx - detection.w / 2) * imgWidth,
    y1: (detection.cy - detection.h / 2) * imgHeight,
    x2: (detection.cx + detection.w / 2) * imgWidth,
    y2: (detection.cy + detection.h / 2) * imgHeight
  };
}
