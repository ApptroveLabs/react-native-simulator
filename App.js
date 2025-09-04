import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';
import { TrackierConfig, TrackierSDK } from 'react-native-trackier';
import queryString from 'query-string';
import { TRDEVKEY, SECRETID, SECRETKEY } from 'react-native-dotenv';
import { resolvePlugin } from '@babel/core';

// Import the screens
import SplashScreen from './Screens/Splash';
import HomeScreen from './Screens/HomeScreen';
import DetailsScreen from './Screens/DetailsScreen';
import BuildInEvent from './Screens/BuildInEvent';
import CustomEvent from './Screens/Customevent';
import ProductPage from './Screens/ProductPage';
import AddtoCart from './Screens/AddtoCartScreen';
import CakeScreen from './Screens/CakeScreen';
import DeepLinkScreen from './Screens/DeepLinkScreen'
import DynamicLinkScreen from './Screens/DynamicLinkScreen'

const Stack = createNativeStackNavigator();

const App = () => {
  const navigationRef = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [deepLinkParams, setDeepLinkParams] = useState(null);
  const [navigateToCake, setNavigateToCake] = useState(false);
  const [deferredDeeplinkUri, setDeferredDeeplinkUri] = useState(null);

  useEffect(() => {
    try {
      console.log('TRDEVKEY:', TRDEVKEY);
      console.log('SECRETID:', SECRETID);
      console.log('SECRETKEY:', SECRETKEY);
      
      if (!TRDEVKEY || !SECRETID || !SECRETKEY) {
        console.error('Trackier SDK credentials are missing! Please check your .env file.');
        setInitializing(false);
        return;
      }

      TrackierSDK.parseDeepLink("https://trackier58.u9ilnk.me/d/g5Hizea0AX");

    const trackierConfig = new TrackierConfig(
      TRDEVKEY,
      TrackierConfig.EnvironmentProduction
    );

    trackierConfig.setDeferredDeeplinkCallbackListener(function(uri) {
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
        
        // Check if it's a cake-related URL
        if (urlString && urlString.includes('product_id') && urlString.includes('quantity')) {
          console.log("🎂 Cake deeplink detected, processing...");
          handleDeepLink({ url: urlString });
        } else {
          console.log("📱 Non-cake deeplink received:", urlString);
        }
      }
    });

    trackierConfig.setFacebookAppId("FbTest123");  // For Android Only
    trackierConfig.setAndroidId("AndroidTest123");  // For Android only
    trackierConfig.setAppSecret(SECRETKEY, SECRETID);
    
    TrackierSDK.setUserId("89992839923927");
    TrackierSDK.setUserEmail("satyam@trackier.com");
    TrackierSDK.setUserName("Satyam_React");
    TrackierSDK.setUserPhone("8252786831");

    // Initialize Trackier SDK
    TrackierSDK.initialize(trackierConfig);
    console.log('Trackier SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Trackier SDK:', error);
  }

    // Deep link listener
    const deepLinkListener = Linking.addEventListener('url', handleDeepLink);

    // Check for an initial deep link when the app is first opened
    const initDeepLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink({ url: initialUrl });
          TrackierSDK.parseDeepLink(initialUrl);
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

  // Effect to handle navigation to CakeScreen
  useEffect(() => {
    if (navigateToCake && deepLinkParams && navigationRef.current) {
      console.log(" Navigating to CakeScreen...");
      navigationRef.current.navigate('CakeScreen', deepLinkParams);
      setNavigateToCake(false); // Reset the flag
    }
  }, [navigateToCake, deepLinkParams]);

  const handleDeepLink = ({ url }) => {
    if (url) {
      try {
        console.log(" Processing deep link URL:", url);
        
        // Parse query parameters using query-string
        const parsedParams = queryString.parseUrl(url).query;
        console.log(" Parsed parameters:", parsedParams);

        const productId = parsedParams.product_id || 'default';
        const quantity = parsedParams.quantity || 1;
        const actionData = parsedParams.actionData || 'noAction';
        const dlv = parsedParams.dlv || 'noDelivery';

        console.log(" Cake parameters detected:");
        console.log("  - Product ID:", productId);
        console.log("  - Quantity:", quantity);
        console.log("  - Action Data:", actionData);
        console.log("  - DLV:", dlv);

        setDeepLinkParams({
          product_id: productId,
          quantity: quantity,
          actionData: actionData,
          dlv: dlv,
          deferredDeeplinkUri: deferredDeeplinkUri,
        });

        console.log("Setting navigation to CakeScreen...");
        setNavigateToCake(true); // Trigger navigation to CakeScreen

        console.log("Deep link processed successfully");
      } catch (error) {
        console.error(" Error parsing deep link:", error);
        setDeepLinkParams(null); // Reset on error
      }
    } else {
      console.log("⚠️ No URL provided to handleDeepLink");
      setDeepLinkParams(null);
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initializing ? "Splash" : "Home"}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Home">
            {props => <HomeScreen {...props} deferredDeeplinkUri={deferredDeeplinkUri} />}
          </Stack.Screen>
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="BuiltInEvent" component={BuildInEvent} />
        <Stack.Screen name="CustomEvent" component={CustomEvent} />
        <Stack.Screen name="ProductPage" component={ProductPage} />
        <Stack.Screen name="AddtoCart" component={AddtoCart} />
        <Stack.Screen name="DeepLinkScreen" component={DeepLinkScreen} />
        <Stack.Screen name="DynamicLinkScreen" component={DynamicLinkScreen} />
                  <Stack.Screen name="CakeScreen" component={CakeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
