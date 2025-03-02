  
  //this in topicHandler.js
  
  ///////////////////////////////////////////////////////////////////////
  const { findPlayerByIdCard } = require('../database/Player');

function subscribe(mqttClient, topic, io) {
  mqttClient.subscribe(topic, (err) => {
    if (err) {
      console.error(`Failed to subscribe to topic ${topic}:`, err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });

  // Listen for messages on the subscribed topic
  mqttClient.on('message', async (receivedTopic, message) => {
    if (receivedTopic === topic) {
      const cardId = message.toString();

      try {
        // Retrieve player data using the cardId
        const playerData = await findPlayerByIdCard(cardId);

        if (playerData) {
          // Emit success response via Socket.IO if access is granted
          io.to(playerData.socketId).emit("accessGranted", { player: playerData });
          console.log(`Access granted to player: ${playerData.name}`);

          // Publish "open door" message to MQTT topic
          mqttClient.publish('action/openDoor', JSON.stringify({ action: 'open' }), (err) => {
            if (err) {
              console.error("Failed to publish 'open door' action:", err);
            } else {
              console.log("Published 'open door' action to MQTT");
            }
          });
            
        } else {
          // Emit access denied message if no player found with the provided cardId
          io.emit("accessDenied", { message: "Access denied: No player with this ID card." });
          console.log(`Access denied for cardId: ${cardId}`);
        }
      } catch (error) {
        console.error("Error retrieving player data:", error);
        io.emit("error", { message: "An error occurred while retrieving player data." });
      }
    }
  });
}

module.exports = { subscribe };


///////////////////////////////// and then another one with subscription to doorStatus whcih if message is 'opened', checks if the acolyte with that idCard isInsideTower is true or false, if its false, socketemit to acolyte to change isInsideTower to true that way changes the screen according to that and also do a patch in DB isInsideTower to true as well and also publich acton close door. If isInideTower true then acolyte is exiting and do all oposyte asf.

////also un sub constante a todo esto en el que la puerta tiene que estar cerrada para empezar con todas estas funciones.

const { findPlayerByIdCard } = require('../database/Player');
const io = require('socket.io')(YOUR_SERVER_INSTANCE); // Ensure you have socket.io set up

const toggleIsInsideLabByEmail = async (emailFilter) => {
  try {
    // Use findOneAndUpdate to check isInsideTower and update isInsideLab if necessary
    const updatedPlayer = await Player.findOneAndUpdate(
      { email: emailFilter, isInsideTower: false }, // Find the player by email and ensure isInsideTower is false
      { isInsideLab: true }, // Set isInsideLab to true
      { new: true } // Return the updated document
    );

    // Handle the case where the player was not found or is already inside the tower
    if (!updatedPlayer) {
      console.log(`Player with email ${emailFilter} is already inside the tower or not found.`);
      return null; // Return null to indicate no update was made
    }

    // Log the updated value
    console.log(`Player with email ${emailFilter} has toggled isInsideLab to ${updatedPlayer.isInsideLab}`);

    // Emit the new value to the client
    io.emit('updatePlayerStatus', {
      email: updatedPlayer.email,
      isInsideLab: updatedPlayer.isInsideLab
    });

    return updatedPlayer;
  } catch (error) {
    console.log(`Error toggling isInsideLab for player with email ${emailFilter}:`, error);
    throw error; // Re-throw the error for further handling
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <PubSubClient.h>
#include "config/wifiConfig.h"
#include "MQTT/mqttHandler.h"
#include "RFID/rfidHandler.h"

#define SS_PIN 21
#define RST_PIN 22
#define MOSI_PIN 23
#define MISO_PIN 19
#define SCK_PIN 18

WiFiClient espClient;
PubSubClient client(espClient);
MFRC522 rfid(SS_PIN, RST_PIN);

void setup()
{
    Serial.begin(115200);
    setupWiFi();
    setupMQTT(client);
    setupRFID(rfid);
}

void loop()
{
    if (!client.connected())
    {
        mqttReconnect(client);
    }
    client.loop();

    String cardID;
    if (readRFIDCard(rfid, cardID))
    {
        client.publish("idCard", cardID.c_str());
    }
}

void setupWiFi()
{
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Pin definitions
const int ledPin = 15;        // GPIO for LED
const int buzzerPin = 18;     // GPIO for Buzzer

void setup() {
  // Initialize Serial communication at 9600 baud rate
  Serial.begin(9600);

  // Set up LED and Buzzer pins
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  // Turn off LED and Buzzer initially
  digitalWrite(ledPin, LOW);
  digitalWrite(buzzerPin, LOW);
}

void loop() {
  // Check if data is available on Serial
  if (Serial.available() > 0) {
    // Read the incoming message
    String message = Serial.readStringUntil('\n');
    message.trim();  // Remove any extra whitespace or newline characters

    // Check if the received message is "OK"
    if (message.equalsIgnoreCase("OK")) {
      // Turn on the green LED
      digitalWrite(ledPin, HIGH);

      // Play a short sound with the buzzer
      tone(buzzerPin, 1000);  // Start a 1kHz tone
      delay(200);             // Sound duration
      noTone(buzzerPin);      // Stop tone

      // Keep the LED on for a short duration, then turn it off
      delay(500);             // LED duration
      digitalWrite(ledPin, LOW);
    }
  }
}

