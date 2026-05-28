import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TrackierSDK, TrackierEvent } from 'react-native-trackier';

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
    Alert.alert("Success", "Chocochip Cupcake has been added to your cart!");

    // Navigate to the AddToCartScreen
    navigation.navigate('AddtoCart');
  };

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.scrollContainer}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <Image source={require('../assets/app_logo.png')} style={styles.brandLogo} resizeMode="contain" />
        <Text style={styles.brandTitle}>React Market</Text>
      </View>

      {/* Product Image Card */}
      <View style={styles.productCard}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Best Seller</Text>
        </View>
        <Image source={require('../assets/chocochipcupcake.png')} style={styles.productImage} resizeMode="contain" />
      </View>

      {/* Product Details Section */}
      <View style={styles.detailsCard}>
        <View style={styles.titleRow}>
          <Text style={styles.productName}>Chocochip Cupcake</Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#fbbf24" />
            <Text style={styles.ratingText}>4.9 (120 reviews)</Text>
          </View>
        </View>

        <Text style={styles.price}>45.00 RS</Text>
        
        <Text style={styles.descriptionHeader}>Product Description</Text>
        <Text style={styles.description}>
          Indulge in our classic Chocochip Cupcake. Baked fresh daily, it features soft, fluffy chocolate cake topped with a rich, velvety chocolate cream frosting and sprinkled with premium Belgian dark chocolate chips. Truly a decadent treat!
        </Text>

        <View style={styles.divider} />

        {/* Action Button */}
        <TouchableOpacity style={styles.cartButton} onPress={addToCart}>
          <Icon name="cart" size={20} color="#fff" style={styles.cartIcon} />
          <Text style={styles.cartButtonText}>Add to Basket</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc', // Slate 50
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  brandLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#4f46e5', // Indigo 600
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  titleRow: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginLeft: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4f46e5',
    marginBottom: 20,
  },
  descriptionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  cartButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cartIcon: {
    marginRight: 8,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default ProductPageScreen;
