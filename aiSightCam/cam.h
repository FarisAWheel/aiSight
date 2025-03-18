#ifndef CAM_H
#define CAM_H

#include "esp_camera.h"
#include <WiFi.h>
#include <WebServer.h>

#define CAMERA_MODEL_AI_THINKER
#include "camera_pins.h"

void beginStreaming();
void handleClient();


#endif
