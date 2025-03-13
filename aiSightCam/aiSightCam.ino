#include <BLEHandler.h>
#include <camHandler.h>

/* OUTLINE
ESP32 will randomly generate a password for each session, ensuring security on the network
Upon succesful BLE connectoin, ESP32 will send the password to the connected device

*/

void setup() {
  beginStreaming();
  // initBLE("TheGreatestPasswordEver");
}

void loop() {
  handleClient();
}