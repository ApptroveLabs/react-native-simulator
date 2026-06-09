import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
import AppTroveEvents from '../data/AppTroveEvents';
import { useCart } from '../data/CartManager';
import { useWishlist } from '../data/WishlistManager';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist, wishlistCount } = useWishlist();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('#0f172a');
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Check if product is in wishlist
  const isFavorite = isInWishlist(product.id);

  // Track product view event on load
  useEffect(() => {
    try {
      const event = new ApptroveEvent(AppTroveEvents.PRODUCT_VIEW);
      event.param1 = 'Product Viewed';
      event.param2 = product.name;
      event.param3 = product.category;
      event.productId = String(product.id);
      event.orderId = 'VistMarket_' + product.id;
      ApptroveSDK.trackEvent(event);
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  }, [product]);

  const handleAddToCart = () => {
    try {
      // Add item to Cart Context
      addItem(product);

      // Track add to cart event in AppTrove SDK
      const event = new ApptroveEvent(AppTroveEvents.ADD_TO_CART);
      event.param1 = 'Product Added to cart';
      event.param2 = product.name;
      event.productId = String(product.id);
      event.revenue = product.price;
      event.currency = 'USD';
      event.param4 = selectedSize;
      ApptroveSDK.trackEvent(event);

      // Show bottom confirmation modal
      setShowAddedModal(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleShareProduct = () => {
    // Mimic share / tracking link creation
    Alert.alert('Share Link Created', `Direct link for ${product.name} has been copied to your clipboard.`);
  };

  const handleToggleFavorite = () => {
    const wasInWishlist = isInWishlist(product.id);
    toggleWishlist(product);
    
    // Show confirmation alert
    if (wasInWishlist) {
      Alert.alert('Removed', `${product.name} removed from wishlist`);
    } else {
      Alert.alert('Added to Wishlist', `${product.name} added to your wishlist!`);
    }
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Icon key={i} name="star" size={16} color="#f59e0b" style={{ marginRight: 2 }} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<Icon key={i} name="star-half" size={16} color="#f59e0b" style={{ marginRight: 2 }} />);
      } else {
        stars.push(<Icon key={i} name="star-outline" size={16} color="#f59e0b" style={{ marginRight: 2 }} />);
      }
    }
    return stars;
  };

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['#0f172a', '#4f46e5', '#991b1b', '#cbd5e1'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Icon name="arrow-back-outline" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Product Detail</Text>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Wishlist')} 
            style={styles.headerIconButton}
          >
            <Icon name="heart-outline" size={22} color="#0f172a" />
            {wishlistCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{wishlistCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShareProduct} style={styles.headerIconButton}>
            <Icon name="share-social-outline" size={22} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Image Section */}
        <View style={styles.imageContainer}>
          {imageError ? (
            <View style={styles.placeholderImage}>
              <Icon name="image-outline" size={64} color="#cbd5e1" />
            </View>
          ) : (
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          )}
          {/* Floating Heart Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#ef4444' : '#64748b'}
            />
          </TouchableOpacity>
        </View>

        {/* Overlapping Info Card */}
        <View style={styles.infoCard}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>

          {/* Name & Price */}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            {renderStars(product.rating)}
            <Text style={styles.ratingCount}> ({product.rating} ★ • 128 reviews)</Text>
          </View>

          <View style={styles.divider} />

          {/* Size Selector */}
          <Text style={styles.selectorTitle}>Select Size</Text>
          <View style={styles.sizeRow}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                style={[
                  styles.sizeButton,
                  selectedSize === size ? styles.selectedSizeButton : styles.inactiveSizeButton,
                ]}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size ? styles.selectedSizeText : styles.inactiveSizeText,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Color Selector */}
          <Text style={styles.selectorTitle}>Select Color</Text>
          <View style={styles.colorRow}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorCircle,
                ]}
              >
                {selectedColor === color && (
                  <Icon name="checkmark-outline" size={16} color={color === '#cbd5e1' ? '#0f172a' : '#ffffff'} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.selectorTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Badges */}
          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: '#f0fdf4' }]}>
              <Icon name="shield-checkmark-outline" size={18} color="#16a34a" style={{ marginRight: 6 }} />
              <Text style={[styles.badgeText, { color: '#16a34a' }]}>Original Product</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#f0f9ff' }]}>
              <Icon name="refresh-outline" size={18} color="#0284c7" style={{ marginRight: 6 }} />
              <Text style={[styles.badgeText, { color: '#0284c7' }]}>7 Days Return</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
          <Icon name="bag-handle-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Success Bottom Sheet Modal */}
      <Modal
        visible={showAddedModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderIndicator} />
            
            {/* Checkmark circle */}
            <View style={styles.checkmarkCircle}>
              <Icon name="checkmark" size={40} color="#ffffff" />
            </View>

            <Text style={styles.modalTitle}>Added to Cart!</Text>
            <Text style={styles.modalSubtitle}>
              {product.name} — Size {selectedSize}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowAddedModal(false)}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Continue Shopping</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  setShowAddedModal(false);
                  navigation.navigate('AddtoCart');
                }}
                style={styles.viewCartButton}
              >
                <Text style={styles.viewCartButtonText}>View Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  headerButton: {
    padding: 6,
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    padding: 6,
    marginLeft: 8,
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    maxWidth: width - 120,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    minHeight: 400,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  categoryText: {
    color: '#4f46e5',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4f46e5',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingCount: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1.5,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  selectorTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  sizeRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sizeButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedSizeButton: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  inactiveSizeButton: {
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  sizeText: {
    fontSize: 15,
    fontWeight: '700',
  },
  selectedSizeText: {
    color: '#ffffff',
  },
  inactiveSizeText: {
    color: '#475569',
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  selectedColorCircle: {
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  badge: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addToCartButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Slate 900 tint
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalHeaderIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#cbd5e1',
    borderRadius: 3,
    marginBottom: 30,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e', // Success Green
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  continueButton: {
    flex: 0.48,
    borderWidth: 2,
    borderColor: '#4f46e5',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '800',
  },
  viewCartButton: {
    flex: 0.48,
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCartButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default ProductDetailScreen;
