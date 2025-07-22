import React from 'react';
import { View, Text, Image, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';

const CakeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { product_id, quantity, actionData, dlv, deferredDeeplinkUri } = route.params || {};
  
  // If no params from route, use default values
  const cakeParams = {
    product_id: product_id || 'default',
    quantity: quantity || 1,
    actionData: actionData || 'noAction',
    dlv: dlv || 'noDelivery',
    deferredDeeplinkUri: deferredDeeplinkUri || 'No deferred deeplink received'
  };

  const getProductImage = () => {
    switch (cakeParams.product_id) {
      case 'blueberry':
        return require('../assets/blueberrycupcake.jpeg');
      case 'chocochip':
        return require('../assets/chocochipcupcake.png');
      case 'vanilla':
        return require('../assets/vanillaccupake.jpeg');
      default:
        return require('../assets/chocochipcupcake.png'); // Add a default image
    }
  };

  const getJsonData = () => {
    return JSON.stringify({
      Action: cakeParams.actionData,
      Dlv: cakeParams.dlv,
      Quantity: cakeParams.quantity,
      Product: cakeParams.product_id,
    });
  };

  const copyDataToClipboard = () => {
    Clipboard.setString(getJsonData());
    Alert.alert('Success', 'Data copied to clipboard');
  };

  const printDeferredDeeplinkValue = () => {
    console.log("🔗 Deferred Deeplink URI:", cakeParams.deferredDeeplinkUri);
    Alert.alert('Deferred Deeplink Value', cakeParams.deferredDeeplinkUri);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Image source={getProductImage()} style={styles.image} />
      <Text style={styles.text}>Name: {cakeParams.product_id?.toUpperCase() || 'Unknown'}</Text>
      <Text style={styles.text}>Quantity: {cakeParams.quantity || '0'}</Text>
      <Text style={styles.jsonText}>{getJsonData()}</Text>
      <Button title="Copy Data" onPress={copyDataToClipboard} />
      <View style={styles.buttonSpacer} />
      <Button title="Print Deferred Deeplink Value" onPress={printDeferredDeeplinkValue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 200,
    height: 200,
  },
  Button:{
   marginTop:10,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },
  jsonText: {
    fontSize: 18,
    marginTop: 15,
  },
  buttonSpacer: {
    height: 20,
  },
});

export default CakeScreen;
