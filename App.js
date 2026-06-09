import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApptroveConfig, ApptroveSDK } from 'react-native-apptrove';
import { getAttributionToken } from 'react-native-attribution-token';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import { getApp, getApps } from '@react-native-firebase/app';
import queryString from 'query-string';
import { TRDEVKEY } from 'react-native-dotenv';

// Import the Cart Provider context
import { CartProvider } from './data/CartManager';
// Import the Wishlist Provider context
import { WishlistProvider } from './data/WishlistManager';

// Import the screens
import SplashScreen from './Screens/Splash';
import HomeScreen from './Screens/HomeScreen';
import AddtoCart from './Screens/AddtoCartScreen';

// E-commerce screens
import OnboardingScreen from './Screens/OnboardingScreen';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import ProductDetailScreen from './Screens/ProductDetailScreen';
import WishlistScreen from './Screens/WishlistScreen';
import OrderConfirmationScreen from './Screens/OrderConfirmationScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const navigationRef = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [deferredDeeplinkUri, setDeferredDeeplinkUri] = useState(null);

  // Initialize FCM - Android only, send token to Trackier on refresh
  const initializeFCM = async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      const apps = getApps();
      if (apps.length === 0) {
        return;
      }

      const app = getApp();
      const messagingInstance = messaging(app);

      const authStatus = await messagingInstance.requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        messagingInstance.onTokenRefresh((newToken) => {
          console.log('FCM token refreshed:', newToken);
          ApptroveSDK.sendFcmToken(newToken);
        });
      }
    } catch (error) {
      console.log('Error initializing FCM:', error);
    }
  };

  // Initialize APNS - iOS only, send token to Trackier
  const initializeAPNS = async () => {
    if (Platform.OS !== 'ios') {
      return;
    }

    try {
      // Must register for remote messages BEFORE getting the token
      await messaging().registerDeviceForRemoteMessages();

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // For iOS, we need the APN token specifically for Trackier
        const apnsToken = await messaging().getAPNSToken();
        if (apnsToken) {
          console.log('APN Token retrieved successfully:', apnsToken);
          ApptroveSDK.sendAPNToken(apnsToken);
          console.log('APN Token sent to AppTrove SDK');
        } else {
          console.log('APN Token is null (may be normal if push notifications are not configured yet)');
        }
      }
    } catch (error) {
      console.log('Error initializing APNS:', error);
    }
  };

  // Function to request ATT permission (React-side only)
  const requestATTPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        console.log('Requesting ATT (App Tracking Transparency) permission...');

        try {
          // Request ATT permission using react-native-permissions
          const result = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);

          console.log('ATT permission result:', result);

          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log('ATT is not available on this device');
              break;
            case RESULTS.DENIED:
              console.log('ATT permission denied');
              break;
            case RESULTS.BLOCKED:
              console.log('ATT permission blocked');
              break;
            case RESULTS.GRANTED:
              console.log('ATT permission granted');
              break;
            case RESULTS.LIMITED:
              console.log('ATT permission limited');
              break;
          }

          return result;
        } catch (error) {
          console.log('Error requesting ATT permission:', error);
          return null;
        }
      } else {
        console.log('ATT permission not applicable on Android');
        return null;
      }
    } catch (error) {
      console.log('Error in ATT permission flow:', error);
      return null;
    }
  };

  // Function to get Apple Ads token
  const getAppleAdsToken = async () => {
    try {
      // Only attempt to get token on iOS
      if (Platform.OS === 'ios') {
        console.log('Attempting to get Apple Ads token...');
        const token = await getAttributionToken();
        if (token) {
          console.log('Apple Ads Token retrieved successfully:', token);
        } else {
          console.log('Apple Ads Token is null (may be normal for simulator)');
        }
        return token;
      } else {
        console.log('Apple Ads Token not available on Android');
        return null;
      }
    } catch (error) {
      console.log('Error getting Apple Ads token:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        console.log('TRDEVKEY:', TRDEVKEY);
        if (!TRDEVKEY) {
          console.error('AppTrove SDK credentials are missing! Please check your .env file.');
          setInitializing(false);
          return;
        }

        // Request ATT permission and wait on iOS before SDK initialization
        if (Platform.OS === 'ios') {
          try {
            console.log('Requesting ATT permission before SDK initialization...');
            await requestATTPermission();
            // Wait for ATT user authorization with 20 second timeout
            console.log('Waiting for ATT user authorization (20 seconds timeout)...');
            if (ApptroveSDK && typeof ApptroveSDK.waitForATTUserAuthorization === 'function') {
              ApptroveSDK.waitForATTUserAuthorization(20);
              console.log('ATT wait completed');
            } else {
              console.log('waitForATTUserAuthorization method not available');
            }
          } catch (attError) {
            console.log('Error in ATT flow:', attError);
            // Continue with SDK initialization even if ATT fails
          }
        }

        const apptroveConfig = new ApptroveConfig(
          TRDEVKEY,
          ApptroveConfig.EnvironmentTesting
        );

        apptroveConfig.setDeferredDeeplinkCallbackListener(function (uri) {
          console.log("Deferred Deeplink Callback received");
          console.log("URL:", uri);

          // Store the deferred deeplink URI
          setDeferredDeeplinkUri(uri);

          // Process the deferred deeplink URL
          if (uri) {
            // Extract URL string from the object if it's an object
            let urlString = '';
            if (typeof uri === 'object' && uri !== null) {
              // If it's an object, try to get the URL from common properties
              urlString = uri.url || uri.deepLinkValue || uri.uri || JSON.stringify(uri);
              console.log("Extracted URL string:", urlString);
            } else if (typeof uri === 'string') {
              urlString = uri;
            }

            // Process the deeplink
            if (urlString) {
              console.log("Processing deferred deeplink:", urlString);
              handleDeepLink({ url: urlString });
            }
          }
        });

        apptroveConfig.setFacebookAppId("FbTest123");  // For Android Only
        apptroveConfig.setAndroidId("AndroidTest123");  // For Android only

        // Get Apple Ads token before initializing SDK
        try {
          const appleAdsToken = await getAppleAdsToken();
          if (appleAdsToken) {
            console.log('Updating AppTrove with Apple Ads token...');
            ApptroveSDK.updateAppleAdsToken(appleAdsToken);
            console.log('Apple Ads token updated in AppTrove SDK');
          } else {
            console.log('No Apple Ads token to update (normal for simulator or Android)');
          }
        } catch (tokenError) {
          console.log('Error handling Apple Ads token:', tokenError);
        }

        ApptroveSDK.setUserId("89992839923927");
        ApptroveSDK.setUserEmail("satyam@trackier.com");
        ApptroveSDK.setUserName("Satyam_React");
        ApptroveSDK.setUserPhone("8252786831");

        // Initialize AppTrove SDK
        try {
          ApptroveSDK.initialize(apptroveConfig);
          console.log('AppTrove SDK initialized successfully');

          // Parse deep link after SDK initialization
          ApptroveSDK.parseDeepLink("https://trackier58.u9ilnk.me/d/g5Hizea0AX");
        } catch (sdkError) {
          console.error('Error initializing AppTrove SDK:', sdkError);
        }

        // Initialize FCM after SDK initialization (important: SDK must be ready first)
        // Only initialize on Android
        if (Platform.OS === 'android') {
          try {
            await initializeFCM();
          } catch (fcmError) {
            console.log('Error initializing FCM:', fcmError);
          }
        }

        // Initialize APNS after SDK initialization on iOS
        if (Platform.OS === 'ios') {
          try {
            await initializeAPNS();
          } catch (apnsError) {
            console.log('Error initializing APNS:', apnsError);
          }
        }

        // Mark initialization as complete
        setInitializing(false);
      } catch (error) {
        console.error('Error initializing Trackier SDK:', error);
        setInitializing(false);
      }
    };

    initializeSDK();

    // Deep link listener
    const deepLinkListener = Linking.addEventListener('url', handleDeepLink);

    // Check for an initial deep link when the app is first opened
    const initDeepLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink({ url: initialUrl });
          ApptroveSDK.parseDeepLink(initialUrl);
        }
      } catch (error) {
        console.debug('Error fetching initial URL:', error);
      } finally {
        setInitializing(false);
      }
    };

    initDeepLink();

    // Cleanup listener on unmount
    return () => {
      deepLinkListener.remove();
    };
  }, []);

  const handleDeepLink = ({ url }) => {
    if (url) {
      try {
        console.log("Processing deep link URL:", url);

        // Parse query parameters using query-string
        const parsedParams = queryString.parseUrl(url).query;
        console.log("Parsed parameters:", parsedParams);

        // Check if it's a product deeplink
        if (parsedParams.product_id) {
          const productId = parseInt(parsedParams.product_id);
          console.log("Product deeplink detected, product ID:", productId);
          
          // Navigate to product detail if navigation is ready
          if (navigationRef.current) {
            // Import products to find the product
            const { products } = require('./data/products');
            const product = products.find(p => p.id === productId);
            
            if (product) {
              console.log("Navigating to product:", product.name);
              navigationRef.current.navigate('ProductDetail', { product });
            } else {
              console.log("Product not found with ID:", productId);
              navigationRef.current.navigate('Home');
            }
          }
        } else {
          console.log("No product_id found in deeplink, navigating to Home");
          if (navigationRef.current) {
            navigationRef.current.navigate('Home');
          }
        }

        console.log("Deep link processed successfully");
      } catch (error) {
        console.error("Error parsing deep link:", error);
      }
    } else {
      console.log("No URL provided to handleDeepLink");
    }
  };

  return (
    <SafeAreaProvider>
      <CartProvider>
        <WishlistProvider>
          <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {props => <HomeScreen {...props} deferredDeeplinkUri={deferredDeeplinkUri} />}
            </Stack.Screen>
            
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddtoCart" component={AddtoCart} options={{ headerShown: false }} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
        </WishlistProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
};

export default App;
