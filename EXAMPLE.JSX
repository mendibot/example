import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import KaotikaText from '../components/KaotikaText';
import QRCodeStyled from 'react-native-qrcode-styled';

const QRContent = ({ QRValue }) => {
  return (
    <QRCodeStyled
    data={"SOCKET ID"} //QRValue add later !!!!!
    style={styles.svg}
    padding={20}
    pieceSize={8}
    pieceBorderRadius={4}
    gradient={{
      type: 'radial',
      options: {
        center: [0.5, 0.5],
        radius: [1, 1],
        colors: ['#ff7bc6', '#0f0080'],
        locations: [0, 1],
      },
    }}
    outerEyesOptions={{
      topLeft: {
        borderRadius: [20, 20, 0, 20],
      },
      topRight: {
        borderRadius: [20, 20, 20],
      },
      bottomLeft: {
        borderRadius: [20, 0, 20, 20],
      },
    }}
    innerEyesOptions={{
      borderRadius: 12,
      scale: 0.85,
    }}
  />
  );
};

const ErrorContent = () => (
  <KaotikaText style={styles.errorText}>
    There has been an error reading the 'socketId' value. Please try restarting the application.
  </KaotikaText>
);

function QRScreen() {
  // Simulate getting the socketId (Replace with actual context value)
  let socketId = 'REPLACE_BY_SOCKET_CONTEXT';
  return (
    <ImageBackground
      source={require('../assets/img/Acolyte.png')} // Your cool monster-themed background
      style={styles.background}
    >
      <View style={styles.container}>
        <KaotikaText style={styles.titleText}>Scan the QR Code!</KaotikaText>
        {socketId ? <QRContent QRValue={socketId} /> : <ErrorContent />}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensure the image covers the screen
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    color: 'white',
    fontSize: 40,
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  qrContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrWrapper: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#222', // Dark background for the QR code
    shadowColor: '#0f0', // Neon-like glow effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default QRScreen;