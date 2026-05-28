import React from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

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
        return require('../assets/chocochipcupcake.png');
    }
  };

  const getJsonData = () => {
    return JSON.stringify({
      Action: cakeParams.actionData,
      Dlv: cakeParams.dlv,
      Quantity: cakeParams.quantity,
      Product: cakeParams.product_id,
    }, null, 2);
  };

  const copyDataToClipboard = () => {
    Clipboard.setString(getJsonData());
    Alert.alert('Copied', 'Attribution data copied to clipboard!');
  };

  const printDeferredDeeplinkValue = () => {
    console.log("🔗 Deferred Deeplink URI:", cakeParams.deferredDeeplinkUri);
    Alert.alert('Deferred Deeplink Value', cakeParams.deferredDeeplinkUri);
  };

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.scrollContainer}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>React Market</Text>
        <View style={{ width: 24 }} /> {/* Spacer to center the title */}
      </View>

      {/* Main Cake Detail Card */}
      <View style={styles.productCard}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Deep Link Order</Text>
        </View>
        <Image source={getProductImage()} style={styles.image} resizeMode="contain" />
        <Text style={styles.productName}>
          {cakeParams.product_id ? `${cakeParams.product_id.charAt(0).toUpperCase() + cakeParams.product_id.slice(1)} Cupcake` : 'Selected Cupcake'}
        </Text>
        <View style={styles.qtyContainer}>
          <Icon name="basket-outline" size={16} color="#4f46e5" />
          <Text style={styles.qtyText}>Quantity: {cakeParams.quantity}</Text>
        </View>
      </View>

      {/* Resolved Parameters Monospace Console Card */}
      <View style={styles.consoleCard}>
        <View style={styles.consoleHeader}>
          <Text style={styles.consoleTitle}>Attribution Parameters</Text>
          <View style={styles.pulseIndicator} />
        </View>
        <ScrollView style={styles.consoleScroll} nestedScrollEnabled>
          <Text style={styles.consoleText}>{getJsonData()}</Text>
        </ScrollView>
      </View>

      {/* Interactive Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={copyDataToClipboard}>
          <Icon name="copy-outline" size={18} color="#fff" style={styles.btnIcon} />
          <Text style={styles.actionButtonText}>Copy JSON Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={printDeferredDeeplinkValue}>
          <Icon name="eye-outline" size={18} color="#4f46e5" style={styles.btnIcon} />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Print Deferred Value</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
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
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 15,
    marginTop: 10,
  },
  badgeContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#10b981', // Emerald green badge
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
  productName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 10,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  qtyText: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '700',
    marginLeft: 6,
  },
  consoleCard: {
    backgroundColor: '#0f172a', // Slate 900
    borderRadius: 20,
    padding: 16,
    marginBottom: 25,
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 8,
    marginBottom: 12,
  },
  consoleTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pulseIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  consoleScroll: {
    maxHeight: 120,
  },
  consoleText: {
    fontSize: 13,
    color: '#38bdf8', // Blue terminal text
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4f46e5',
    shadowOpacity: 0,
    elevation: 0,
  },
  secondaryButtonText: {
    color: '#4f46e5',
  },
  btnIcon: {
    marginRight: 6,
  },
});

export default CakeScreen;
