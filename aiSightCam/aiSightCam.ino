#include <BLE.h>
#include <cam.h>
using namespace std;


/* OUTLINE
  On start, the ESP32 will advertise Bluetooth to make it discoverable to nearby devices
  After succesfully connecting to a device, it will generate a password for a network it will create
  Once it has succesfully communicated with the connected device, it will close the BLE connection

  Once the connection has been properly closed, the ESP32 will begin hosting its network with the generated credentials
  On the network, the data from the camera is communicated via HTTP request

  The ESP32 will keep broadcasting over network until it is reset/turned off and on again
*/

void setup() {
  // randomly generate a password to send to initBLE
  String password = "";
  initBLE(password);
  beginStreaming();
  
}

void loop() {
  handleClient();
}