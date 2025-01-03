import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, Image, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DeepLinkingScreen = () => {
  const [linkMessage, setLinkMessage] = useState('Waiting for a link...');
  const navigation = useNavigation();

  const _handleDeepLink = useCallback((link) => {
    setLinkMessage(`Deep Link: ${link}`);
    const url = new URL(link);
    const productId = url.searchParams.get('product_id');
    const quantity = url.searchParams.get('quantity');
    const actionData = url.searchParams.get('actionData');
    const dlv = url.searchParams.get('dlv');

    if (url.pathname === '/d') {
      navigation.navigate('CakeScreen', {
        productId,
        quantity,
        actionData,
        dlv,
      });
    } else {
      console.log('Unhandled deep link:', link);
    }
  }, [navigation]);

  useEffect(() => {
    console.log("Component Started")
    const handleDeepLink = ({ url }) => {
      _handleDeepLink(url);
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [_handleDeepLink]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/blueberrycupcake.jpeg')} style={styles.image} />
      <Image source={require('../assets/chocochipcupcake.png')} style={styles.image} />
      <Image source={require('../assets/vanillaccupake.jpeg')} style={styles.image} />
      <Text style={styles.linkMessage}>{linkMessage}</Text>
      <Button title="Back to Event Tracking" onPress={handleBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  linkMessage: {
    marginTop: 20,
    marginBottom:20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DeepLinkingScreen;
