# just make sure to pip/pip3 install ultralytics before running the program
from ultralytics import YOLO
from enum import Enum

class ModelType(Enum):
    YOLOV8 = "yolov8n.pt"

#if the program isnt picking up on your camera try changing the camera number
class Camera(Enum):
    CAMERA_1 = 0 # Webcam
    CAMERA_2 = 1 # Mac Camera

def live_detect(model_type: ModelType, camera: Camera):
    model = YOLO(model_type.value)
    model.predict(source=camera.value, show=True)

if __name__ == "__main__":
    live_detect(ModelType.YOLOV8, Camera.CAMERA_1)# change the parameter here to switch cameras