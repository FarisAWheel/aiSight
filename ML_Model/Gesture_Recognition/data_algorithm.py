import cv2
import os
import numpy as np

def makedir(path):
    if not os.path.exists(path):
        os.makedirs(path)

# — CONFIGURATION —
NUM_GESTURES = 3
ORDINALS     = ['1st', '2nd', '3rd']  # human‑friendly names for prompts
ROI_TOP_LEFT     = (270, 50)
ROI_BOTTOM_RIGHT = (670, 450)

# base dirs for YOLO structure
IMG_BASE   = './hndgestures/images'
LBL_BASE   = './hndgestures/labels'

# sharpening kernel
kernel = np.array([[ 0, -1,  0],
                   [-1,  5, -1],
                   [ 0, -1,  0]])

# initialize camera
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT,720)
cap.set(cv2.CAP_PROP_AUTOFOCUS,1)

# prepare display windows
for name in ('roi','sharp_roi','frame'):
    cv2.namedWindow(name, cv2.WINDOW_NORMAL)
    if name != 'frame':
        cv2.resizeWindow(name, 600, 600)

phase = 0
img_count = 0
max_phase = NUM_GESTURES * 3  # for each gesture: prompt/train/test

while phase <= max_phase:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    disp  = frame.copy()

    # draw ROI
    cv2.rectangle(disp, ROI_TOP_LEFT, ROI_BOTTOM_RIGHT, (255,0,0), 3)

    # crop & preprocess ROI
    x1,y1 = ROI_TOP_LEFT
    x2,y2 = ROI_BOTTOM_RIGHT
    roi   = frame[y1:y2, x1:x2]
    gray  = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    big   = cv2.resize(gray, (300,300), interpolation=cv2.INTER_CUBIC)
    sharp = cv2.filter2D(big, -1, kernel)

    # decide overlay / saving
    if phase == max_phase:
        cv2.putText(disp, "All done! Hit Enter to exit",
                    (100,100), cv2.FONT_HERSHEY_SIMPLEX,
                    1, (0,255,0), 2)

    elif phase % 3 == 0:
        idx     = phase // 3
        label   = ORDINALS[idx]
        cv2.putText(disp, f"Hit Enter to record {label} gesture",
                    (100,100), cv2.FONT_HERSHEY_SIMPLEX,
                    1, (0,255,0), 2)

    else:
        idx     = phase // 3
        subset  = 'train' if (phase % 3)==1 else 'test'
        img_count += 1
        label   = ORDINALS[idx]
        cv2.putText(disp,
            f"Recording {label} Gesture ({subset}) #{img_count}",
            (100,100), cv2.FONT_HERSHEY_SIMPLEX,
            1, (0,255,0), 2)

        # create dirs
        img_dir = os.path.join(IMG_BASE,   subset, str(idx))
        lbl_dir = os.path.join(LBL_BASE,   subset, str(idx))
        makedir(img_dir); makedir(lbl_dir)

        # save image
        img_path = os.path.join(img_dir, f"{img_count}.png")
        cv2.imwrite(img_path, sharp, [cv2.IMWRITE_PNG_COMPRESSION, 0])

        # save YOLO label (one box covering whole image)
        lbl_path = os.path.join(lbl_dir, f"{img_count}.txt")
        with open(lbl_path, 'w') as f:
            # class_id, x_center, y_center, width, height (all normalized)
            f.write(f"{idx} 0.5 0.5 1.0 1.0\n")

    # show windows
    cv2.imshow('roi',       big)
    cv2.imshow('sharp_roi', sharp)
    cv2.imshow('frame',     disp)

    # advance on Enter key
    if cv2.waitKey(1) == 13:
        img_count = 0
        phase    += 1

cap.release()
cv2.destroyAllWindows()
