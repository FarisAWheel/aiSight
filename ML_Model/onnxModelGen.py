from ultralytics import YOLO
import cv2

# Load the ONNX model (use `task=detect` for clarity)
model = YOLO("yolo11n.onnx", task="detect")

# Run inference
results = model("test.jpeg")

# Extract class IDs
class_ids = results[0].boxes.cls.cpu().numpy()

# Check if class IDs are within 0-79 (COCO class range)
print("Detected class IDs:", class_ids)
