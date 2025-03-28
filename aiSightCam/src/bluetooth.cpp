#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <string.h>
#include <random>

using namespace std;

// Generates a random password
string generatePassword(); // Generates a random password
string initBLE(); // Initalizes BLE server and its characteristics with a random password
void disconnectBLE();

// UUIDs for BLE Service and Characteristics
#define SERVICE_UUID "bd2ffd83-7385-440c-880d-b20f78825585"
#define SSID_CHAR_UUID "5629f669-08d5-43b6-a2f6-f69d249f628b"
#define PASS_CHAR_UUID "f6e2e6c0-c178-4b1d-8c91-d1d3bc2617cb"

// Flag for when the server is on
volatile bool passwordSent = false;

// Initalize pServer globally
BLEServer* pServer = nullptr;

// The Callbacks class is used to determine the state of the server and its characteristics
class Callbacks: public BLECharacteristicCallbacks {
  public:
    BLEServer* pServer;
    Callbacks(BLEServer* server): pServer(server) {}

    // Once the password characteristic is read, completely deinitalize the BLE sever.
    void onRead(BLECharacteristic* pPassword) {
      passwordSent = true;
    }
};

string initBLE() { 
  BLEDevice::init("aiSight Camera");

  // Initalize Server
  pServer = BLEDevice::createServer();
  BLEService* pService = pServer->createService(SERVICE_UUID);
  BLEAdvertising* pAdvertiser = pServer->getAdvertising();

  // Initalize SSID and Password
  BLECharacteristic* pSSID = pService->createCharacteristic(SSID_CHAR_UUID, BLECharacteristic::PROPERTY_READ);
  BLECharacteristic* pPassword = pService->createCharacteristic(PASS_CHAR_UUID, BLECharacteristic::PROPERTY_READ);
  pSSID->setValue("aiSightESP32");
  pSSID->setReadProperty(true);
  pSSID->setWriteProperty(false);
  string password = generatePassword().c_str();
  pPassword->setValue(password);
  pPassword->setReadProperty(true);
  pPassword->setWriteProperty(false);

  // Start the service
  pService->start();

  // Set the password callback up
  pPassword->setCallbacks(new Callbacks(pServer));

  // Begin advertising
  BLEAdvertisementData pAdvdata;
  pAdvdata.setName("aiSight Camera");
  pAdvdata.setCompleteServices(pService->getUUID());
  pAdvertiser->setAdvertisementData(pAdvdata);
  pAdvertiser->start();
  Serial.println("Enabling BLE");

  return password;
}

void disconnectBLE() {
  pServer->disconnect(0);
  pServer->getAdvertising()->stop();
  Serial.println("Disabling BLE");
  BLEDevice::deinit(true);
}

string generatePassword() {
  const string characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  const size_t length = 24;
  string password;
  password.reserve(length);

  for (size_t i = 0; i < length; ++i) {
      int randomIndex = esp_random() % characters.size();
      password += characters[randomIndex];
  }

  return password;
}