#include <Arduino.h>
#include "esp_camera.h"
#include <WiFi.h>
#include <WebServer.h>

#define CAMERA_MODEL_AI_THINKER
#include "camera_pins.h"

using namespace std;
 
const char* ssid = "aiSightESP32";
 
WebServer server(80);
 
// captures frames from ESP32-CAM and streams them as JPEG, the image data is updated constantly as each frame comes in
void handle_jpg_stream() {
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
  size_t _jpg_buf_len = 0;
  uint8_t * _jpg_buf = NULL;
  char part_buf[64];
   
  String response = 
    "HTTP/1.1 200 OK\r\n"
    "Content-Type: multipart/x-mixed-replace; boundary=frame\r\n\r\n";
   
  server.client().write(response.c_str(), response.length());
 
  while(true) {
    fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      break;
    }
    if(fb->format != PIXFORMAT_JPEG){
      bool jpeg_converted = frame2jpg(fb, 80, &_jpg_buf, &_jpg_buf_len);
      esp_camera_fb_return(fb);
      if(!jpeg_converted){
        Serial.println("JPEG compression failed");
        break;
      }
    } else {
      _jpg_buf_len = fb->len;
      _jpg_buf = fb->buf;
    }
 
    size_t hlen = snprintf(part_buf, 64, "--frame\r\nContent-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n", _jpg_buf_len);
    server.client().write(part_buf, hlen);
    server.client().write((const char *)_jpg_buf, _jpg_buf_len);
    server.client().write("\r\n", 2);
 
    if(fb->format != PIXFORMAT_JPEG){
      free(_jpg_buf);
    }
    esp_camera_fb_return(fb);
 
    if(!server.client().connected()){
      break;
    }
  }
}
 
// starts the camera server with a welcome message at / and the stream at /stream
void startCameraServer() {
  server.on("/", HTTP_GET, [](){
    server.send(200, "text/plain", "ESP32-CAM Video Streaming");
  });
 
  server.on("/stream", HTTP_GET, handle_jpg_stream);
 
  server.begin();
}
 
void beginStreaming(char* password) {
  // Serial.begin(115200);
  // Serial.setDebugOutput(true);
  // Serial.println();
 
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
 
  if(psramFound()){
    // config.frame_size = FRAMESIZE_UXGA;
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    // config.frame_size = FRAMESIZE_SVGA;
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }
 
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
 
  // This code will attempt to connect to an existing network! I'm leaving it here to revisit this approach later
  // WiFi.begin(ssid, password);
 
  // while (WiFi.status() != WL_CONNECTED) {
  //   delay(500);
  //   Serial.print(".");
  // }
  // Serial.println("");
  // Serial.println("WiFi connected");
 
  // startCameraServer();
 
  // Serial.print("Camera Ready! Use 'http://");
  // Serial.print(WiFi.localIP());
  // Serial.println("/stream' to connect");
 
  WiFi.softAP(ssid, password);
 
  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);
 
  startCameraServer();
 
  Serial.print("Camera Ready! Use 'http://");
  Serial.print(IP);
  Serial.println("/stream' to connect");
}

void handleClient() {
  server.handleClient();
}