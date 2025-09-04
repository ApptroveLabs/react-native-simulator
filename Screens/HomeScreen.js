// screens/HomeScreen.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';


const HomeScreen = ({ navigation, deferredDeeplinkUri }) => {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        {/* Trackier Logo */}
        <Image
          source={require('../assets/trackierlogo.png')} // Replace with your actual asset path
          style={styles.logo}
          resizeMode="cover"
        />
      </View>

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>
        Welcome to UniLink Simulator
      </Text>

      {/* Navigation Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BuiltInEvent')}
      >
        <Text style={styles.buttonText}>Built-in Events</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CustomEvent')}
      >
        <Text style={styles.buttonText}>Custom Events</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DeepLinkScreen')}
      >
        <Text style={styles.buttonText}>Deep Linking Page</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DynamicLinkScreen')}
      >
        <Text style={styles.buttonText}>Dynamic Link & Resolver</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProductPage')}
      >
        <Text style={styles.buttonText}>Product Page</Text>
      </TouchableOpacity>
      
      {/* Deferred Deeplink Display */}
      <View style={styles.deferredContainer}>
        <Text style={styles.deferredTitle}>Deferred Deeplink Value:</Text>
        <Text style={styles.deferredValue}>
          {deferredDeeplinkUri 
            ? (typeof deferredDeeplinkUri === 'object' 
                ? JSON.stringify(deferredDeeplinkUri, null, 2)
                : deferredDeeplinkUri)
            : 'No deferred deeplink received yet'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container spans the full height of the screen
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  logo: {
    width: '250',
    height: 50,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deferredContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    width: '100%',
  },
  deferredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  deferredValue: {
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});

export default HomeScreen;
