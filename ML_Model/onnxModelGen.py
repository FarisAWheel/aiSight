from ultralytics import YOLO  # type: ignore

# Load YOLOv8n model
model = YOLO("yolov8n.pt")

# Export the model to ONNX format
model.export(format="onnx")
