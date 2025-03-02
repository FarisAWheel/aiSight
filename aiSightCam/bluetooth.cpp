#include "BLEHandler.h"
using namespace std;

// UUIDs for BLE Service and Characteristics
#define SERVICE_UUID "bd2ffd83-7385-440c-880d-b20f78825585"
#define SSID_CHAR_UUID "5629f669-08d5-43b6-a2f6-f69d249f628b"
#define PASS_CHAR_UUID "f6e2e6c0-c178-4b1d-8c91-d1d3bc2617cb"

// Setup pointers for later use
BLEServer* pServer = NULL;
BLECharacteristic* ssidCharacteristic = NULL;
BLECharacteristic* passCharacteristic = NULL;
bool deviceConnected = false;

// The AdvertisementHandler class will set up starting or stoping advertising depending on connection status
class AdvertisementHandler: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("Device connected, terminating advertising");
      pServer->getAdvertising()->stop();
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("Device disconnecing, restarting advertising");
      pServer->getAdvertising()->start();
    }
};

// Initalizes the BLE Server, Service, Characteristics with password given in paraemeter
void initBLE(String password) {
  BLEDevice::init("aiSight");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new AdvertisementHandler());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Set up Characteristics
  ssidCharacteristic = pService->createCharacteristic(
                        SSID_CHAR_UUID,
                        BLECharacteristic::PROPERTY_READ
                      );

  passCharacteristic = pService->createCharacteristic(
                        PASS_CHAR_UUID,
                        BLECharacteristic::PROPERTY_READ
                      );

  ssidCharacteristic->setValue("aiSight");
  passCharacteristic->setValue(password);

  // Begin service and advertising
  pService->start();
  pServer->getAdvertising()->start();
  Serial.println("Waiting for a client connection...");
}