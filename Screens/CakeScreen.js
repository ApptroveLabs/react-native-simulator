import React from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const CakeScreen = ({ route }) => {
  const { product_id, quantity, actionData, dlv } = route.params || {};

  const getProductImage = () => {
    switch (product_id) {
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
      Action: actionData,
      Dlv: dlv,
      Quantity: quantity,
      Product: product_id,
    });
  };

  const copyDataToClipboard = () => {
    Clipboard.setString(getJsonData());
    Alert.alert('Success', 'Data copied to clipboard');
  };

  return (
    <View style={styles.container}>
      <Image source={getProductImage()} style={styles.image} />
      <Text style={styles.text}>Name: {product_id?.toUpperCase() || 'Unknown'}</Text>
      <Text style={styles.text}>Quantity: {quantity || '0'}</Text>
      <Text style={styles.jsonText}>{getJsonData()}</Text>
      <Button title="Copy Data" onPress={copyDataToClipboard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default CakeScreen;
