import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
import AppTroveEvents from '../data/AppTroveEvents';
import { useCart } from '../data/CartManager';

const { width } = Dimensions.get('window');

const AddToCartScreen = ({ navigation }) => {
  const {
    cartItems,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    discount,
    total,
  } = useCart();

  // Track VIEW_CART when screen is shown
  useEffect(() => {
    try {
      const event = new ApptroveEvent(AppTroveEvents.VIEW_CART);
      event.param1 = 'Viewed Shopping Cart';
      ApptroveSDK.trackEvent(event);
    } catch (error) {
      console.error('Error tracking VIEW_CART:', error);
    }
  }, []);

  const handleCheckout = () => {
    try {
      const orderValue = total;
      
      // Track Purchase in AppTrove SDK
      const event = new ApptroveEvent(AppTroveEvents.PURCHASE);
      event.param1 = 'React Market Purchase';
      event.param2 = 'checkout_completed';
      event.revenue = orderValue;
      event.currency = 'USD';
      event.orderId = 'VM_' + Date.now();
      
      // Pass custom metadata parameters
      const customParams = {
        items_count: String(cartItems.length),
        checkout_method: 'in_app_wallet',
      };
      event.ev = customParams;
      
      ApptroveSDK.trackEvent(event);

      // Clear Cart Context
      clearCart();

      // Navigate to success confirmation
      navigation.navigate('OrderConfirmation', { total: orderValue });
    } catch (error) {
      console.error('Checkout tracking failed:', error);
      clearCart();
      navigation.navigate('OrderConfirmation', { total: total });
    }
  };

  // shipping calculation banner text
  const getShippingBanner = () => {
    if (subtotal >= 500) {
      return (
        <View style={[styles.promoBanner, styles.promoBannerFree]}>
          <Icon name="sparkles-outline" size={18} color="#15803d" style={{ marginRight: 8 }} />
          <Text style={styles.promoBannerTextFree}>
            Congratulations! You've unlocked FREE shipping! 🎉
          </Text>
        </View>
      );
    } else {
      const remaining = 500 - subtotal;
      return (
        <View style={[styles.promoBanner, styles.promoBannerProgress]}>
          <Icon name="alert-circle-outline" size={18} color="#b45309" style={{ marginRight: 8 }} />
          <Text style={styles.promoBannerTextProgress}>
            Add <Text style={{ fontWeight: '800' }}>${remaining.toFixed(2)}</Text> more to unlock FREE shipping.
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-outline" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Cart</Text>
          {cartItems.length > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Cart Content */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="basket-outline" size={90} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our trending products catalog and add items to your basket.
          </Text>
          <TouchableOpacity
            style={styles.startShoppingButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.itemsList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Promo shipping banner */}
            {getShippingBanner()}

            {/* List of items */}
            {cartItems.map((item, index) => (
              <View key={item.product.id} style={styles.itemCard}>
                <Image
                  source={{ uri: item.product.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />

                <View style={styles.itemInfo}>
                  <Text style={styles.itemCategory}>{item.product.category}</Text>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>

                  {/* Quantity Stepper */}
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(index, item.quantity - 1)}
                      style={styles.stepperBtn}
                    >
                      <Icon name="remove" size={16} color="#0f172a" />
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(index, item.quantity + 1)}
                      style={styles.stepperBtn}
                    >
                      <Icon name="add" size={16} color="#0f172a" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Remove Trash Button */}
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeItem(index)}
                >
                  <Icon name="trash-outline" size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Bill Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Bill Summary</Text>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Basket Subtotal</Text>
                <Text style={styles.billValue}>${subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Promo Discount (5%)</Text>
                <Text style={[styles.billValue, styles.discountText]}>
                  -${discount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Text style={[styles.billValue, shipping === 0 && styles.discountText]}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={[styles.billRow, { marginBottom: 0 }]}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Checkout CTA */}
          <View style={styles.bottomCta}>
            <TouchableOpacity onPress={handleCheckout} style={styles.checkoutBtn}>
              <Icon name="wallet-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.checkoutText}>Place Order & Pay (${total.toFixed(2)})</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerBadge: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  startShoppingButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  startShoppingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  itemsList: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  promoBanner: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  promoBannerFree: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  promoBannerTextFree: {
    fontSize: 13,
    color: '#15803d',
    fontWeight: '700',
    flex: 1,
  },
  promoBannerProgress: {
    backgroundColor: '#fffbeb',
    borderColor: '#fef3c7',
  },
  promoBannerTextProgress: {
    fontSize: 13,
    color: '#b45309',
    fontWeight: '600',
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  itemCategory: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#4f46e5',
    marginBottom: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 2,
    alignSelf: 'flex-start',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepperValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginHorizontal: 12,
  },
  removeBtn: {
    padding: 8,
    alignSelf: 'center',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    marginTop: 8,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  billValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '700',
  },
  discountText: {
    color: '#22c55e',
  },
  divider: {
    height: 1.5,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4f46e5',
  },
  bottomCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  checkoutBtn: {
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
  checkoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default AddToCartScreen;
