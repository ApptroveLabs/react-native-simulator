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
import { TRDEVKEY, TRDEVKEY_IOS, TRDEVKEY_ANDROID } from 'react-native-dotenv';

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
  const pendingProductIdRef = useRef(null);

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
        const devKey = Platform.OS === 'ios' ? TRDEVKEY_IOS : TRDEVKEY_ANDROID;


        if (!devKey) {
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
          devKey,
          ApptroveConfig.EnvironmentDevelopment
        );

        apptroveConfig.setDeferredDeeplinkCallbackListener(function (deepLinkData) {
          console.log("Deferred Deeplink Callback received");
          console.log("DeepLink Data: " + JSON.stringify(deepLinkData));
          
          if (deepLinkData) {
            // Store the deferred deeplink URL string
            const urlString = typeof deepLinkData === 'string' ? deepLinkData : deepLinkData.url;
            setDeferredDeeplinkUri(urlString || null);

            // Process the deferred deeplink using the complete data object
            handleDeepLink(deepLinkData);
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

          // Call subscribeAttributionlink for iOS only after initialization
          if (Platform.OS === 'ios') {
            ApptroveSDK.subscribeAttributionlink();
            console.log('AppTrove SDK subscribeAttributionlink called for iOS');
          }
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
    const deepLinkListener = Linking.addEventListener('url', (event) => {
      if (event && event.url) {
        console.log("Deep link event received:", event.url);
        handleDeepLink(event.url);
        console.log("Calling ApptroveSDK.parseDeepLink with URL:", event.url);
        ApptroveSDK.parseDeepLink(event.url);
      }
    });

    // Check for an initial deep link when the app is first opened
    const initDeepLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log("Initial URL detected:", initialUrl);
          handleDeepLink(initialUrl);
          console.log("Calling ApptroveSDK.parseDeepLink with initial URL:", initialUrl);
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

  const handleDeepLink = (data) => {
    if (!data) {
      console.log("No deep link data provided to handleDeepLink");
      return;
    }

    try {
      console.log("Handling deep link with data:", JSON.stringify(data));
      
      let url = "";
      if (typeof data === 'string') {
        url = data;
      } else if (typeof data === 'object') {
        url = data.url || "";
      }

      let productId = null;

      // 1. Check direct properties & sdkParams from SDK callback first
      if (typeof data === 'object' && data !== null) {
        // Check deepLinkValue mapping
        if (data.deepLinkValue === 'product' && data.p1) {
          productId = parseInt(data.p1);
        } else if (data.deepLinkValue && !isNaN(parseInt(data.deepLinkValue))) {
          productId = parseInt(data.deepLinkValue);
        }
        
        // Check sdkParams (which holds productId in the provided callback payload)
        if (!productId && data.sdkParams) {
          if (data.sdkParams.productId) {
            productId = parseInt(data.sdkParams.productId);
          } else if (data.sdkParams.product_id) {
            productId = parseInt(data.sdkParams.product_id);
          }
        }
        
        // Check direct key fields
        if (!productId) {
          if (data.productId) {
            productId = parseInt(data.productId);
          } else if (data.product_id) {
            productId = parseInt(data.product_id);
          }
        }
      }

      // 2. Fallback: Parse query parameters from the URL if productId not set yet
      if (!productId && url) {
        const parsedParams = queryString.parseUrl(url).query;
        console.log("Parsed query parameters from URL:", parsedParams);
        if (parsedParams.productId) {
          productId = parseInt(parsedParams.productId);
        } else if (parsedParams.product_id) {
          productId = parseInt(parsedParams.product_id);
        }
      }

      // 3. Store and trigger navigation if productId is found
      if (productId) {
        console.log("Product ID detected for redirection:", productId);
        pendingProductIdRef.current = productId;
        triggerPendingNavigation();
      }
    } catch (error) {
      console.error("Error processing deep link:", error);
    }
  };

  const triggerPendingNavigation = () => {
    if (pendingProductIdRef.current && navigationRef.current && navigationRef.current.isReady()) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      console.log("triggerPendingNavigation - Current Route:", currentRoute?.name);

      // List of screens where we should NOT interrupt with deep link redirection
      const guestRoutes = ['Splash', 'Onboarding', 'Login', 'Signup'];

      if (currentRoute?.name && !guestRoutes.includes(currentRoute.name)) {
        const targetId = pendingProductIdRef.current;
        console.log("Navigating from pending deep link to product ID:", targetId);
        
        const { products } = require('./data/products');
        const product = products.find(p => p.id === targetId);
        
        if (product) {
          // Clear pending ID before navigating to prevent loops
          pendingProductIdRef.current = null;
          navigationRef.current.navigate('ProductDetail', { product });
        } else {
          console.log("Product not found with ID:", targetId);
          pendingProductIdRef.current = null;
          navigationRef.current.navigate('Home');
        }
      } else {
        console.log("App is still in onboarding/auth flow, holding deep link navigation.");
      }
    }
  };

  return (
    <SafeAreaProvider>
      <CartProvider>
        <WishlistProvider>
          <NavigationContainer 
            ref={navigationRef}
            onStateChange={() => {
              console.log("Navigation state changed, checking for pending deep link...");
              triggerPendingNavigation();
            }}
          >
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
