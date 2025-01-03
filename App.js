import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';
import { TrackierConfig, TrackierSDK } from 'react-native-trackier';
import queryString from 'query-string';

import Constants from './Screens/constants';

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

const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [deepLinkParams, setDeepLinkParams] = useState(null);
  const [navigateToCake, setNavigateToCake] = useState(false);

  useEffect(() => {
    const trackierConfig = new TrackierConfig(
      process.env.TRDEVKEY,
      TrackierConfig.EnvironmentProduction
    );

    trackierConfig.setAppSecret(process.env.SECRETKEY, process.env.SECRETID);
    TrackierSDK.setUserId("89992839923927");
    TrackierSDK.setUserEmail("satyam@trackier.com");
    TrackierSDK.setUserName("Satyam_React");
    TrackierSDK.setUserPhone("8252786831");

    // Initialize Trackier SDK
    TrackierSDK.initialize(trackierConfig);

    // Deep link listener
    const deepLinkListener = Linking.addEventListener('url', handleDeepLink);

    // Check for an initial deep link when the app is first opened
    const initDeepLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink({ url: initialUrl });
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
        // Parse query parameters using query-string
        const parsedParams = queryString.parseUrl(url).query;

        const productId = parsedParams.product_id || 'default';
        const quantity = parsedParams.quantity || 1;
        const actionData = parsedParams.actionData || 'noAction';
        const dlv = parsedParams.dlv || 'noDelivery';

        setDeepLinkParams({
          product_id: productId,
          quantity: quantity,
          actionData: actionData,
          dlv: dlv,
        });

        setNavigateToCake(true); // Trigger navigation to CakeScreen

        console.debug("Deep link URL: ", url);
        console.debug("Parsed parameters: ", { productId, quantity, actionData, dlv });
      } catch (error) {
        console.error("Error parsing deep link:", error);
        setDeepLinkParams(null); // Reset on error
      }
    } else {
      setDeepLinkParams(null);
    }
  };

  return (
    <NavigationContainer>
      {navigateToCake && deepLinkParams ? (
        <Stack.Navigator>
          <Stack.Screen name="CakeScreen">
            {props => <CakeScreen {...props} route={{ params: deepLinkParams }} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName={initializing ? "Splash" : "Home"}>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="BuiltInEvent" component={BuildInEvent} />
          <Stack.Screen name="CustomEvent" component={CustomEvent} />
          <Stack.Screen name="ProductPage" component={ProductPage} />
          <Stack.Screen name="AddtoCart" component={AddtoCart} />
          <Stack.Screen name="DeepLinkScreen" component={DeepLinkScreen} />
          <Stack.Screen name="CakeScreen">
            {props => <CakeScreen {...props} route={{ params: deepLinkParams }} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
