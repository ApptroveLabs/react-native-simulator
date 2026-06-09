import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
import AppTroveEvents from '../data/AppTroveEvents';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / width);
    setActiveIndex(index);
  };

  const handleNext = async () => {
    if (activeIndex < 2) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * width,
        animated: true,
      });
      setActiveIndex(activeIndex + 1);
    } else {
      await handleFinish();
    }
  };

  const handleSkip = async () => {
    await handleFinish();
  };

  const handleFinish = async () => {
    try {
      // Track onboarding completion in AppTrove SDK
      const event = new ApptroveEvent(AppTroveEvents.ONBOARDING);
      event.param1 = 'walkthrough_completed';
      ApptroveSDK.trackEvent(event);

      // Save onboarding seen status
      await AsyncStorage.setItem('onboardingSeen', 'true');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      navigation.replace('Login');
    }
  };

  const slides = [
    {
      icon: 'bag-handle-outline',
      title: 'Discover Products',
      subtitle: 'Explore thousands of premium products at your fingertips.',
    },
    {
      icon: 'rocket-outline',
      title: 'Fast Delivery',
      subtitle: 'Enjoy lightning-fast shipping right to your doorstep.',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Expert Support',
      subtitle: 'Our customer support team is available 24/7 to help you.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button (top-right) */}
      <View style={styles.header}>
        {activeIndex < 2 ? (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 20 }} />
        )}
      </View>

      {/* Pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollContainer}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.iconContainer}>
              <Icon name={slide.icon} size={130} color="#4f46e5" />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer Controls */}
      <View style={styles.footer}>
        {/* Dot Indicators */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity onPress={handleNext} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            {activeIndex === 2 ? 'Start Shopping' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Slate 50
  },
  header: {
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#64748b', // Slate 500
    fontWeight: '700',
  },
  scrollContainer: {
    flex: 1,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#eef2ff', // Indigo 50
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a', // Slate 900
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b', // Slate 500
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 30,
    backgroundColor: '#4f46e5', // Indigo 600
  },
  inactiveDot: {
    width: 10,
    backgroundColor: '#cbd5e1', // Slate 300
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#4f46e5', // Indigo 600
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default OnboardingScreen;
