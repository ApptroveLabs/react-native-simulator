import React, { useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// You can replace this with your own event tracking service (Trackier or any other analytics SDK)
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';

const ProductPageScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Track product view event

    var trackierEvent = new TrackierEvent("jKw8qPF50u");
    
    trackierEvent.param1 = "Product View Sucessfull";
    trackierEvent.orderId = "Britania12123";
    TrackierSDK.trackEvent(trackierEvent);

    
  }, []);

  const addToCart = () => {
 
        var trackierEvent = new TrackierEvent("Fy4uC1_FlN");
    
        trackierEvent.param1 = "Product Added to cart";
        
        TrackierSDK.trackEvent(trackierEvent);


    // Show success message
    Alert.alert("Product has been added to cart");

    // Navigate to the AddToCartScreen
    navigation.navigate('AddtoCart');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/trackierlogo.png')} style={styles.image} />
      <Text style={styles.title}>Flutter Simulator</Text>
      <Image source={require('../assets/chocochipcupcake.png')} style={styles.image} />
      <Text style={styles.productName}>Britannia Cupcake</Text>
      <Text style={styles.price}>30.00 RS</Text>
      <Button title="Add to Cart" onPress={addToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  productName: {
    fontSize: 20,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default ProductPageScreen;
