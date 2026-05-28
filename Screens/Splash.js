import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkSessionAndNavigate = async () => {
      try {
        const onboardingSeen = await AsyncStorage.getItem('onboardingSeen');
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

        setTimeout(() => {
          if (isLoggedIn === 'true') {
            navigation.replace('Home');
          } else if (onboardingSeen === 'true') {
            navigation.replace('Login');
          } else {
            navigation.replace('Onboarding');
          }
        }, 3000);
      } catch (error) {
        console.error('Session check failed:', error);
        setTimeout(() => navigation.replace('Onboarding'), 3000);
      }
    };

    checkSessionAndNavigate();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/app_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>React Market</Text>
        <Text style={styles.subtitle}>Premium E-Commerce Experience</Text>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#4f46e5" style={styles.loader} />
        <Text style={styles.footerText}>Powered by AppTrove SDK</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    color: '#0f172a',
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    width: '100%',
  },
  loader: {
    marginBottom: 12,
  },
  footerText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});

export default SplashScreen;
