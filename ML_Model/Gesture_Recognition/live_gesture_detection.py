# just make sure to pip/pip3 install ultralytics before running the program
from ultralytics import YOLO  # type: ignore
from enum import Enum
import multiprocessing

class Camera(Enum):
    CAMERA_1 = 0  # Webcam
    CAMERA_2 = 1  # Mac Camera

def live_detect(model, camera: Camera):
    # model is already a YOLO instance pointing at best.pt
    model.predict(source=camera.value, show=True)

if __name__ == '__main__':
    multiprocessing.freeze_support()

    # 1) Instantiate base YOLOv11‑n
    model = YOLO("yolov8n.pt")

    # 2) Train on YOUR dataset
    model.train(
        data="data.yaml",
        epochs=50,
        imgsz=640,
        batch=16,
        device="cuda",
        workers=0
    )

    # 3) Immediately do live detect with the freshly trained weights
    live_detect(model, Camera.CAMERA_1)
    model.predict(
        source=camera.value,
        show=True,
        conf=0.5,          # raise from default 0.25
        iou=0.45,          # you can tweak this too
        classes=[0,1,2]    # optional: only look for your three classes
    )
