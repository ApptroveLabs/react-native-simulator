import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Navigate to Home screen after a delay
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/app_logo.png')} // Replace with actual path
        style={styles.logo}
        resizeMode="cover"
      />
      <Text style={styles.title}>Trackier Simulator</Text>
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#808080',
    marginBottom: 20,
  },
});

export default SplashScreen;
