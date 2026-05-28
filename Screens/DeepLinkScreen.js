import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const DeepLinkingScreen = () => {
  const [linkMessage, setLinkMessage] = useState('> Idle. Waiting for incoming deep link...');
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

  const cupcakes = [
    { name: 'Blueberry', image: require('../assets/blueberrycupcake.jpeg') },
    { name: 'Chocochip', image: require('../assets/chocochipcupcake.png') },
    { name: 'Vanilla', image: require('../assets/vanillaccupake.jpeg') },
  ];

  return (
    <View style={styles.mainContainer}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deep Linking</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Cupcake Carousel Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Product Showcase</Text>
          <Text style={styles.cardDesc}>
            These products can be launched via deep link. Tap a cupcake or trigger a deep link URL externally.
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cupcakeRow}
          >
            {cupcakes.map((cupcake, index) => (
              <View key={index} style={styles.cupcakeCard}>
                <Image source={cupcake.image} style={styles.cupcakeImage} />
                <Text style={styles.cupcakeName}>{cupcake.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Deep Link Console */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Link Listener Console</Text>
          <Text style={styles.cardDesc}>
            Real-time listener for incoming deep link URLs. The app will automatically navigate to the matched product screen.
          </Text>
          <View style={styles.consoleBox}>
            <View style={styles.consoleHeader}>
              <Text style={styles.consoleLabel}>DEEP LINK STATUS</Text>
              <View style={styles.greenPulse} />
            </View>
            <Text style={styles.consoleText}>{linkMessage}</Text>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="home-outline" size={18} color="#4f46e5" style={styles.btnIcon} />
          <Text style={styles.outlineButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 70,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingTop: 10,
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
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 16,
  },
  cupcakeRow: {
    paddingVertical: 4,
  },
  cupcakeCard: {
    width: 130,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cupcakeImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  cupcakeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    paddingVertical: 10,
  },
  consoleBox: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 8,
    marginBottom: 10,
  },
  consoleLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  consoleText: {
    fontSize: 12,
    color: '#38bdf8',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#4f46e5',
    borderRadius: 16,
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '800',
  },
  btnIcon: {
    marginRight: 6,
  },
});

export default DeepLinkingScreen;

