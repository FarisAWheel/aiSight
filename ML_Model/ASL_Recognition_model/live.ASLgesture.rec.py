# just make sure to pip/pip3 install ultralytics before running the program
from ultralytics import YOLO  # type: ignore
from enum import Enum
import torch
import torchvision

class ModelType(Enum):
    YOLOV8 = "yolo11n.pt"
    FINE_TUNED = r"C:\Users\earis\OneDrive\Desktop\GIT Rep\aiSight\runs\detect\train28\weights\best.pt"


# if the program isnt picking up on your camera try changing the camera number
class Camera(Enum):
    CAMERA_1 = 0  # Webcam
    CAMERA_2 = 1  # Mac Camera


def live_detect(model_type: ModelType, camera: Camera):
    model = YOLO(model_type.value)
    model.predict(source=camera.value, show=True)

    


if __name__ == '__main__':
    import multiprocessing
    multiprocessing.freeze_support()

    live_detect(
        ModelType.FINE_TUNED, Camera.CAMERA_1
    )  # change the parameter here to switch cameras
