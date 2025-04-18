#include <Arduino.h>
#include "BLE.h"
#include "cam.h"

/* OUTLINE
  On start, the ESP32 will advertise Bluetooth to make it discoverable to nearby devices
  After succesfully connecting to a device, it will generate a password for a network it will create
  Once it has succesfully communicated with the connected device, it will close the BLE connection

  Once the connection has been properly closed, the ESP32 will begin hosting its network with the generated credentials
  On the network, the data from the camera is communicated via HTTP request

  The ESP32 will keep broadcasting over network until it is reset/turned off and on again
*/

void setup() {
  Serial.begin(115200);
  Serial.println("starting program");

  string password = initBLE();
  char* passBuffer = new char[password.length() + 1];
  strcpy(passBuffer, password.c_str());


  Serial.println("bluetooth initalized");
  while(!passwordSent) {delay(10);} // wait for the password to be sent before doing the following
  delay(500);
  disconnectBLE();

  Serial.println("Finished sending password!");
  delay(10000);
  beginStreaming(passBuffer);
}

void loop() {
  handleClient();
}