# Trackier SDK Integration - React Native Simulator App

## AppTrove React Native SDK Documentation

The AppTrove React Native SDK empowers developers to integrate advanced analytics and marketing capabilities into React Native applications for Android and iOS platforms. Designed for seamless tracking of user acquisition, in-app events, revenue, and deep links, this SDK enables precise campaign attribution and enhanced user engagement.

### Key Features

* **Attribution Tracking**: Accurately attribute app installs to specific marketing campaigns for detailed source analysis.
* **Event Tracking**: Capture built-in and custom events to gain insights into user behavior and interactions.
* **Revenue Tracking**: Track in-app revenue with currency support to evaluate monetization performance.
* **Deep Linking**: Support normal and deferred deep links to direct users to specific in-app content, improving engagement.
* **User Data Integration**: Pass user information (e.g., user ID, email) to enhance personalization and correlation with Trackier data.
* **SDK Signing**: Ensure request authenticity and data integrity with secret ID and key configurations.
* **Campaign Data Retrieval**: Access detailed campaign data (e.g., ad ID, campaign name) for personalized user experiences and analytics.
* **Uninstall Tracking**: Monitor app uninstalls on Android using Firebase integration for comprehensive user lifecycle tracking.

### Requirements

* React Native 0.60 or later
* Node.js and npm for package management
* For Android:  
   * Android API 21 (Android 5.0) or later  
   * Google Play Services Ads Identifier library (version 18.0.1 or later)
* For iOS:  
   * iOS 10.0 or later  
   * Xcode 12.0 or later  
   * CocoaPods for dependency management
* Trackier MMP account with access to SDK key
* Internet connection for downloading the SDK package

### Documentation Reference

For complete documentation and integration guides, visit: [AppTrove React Native SDK Documentation](https://developers.apptrove.com/docs/react-native-sdk/intro)

---

This document provides a comprehensive overview of the Trackier SDK integration in the React Native Simulator application, including all implemented features, event tracking, deep linking, and dynamic link functionality.

## Table of Contents
- [SDK Initialization](#sdk-initialization)
- [Event Tracking](#event-tracking)
- [Deep Link Handling](#deep-link-handling)
- [Dynamic Link Creation](#dynamic-link-creation)
- [Deferred Deep Link Resolution](#deferred-deep-link-resolution)
- [File Locations](#file-locations)
- [Configuration](#configuration)
- [Logging and Debugging](#logging-and-debugging)
- [Platform Support](#platform-support)
- [Usage Instructions](#usage-instructions)

## SDK Initialization

**Location**: `App.js`

The Trackier SDK is initialized in the main App component with comprehensive configuration:

```javascript
// SDK Configuration with environment variables
const trackierConfig = new TrackierConfig(
  TRDEVKEY,
  TrackierConfig.EnvironmentProduction
);

// Deferred deep link callback setup
trackierConfig.setDeferredDeeplinkCallbackListener(function(uri) {
  console.log("Deferred Deeplink Callback received");
  console.log("URL:", uri);
  // Process deep link data and navigate accordingly
});

// Platform-specific configurations
trackierConfig.setFacebookAppId("FbTest123");  // For Android Only
trackierConfig.setAndroidId("AndroidTest123");  // For Android only
trackierConfig.setAppSecret(SECRETKEY, SECRETID);

// User data setup
TrackierSDK.setUserId("89992839923927");
TrackierSDK.setUserEmail("satyam@trackier.com");
TrackierSDK.setUserName("Satyam_React");
TrackierSDK.setUserPhone("8252786831");

// Initialize Trackier SDK
TrackierSDK.initialize(trackierConfig);
```

**Key Features:**
- Environment variables for secure credential management
- Production environment configuration
- Deferred deep link listener setup
- Platform-specific configurations (Android/iOS)
- User data initialization
- Deep link parsing for initial app launch

## Event Tracking

### 1. Built-in Events
**Location**: `Screens/BuildInEvent.js`

Comprehensive built-in event tracking with dynamic parameters:

```javascript
// Available built-in events
const eventsList = [
  "ADD_TO_CART", "LEVEL_ACHIEVED", "ADD_TO_WISHLIST",
  "COMPLETE_REGISTRATION", "TUTORIAL_COMPLETION", "PURCHASE",
  "SUBSCRIBE", "START_TRIAL", "ACHIEVEMENT_UNLOCKED",
  "CONTENT_VIEW", "TRAVEL_BOOKING", "SHARE", "INVITE",
  "LOGIN", "UPDATE"
];

// Event tracking with revenue and parameters
const trackierEvent = new TrackierEvent(TrackierEvent.PURCHASE);
trackierEvent.revenue = revenueValue;
trackierEvent.currency = selectedCurrency;

// Dynamic parameter assignment (up to 10 parameters)
params.forEach((paramKey, index) => {
  if (paramValues[paramKey]) {
    trackierEvent[`param${index + 1}`] = paramValues[paramKey];
  }
});

TrackierSDK.trackEvent(trackierEvent);
```

**Features:**
- 15+ built-in event types
- Revenue tracking with 50+ currency support
- Dynamic parameter system (up to 10 parameters)
- User-friendly dropdown interface
- Real-time validation and feedback

### 2. Custom Events
**Location**: `Screens/Customevent.js`

Custom event tracking with flexible configuration:

```javascript
// Custom event with custom event ID
const trackierEvent = new TrackierEvent(eventId);
trackierEvent.revenue = revenueValue;
trackierEvent.currency = selectedCurrency;
trackierEvent.orderId = 'CustomOrder123';

// Custom parameters
params.forEach((paramKey, index) => {
  if (paramValues[paramKey]) {
    trackierEvent[`param${index + 1}`] = paramValues[paramKey];
  }
});

TrackierSDK.trackEvent(trackierEvent);
```

**Features:**
- Custom event ID support
- Revenue and currency tracking
- Order ID assignment
- Dynamic parameter system
- Input validation and error handling

### 3. Purchase Events
**Location**: `Screens/AddtoCartScreen.js`

Product purchase tracking with detailed parameters:

```javascript
const purchase = () => {
  var trackierEvent = new TrackierEvent("Q4YsqBKnzZ"); 
  
  trackierEvent.param1 = "Britannia Cupcake";
  trackierEvent.param2 = "Purchase Successfully";
  trackierEvent.couponCode = "@3030303di";
  trackierEvent.revenue = 30.0;
  trackierEvent.discount = 2.0;
  
  // Custom JSON data
  var jsonData = {"phone": "+91-8137872378", "name": "Satyam"};
  trackierEvent.ev = jsonData;
  
  TrackierSDK.trackEvent(trackierEvent);
  Alert.alert("Thanks for your purchase!");
};
```

**Features:**
- Product-specific event tracking
- Coupon code integration
- Revenue and discount tracking
- Custom JSON data support
- User feedback integration

## Deep Link Handling

### Deep Link Listener
**Location**: `App.js`

Comprehensive deep link processing with parameter extraction:

```javascript
const deferredDeeplinkCallback = function(uri) {
  console.log("Deferred Deeplink Callback received");
  console.log("URL:", uri);
  
  // Store the deferred deeplink URI
  setDeferredDeeplinkUri(uri);
  
  // Process the deferred deeplink URL
  if (uri) {
    // Extract URL string from object or string
    let urlString = '';
    if (typeof uri === 'object' && uri !== null) {
      urlString = uri.url || uri.deepLinkValue || uri.uri || JSON.stringify(uri);
    } else if (typeof uri === 'string') {
      urlString = uri;
    }
    
    // Check for cake-related URLs
    if (urlString && urlString.includes('product_id') && urlString.includes('quantity')) {
      console.log("🎂 Cake deeplink detected, processing...");
      handleDeepLink({ url: urlString });
    } else {
      console.log("📱 Non-cake deeplink received:", urlString);
    }
  }
};
```

### Deep Link Parameter Extraction
**Location**: `App.js`

```javascript
const handleDeepLink = ({ url }) => {
  if (url) {
    try {
      console.log("Processing deep link URL:", url);
      
      // Parse query parameters using query-string
      const parsedParams = queryString.parseUrl(url).query;
      console.log("Parsed parameters:", parsedParams);

      const productId = parsedParams.product_id || 'default';
      const quantity = parsedParams.quantity || 1;
      const actionData = parsedParams.actionData || 'noAction';
      const dlv = parsedParams.dlv || 'noDelivery';

      console.log("Cake parameters detected:");
      console.log(" - Product ID:", productId);
      console.log(" - Quantity:", quantity);
      console.log(" - Action Data:", actionData);
      console.log(" - DLV:", dlv);

      // Set navigation parameters
      setDeepLinkParams({
        product_id: productId,
        quantity: quantity,
        actionData: actionData,
        dlv: dlv,
        deferredDeeplinkUri: deferredDeeplinkUri,
      });

      setNavigateToCake(true); // Trigger navigation
      console.log("Deep link processed successfully");
    } catch (error) {
      console.error("Error parsing deep link:", error);
    }
  }
};
```

### Deep Link Screen
**Location**: `Screens/DeepLinkScreen.js`

Visual deep link testing interface:

```javascript
const _handleDeepLink = useCallback((link) => {
  setLinkMessage(`Deep Link: ${link}`);
  const url = new URL(link);
  const productId = url.searchParams.get('product_id');
  const quantity = url.searchParams.get('quantity');
  const actionData = url.searchParams.get('actionData');
  const dlv = url.searchParams.get('dlv');

  if (url.pathname === '/d') {
    navigation.navigate('CakeScreen', {
      productId, quantity, actionData, dlv,
    });
  }
}, [navigation]);
```

## Dynamic Link Creation

**Location**: `Screens/DynamicLinkScreen.js`

Advanced dynamic link creation with comprehensive configuration:

```javascript
const createSampleDynamicLink = async () => {
  setLoading(true);
  try {
    const config = {
      templateId: "M5Osa2",
      link: "https://trackier.u9ilnk.me/product/123",
      domainUriPrefix: "https://trackier.u9ilnk.me",
      deepLinkValue: "product_detail?product_id=123&quantity=2",
      
      // Platform-specific parameters
      androidParameters: {
        redirectLink: "https://play.google.com/store/apps/details?id=com.react_simulator"
      },
      iosParameters: {
        redirectLink: "https://apps.apple.com/app/id123456789"
      },
      desktopParameters: {
        redirectLink: "https://trackier.u9ilnk.me/desktop"
      },
      
      // Social media metadata
      socialMetaTagParameters: {
        title: "Amazing Product",
        description: "Check out this amazing product!",
        imageLink: "https://example.com/product-image.jpg"
      },
      
      // SDK parameters
      sdkParameters: {
        param1: "value1",
        param2: "value2",
        param3: "value3"
      },
      
      // Attribution parameters
      attributionParameters: {
        channel: "social",
        campaign: "summer_sale",
        mediaSource: "facebook",
        p1: "custom_param1",
        p2: "custom_param2",
        p3: "custom_param3"
      }
    };

    const result = await TrackierSDK.createDynamicLink(config);
    setDynamicLink(result);
    Alert.alert('Success', 'Sample dynamic link created successfully!');
  } catch (error) {
    console.error('Error creating dynamic link:', error);
    Alert.alert('Error', 'Failed to create dynamic link: ' + error.message);
  } finally {
    setLoading(false);
  }
};
```

**Features:**
- Template-based link creation
- Multi-platform support (Android, iOS, Desktop)
- Social media metadata integration
- SDK and attribution parameters
- Error handling and user feedback
- Clipboard integration for easy sharing

## Deferred Deep Link Resolution

**Location**: `Screens/DynamicLinkScreen.js`

Advanced deep link resolution with data parsing:

```javascript
const resolveDeeplink = async () => {
  if (!dynamicLink) {
    Alert.alert('Error', 'Please create a dynamic link first');
    return;
  }

  setLoading(true);
  try {
    const result = await TrackierSDK.resolveDeeplinkUrl(dynamicLink);
    setResolvedData(result);
    Alert.alert('Success', 'Deeplink resolved successfully!');
  } catch (error) {
    console.error('Error resolving deeplink:', error);
    Alert.alert('Error', 'Failed to resolve deeplink: ' + error.message);
  } finally {
    setLoading(false);
  }
};

// Test with sample URL
const testResolveWithSampleUrl = async () => {
  const sampleUrl = 'https://trackier58.u9ilnk.me/d/g5Hizea0AX';
  setDynamicLink(sampleUrl);
  
  setLoading(true);
  try {
    const result = await TrackierSDK.resolveDeeplinkUrl(sampleUrl);
    setResolvedData(result);
    Alert.alert('Success', 'Sample URL resolved successfully!');
  } catch (error) {
    console.error('Error resolving sample URL:', error);
    Alert.alert('Error', 'Failed to resolve sample URL: ' + error.message);
  } finally {
    setLoading(false);
  }
};
```

**Features:**
- URL resolution with detailed data extraction
- Sample URL testing
- Custom URL input and resolution
- Structured data display (URL, SDK params, tracking params, attribution data)
- Raw JSON data toggle
- Error handling and user feedback

## File Locations

### Core SDK Files:
- **Main App**: `App.js` - SDK initialization and deep link handling
- **Home Screen**: `Screens/HomeScreen.js` - Main navigation and deferred deeplink display
- **Built-in Events**: `Screens/BuildInEvent.js` - Built-in event tracking interface
- **Custom Events**: `Screens/Customevent.js` - Custom event tracking interface
- **Add to Cart**: `Screens/AddtoCartScreen.js` - Purchase event tracking
- **Deep Link Screen**: `Screens/DeepLinkScreen.js` - Deep link testing interface
- **Dynamic Link Screen**: `Screens/DynamicLinkScreen.js` - Dynamic link creation and resolution
- **Product Page**: `Screens/ProductPage.js` - Product display
- **Details Screen**: `Screens/DetailsScreen.js` - Product details
- **Cake Screen**: `Screens/CakeScreen.js` - Cake-specific screen
- **Splash Screen**: `Screens/Splash.js` - App splash screen

### Configuration Files:
- **Package Configuration**: `package.json`
- **Metro Configuration**: `metro.config.js`
- **TypeScript Configuration**: `tsconfig.json`
- **Babel Configuration**: `babel.config.js`
- **Environment Variables**: `.env` (not in repo for security)

## Configuration

### Dependencies (`package.json`):
```json
{
  "dependencies": {
    "react-native-trackier": "github:trackier/react-native-sdk",
    "@react-native-clipboard/clipboard": "^1.15.0",
    "react-native-vector-icons": "^10.2.0",
    "react-native-safe-area-context": "^5.0.0",
    "react-native-screens": "^4.4.0",
    "react-native-gesture-handler": "^2.21.2",
    "react-native-reanimated": "^3.16.6",
    "react-native-paper": "^5.12.5",
    "react-native-toast-message": "^2.3.3",
    "react-native-dotenv": "^3.4.11",
    "query-string": "^7.1.3"
  }
}
```

### Environment Variables (`.env`):
```env
TRDEVKEY=xxxxxxxxxxxxxxxxxxxxx
SECRETID=xxxxxxxxxxxxxxxxxxxxx
SECRETKEY=xxxxxxxxxxxxxxxxxxxxx
```

### SDK Key Configuration:
```javascript
// Environment variables for secure credential management
import { TRDEVKEY, SECRETID, SECRETKEY } from 'react-native-dotenv';

const trackierConfig = new TrackierConfig(
  TRDEVKEY,
  TrackierConfig.EnvironmentProduction
);
```

## Logging and Debugging

### Log Tags Used:
- `"Trackier"` - SDK operations logging
- `"DeepLink"` - Deep link data logging
- `"DynamicLink"` - Dynamic link creation
- `"Cake"` - Cake-related events
- `"Navigation"` - Navigation events

### Key Log Messages:
- **SDK Initialization**: "Trackier SDK initialized successfully"
- **Deep Link Received**: Complete deep link data dump
- **Event Tracking**: All tracked events with parameters
- **Dynamic Link Created**: Successfully created dynamic links
- **Navigation**: Screen navigation events
- **Parameter Parsing**: Detailed parameter extraction logs

### Console Output Examples:
```
LOG  TRDEVKEY: xxxxxxxxxxxxxxxxxxxxx
LOG  SECRETID: xxxxxxxxxxxxxxxxxxxxx
LOG  SECRETKEY: xxxxxxxxxxxxxxxxxxxxx
LOG  Trackier SDK initialized successfully
LOG  Deferred Deeplink Callback received
LOG  URL: trackier58.u9ilnk.me/d?dlv=CakeActivity&product_id=chocochip&quantity=2
LOG  🎂 Cake deeplink detected, processing...
LOG   Processing deep link URL: trackier58.u9ilnk.me/d?dlv=CakeActivity&product_id=chocochip&quantity=2
LOG   Parsed parameters: {"dlv": "CakeActivity", "product_id": "chocochip", "quantity": "2"}
LOG   Cake parameters detected:
LOG    - Product ID: chocochip
LOG    - Quantity: 2
LOG    - Action Data: noAction
LOG    - DLV: CakeActivity
LOG  Setting navigation to CakeScreen...
LOG  Deep link processed successfully
LOG   Navigating to CakeScreen...
```

## Platform Support

### Android

- ✅ **Deep Link Handling**
- ✅ **Event Tracking**
- ✅ **Dynamic Link Creation**
- ✅ **Facebook App ID Integration**

### iOS
- ✅ **iPhone Simulator** (iOS 18.1)
- ✅ **Deep Link Handling**
- ✅ **Event Tracking**
- ✅ **Dynamic Link Creation**
- ✅ **Apple Ads Token Integration** (Ready for implementation)

## Event Summary

| Event Type | Event ID/Name | Location | Trigger |
|------------|---------------|----------|---------|
| Custom Purchase | Q4YsqBKnzZ | AddtoCartScreen.js | Cake purchase |
| Built-in Events | TrackierEvent.* | BuildInEvent.js | User selection |
| Custom Events | User-defined | Customevent.js | Custom event ID |
| Deep Link | Auto-detected | App.js | Deep link received |
| Dynamic Link | Template-based | DynamicLinkScreen.js | Link creation |

## Key Features Implemented

✅ **SDK Initialization** - Complete setup with environment variables  
✅ **Event Tracking** - Built-in and custom events with revenue tracking  
✅ **Deep Link Handling** - Comprehensive deep link processing and navigation  
✅ **Dynamic Link Creation** - Advanced link creation with multi-platform support  
✅ **Deferred Deep Link Resolution** - URL resolution with structured data display  
✅ **Error Handling** - Proper error logging and user feedback  
✅ **Logging** - Detailed logging for debugging and monitoring  
✅ **Cross-Platform Support** - Android and iOS compatibility  
✅ **User Interface** - Modern, user-friendly interfaces for all features  
✅ **Environment Management** - Secure credential management with dotenv  
✅ **Parameter System** - Dynamic parameter support (up to 10 parameters)  
✅ **Currency Support** - 50+ currency options for revenue tracking  

## Usage Instructions

1. **Setup Environment Variables**: Create `.env` file with your Trackier credentials
2. **Install Dependencies**: Run `npm install` to install all required packages
3. **iOS Setup** (macOS only): Run `cd ios && pod install && cd ..`
4. **Start Metro Server**: Run `npm start`
5. **Run on Android**: Run `npm run android`
6. **Run on iOS** (macOS only): Run `npm run ios`

## Testing Features

### Built-in Events Testing:
1. Navigate to "Built-in Events" from home screen
2. Select an event type from dropdown
3. Enter revenue amount and select currency
4. Add custom parameters (up to 10)
5. Submit event and verify in logs

### Custom Events Testing:
1. Navigate to "Custom Events" from home screen
2. Enter custom event ID
3. Set revenue and currency
4. Add parameters as needed
5. Submit and verify tracking

### Deep Link Testing:
1. Use test URL: `https://trackier58.u9ilnk.me/d/g5Hizea0AX`
2. Navigate to "Deep Linking Page"
3. Test deep link processing
4. Verify parameter extraction and navigation

### Dynamic Link Testing:
1. Navigate to "Dynamic Link & Resolver"
2. Create sample dynamic link
3. Test URL resolution
4. Verify structured data display
5. Test clipboard functionality

## User Flow

1. **App Launch** → SDK initialization with user data setup
2. **Home Screen** → Navigation to different feature screens
3. **Event Tracking** → Built-in or custom event submission
4. **Deep Link Processing** → Automatic deep link detection and navigation
5. **Dynamic Link Creation** → Link generation with comprehensive configuration
6. **URL Resolution** → Deep link resolution with data extraction

## Troubleshooting

### Common Issues:

1. **SDK Not Initializing**
   - Verify environment variables in `.env` file
   - Check console logs for credential errors
   - Ensure proper import statements

2. **Deep Links Not Working**
   - Verify URL format and parameters
   - Check console logs for parsing errors
   - Test with provided sample URLs

3. **Events Not Tracking**
   - Verify event IDs from Trackier panel
   - Check network connectivity
   - Monitor console logs for errors

4. **iOS Build Issues**
   - Clean and rebuild: `cd ios && rm -rf build && pod install`
   - Check Xcode project settings
   - Verify iOS deployment target

5. **Environment Variables Not Loading**
   - Ensure `.env` file exists in project root
   - Check `babel.config.js` for dotenv plugin
   - Restart Metro server after changes

## Support

For technical support and questions:
- **Documentation**: [Trackier Documentation Portal](https://docs.trackier.com)
- **Support Email**: support@trackier.com
- **GitHub Issues**: Create an issue in the repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

This integration provides comprehensive tracking, deep linking, and dynamic link functionality for the React Native Simulator application using the Trackier SDK, demonstrating best practices for mobile app analytics and attribution with a modern, user-friendly interface.