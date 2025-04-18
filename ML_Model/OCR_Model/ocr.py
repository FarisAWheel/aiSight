import easyocr
import pyheif
from PIL import Image
import pandas as pd
import os

reader = easyocr.Reader(['en'], gpu=False)

def convert_heic_to_jpg(heic_path):
    heif_file = pyheif.read(heic_path)
    image = Image.frombytes(
        heif_file.mode, heif_file.size, heif_file.data,
        "raw", heif_file.mode, heif_file.stride
    )
    jpg_path = heic_path.replace('.HEIC', '.jpg')
    image.save(jpg_path, format="JPEG")
    return jpg_path

def image_to_text(image_path):
    """
    Extracts text from an image using EasyOCR.
    Converts HEIC to JPG if necessary.
    """
    if image_path.lower().endswith('.heic'):
        image_path = convert_heic_to_jpg(image_path)
    
    result = reader.readtext(image_path, detail=0)
    return result

if __name__ == "__main__":
    image_path = 'images/WHO.png'
    extracted_text = image_to_text(image_path)
    for text in extracted_text:
        print(text)