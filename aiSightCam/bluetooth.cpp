#include "BLE.h"
using namespace std;

// Generates a random password
string generatePassword();

// UUIDs for BLE Service and Characteristics
#define SERVICE_UUID "bd2ffd83-7385-440c-880d-b20f78825585"
#define SSID_CHAR_UUID "5629f669-08d5-43b6-a2f6-f69d249f628b"
#define PASS_CHAR_UUID "f6e2e6c0-c178-4b1d-8c91-d1d3bc2617cb"

// Initalize and start BLE Server and Service
BLEServer* pServer = BLEDevice::createServer();
BLEService* pService = BLEDevice::createService(SERVICE_UUID);

// Initalize SSID and Password
BLECharacteristic* pSSID = pService->createCharacteristic(SSID_CHAR_UUID, "aiSightCamera");
BLECharacteristic* pPassword = pService->createCharacteristic(PASS_CHAR_UUID, generatePassword());

int main(){
  return 0;
}

string generatePassword() {
    const string characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const size_t length = 24;  // Fixed length of the password
    random_device rd;  // Seed for the random number engine
    mt19937 generator(rd());  // Mersenne Twister engine
    uniform_int_distribution<> distribution(0, characters.size() - 1);

    string password;
    for (size_t i = 0; i < length; ++i) {
        password += characters[distribution(generator)];
    }

    return password;
    }

    return password;
  return string;
}