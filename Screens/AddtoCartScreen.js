import React, { useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';

const AddToCartScreen = () => {

    const purchase = () => {
        // Create a TrackierEvent object and set parameters
        var trackierEvent = new TrackierEvent("Q4YsqBKnzZ"); 
        
        trackierEvent.param1 = "Britannia Cupcake";
        trackierEvent.param1 = "Purchase Sucessfully";

        trackierEvent.couponCode = "@3030303di";
        trackierEvent.revenue = 30.0;  // Use a numeric value for revenue
        trackierEvent.discount = 2.0;  // Ensure discount is also numeric

            //Passing the custom params in events be like below example
        var jsonData = {"phone": "+91-8137872378" , "name": "Satyam "};
         trackierEvent.ev = jsonData;
        
        // Track the event
        TrackierSDK.trackEvent(trackierEvent);

        // Show success message
        Alert.alert("Thanks for your purchase!");
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/trackierlogo.png')} style={styles.image} />
            <View style={styles.productCard}>
                <Image source={require('../assets/chocochipcupcake.png')} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>Britannia Cupcake</Text>
                    <Text style={styles.productPrice}>30.00 RS</Text>
                </View>
            </View>
            <Button title="Click to Purchase" onPress={purchase} />
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
    productCard: {
        flexDirection: 'row',
        marginVertical: 20,
        alignItems: 'center',
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        borderColor: '#ccc',
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    productInfo: {
        marginLeft: 10,
    },
    productName: {
        fontSize: 18,
    },
    productPrice: {
        fontSize: 18,
        color: 'green',
    },
});

export default AddToCartScreen;
