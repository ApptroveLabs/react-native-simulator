import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const OrderConfirmationScreen = ({ route, navigation }) => {
  // Fallback if no total passed
  const total = route.params?.total || 0;
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Generate order ID VM + current timestamp
    setOrderId(`#VM${Date.now()}`);
  }, []);

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Circle Indicator */}
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Icon name="checkmark-done" size={70} color="#ffffff" />
          </View>
        </View>

        {/* Success Text */}
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Thank you for shopping with React Market
        </Text>

        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          {/* Order ID Row */}
          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Icon name="receipt-outline" size={20} color="#4f46e5" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Order ID</Text>
            </View>
            <Text style={styles.rowValue}>{orderId}</Text>
          </View>

          {/* Amount Paid Row */}
          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Icon name="card-outline" size={20} color="#4f46e5" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Amount Paid</Text>
            </View>
            <Text style={[styles.rowValue, styles.amountText]}>
              ${total.toFixed(2)}
            </Text>
          </View>

          {/* Delivery Row */}
          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Icon name="time-outline" size={20} color="#4f46e5" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Est. Delivery</Text>
            </View>
            <Text style={styles.rowValue}>3-5 Business Days</Text>
          </View>

          {/* Payment Status Row */}
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={styles.labelGroup}>
              <Icon name="checkmark-circle-outline" size={20} color="#4f46e5" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Payment</Text>
            </View>
            <Text style={[styles.rowValue, styles.successStatus]}>Confirmed</Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>

        <Text style={styles.hintText}>
          Track your order via My Orders in the menu
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  innerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 36,
  },
  summaryCard: {
    backgroundColor: '#f8fafc', // Slate 50
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#f1f5f9',
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 10,
  },
  rowLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '700',
  },
  rowValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '800',
  },
  amountText: {
    color: '#4f46e5',
  },
  successStatus: {
    color: '#22c55e',
  },
  continueButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  hintText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 16,
  },
});

export default OrderConfirmationScreen;
