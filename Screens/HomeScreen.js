import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { ApptroveSDK, ApptroveEvent } from 'react-native-apptrove';
import AppTroveEvents from '../data/AppTroveEvents';
import { products, categories } from '../data/products';
import { useCart } from '../data/CartManager';
import { useWishlist } from '../data/WishlistManager';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation, deferredDeeplinkUri }) => {
  const { totalItems, addItem } = useCart();
  const { toggleWishlist, isInWishlist, wishlistCount } = useWishlist();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('Guest User');
  const [userEmail, setUserEmail] = useState('guest@reactmarket.com');
  const [showDrawer, setShowDrawer] = useState(false);

  // Slide Animation for Drawer
  const drawerSlideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  useEffect(() => {
    const fetchUser = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      const name = await AsyncStorage.getItem('userName');
      if (email) {
        setUserEmail(email);
      }
      if (name) {
        setUserName(name);
      }
    };
    fetchUser();
  }, []);

  // Handle drawer open/close
  const toggleDrawer = (open) => {
    setShowDrawer(open);
    Animated.timing(drawerSlideAnim, {
      toValue: open ? 0 : -width * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Track search events with a small debounce/delay
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      try {
        const event = new ApptroveEvent(AppTroveEvents.PRODUCT_SEARCH);
        event.param1 = searchQuery.trim();
        ApptroveSDK.trackEvent(event);
      } catch (error) {
        console.error('Error tracking search:', error);
      }
    }
  };

  // Toggle favorite with wishlist manager
  const toggleFavorite = (product) => {
    const wasInWishlist = isInWishlist(product.id);
    toggleWishlist(product);
    
    // Show confirmation alert
    if (wasInWishlist) {
      Alert.alert('Removed', `${product.name} removed from wishlist`);
    } else {
      Alert.alert('Added to Wishlist', `${product.name} added to your wishlist!`);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            // Track SDK logout event
            const event = new ApptroveEvent(AppTroveEvents.LOGOUT);
            ApptroveSDK.trackEvent(event);

            await AsyncStorage.removeItem('isLoggedIn');
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('userName');
            toggleDrawer(false);
            navigation.replace('Login');
          } catch (error) {
            console.error('Logout error:', error);
            navigation.replace('Login');
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent. Do you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Track SDK account deletion
              const event = new ApptroveEvent(AppTroveEvents.ACCOUNT_DELETION);
              ApptroveSDK.trackEvent(event);

              await AsyncStorage.removeItem('isLoggedIn');
              await AsyncStorage.removeItem('userEmail');
              await AsyncStorage.removeItem('userName');
              toggleDrawer(false);
              navigation.replace('Login');
            } catch (error) {
              console.error('Delete account error:', error);
              navigation.replace('Login');
            }
          },
        },
      ]
    );
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.mainContainer}>
      {/* App Bar Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => toggleDrawer(true)} style={styles.barIcon}>
          <Icon name="menu-outline" size={28} color="#0f172a" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>React Market</Text>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Wishlist')}
          >
            <Icon name="heart-outline" size={24} color="#0f172a" />
            {wishlistCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{wishlistCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('AddtoCart')}
          >
            <Icon name="cart-outline" size={24} color="#0f172a" />
            {totalItems > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Search Bar section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products or categories..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Promo Banner Card */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTag}>Limited Offer</Text>
            <Text style={styles.bannerTitle}>Season Sale - 50% Off</Text>
            <Text style={styles.bannerSubtitle}>Premium curated products on discounts.</Text>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => {
                setSelectedCategory('Electronics');
                Alert.alert('Sale Applied', 'Viewing premium deals on Electronics.');
              }}
            >
              <Text style={styles.bannerBtnText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <Icon name="rocket-outline" size={80} color="#ffffff" style={styles.bannerIcon} />
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Products</Text>
          <Text style={styles.sectionSubtitle}>
            Showing {filteredProducts.length} items
          </Text>
        </View>

        {filteredProducts.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Icon name="search-outline" size={48} color="#cbd5e1" />
            <Text style={styles.noResultsText}>No products found matching "{searchQuery}"</Text>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((product) => {
              const isFav = isInWishlist(product.id);
              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate('ProductDetail', { product })}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardImageContainer}>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.favoriteCardBtn}
                      onPress={() => toggleFavorite(product)}
                    >
                      <Icon
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={16}
                        color={isFav ? '#ef4444' : '#64748b'}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productDetails}>
                    <Text style={styles.productCardCategory}>{product.category}</Text>
                    <Text style={styles.productNameText} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.productPriceText}>${product.price.toFixed(2)}</Text>
                      <TouchableOpacity
                        style={styles.addToCartCardBtn}
                        onPress={() => {
                          addItem(product);
                          Alert.alert('Success', `${product.name} added to cart!`);
                        }}
                      >
                        <Icon name="add" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Slide-in Navigation Drawer Overlay */}
      {showDrawer && (
        <TouchableOpacity
          style={styles.drawerBackdrop}
          activeOpacity={1}
          onPress={() => toggleDrawer(false)}
        >
          {/* We capture press here to avoid closing when pressing inside the drawer */}
          <Animated.View
            style={[
              styles.drawerContent,
              { transform: [{ translateX: drawerSlideAnim }] },
            ]}
          >
            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
              {/* Drawer Header */}
              <View style={styles.drawerHeader}>
                <View style={styles.avatarContainer}>
                  <Icon name="person-circle-outline" size={60} color="#4f46e5" />
                </View>
                <Text style={styles.drawerName} numberOfLines={1}>
                  {userName}
                </Text>
                <Text style={styles.drawerEmail} numberOfLines={1}>
                  {userEmail}
                </Text>
                <Text style={styles.drawerRole}>
                  {userEmail.includes('guest') ? 'Guest Shopper' : 'Premium Member'}
                </Text>
              </View>

              {/* Drawer Scroll Links */}
              <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={styles.drawerLink}
                  onPress={() => {
                    toggleDrawer(false);
                  }}
                >
                  <Icon name="home-outline" size={20} color="#0f172a" style={styles.drawerLinkIcon} />
                  <Text style={styles.drawerLinkText}>Home Feed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.drawerLink}
                  onPress={() => {
                    toggleDrawer(false);
                    navigation.navigate('Wishlist');
                  }}
                >
                  <Icon name="heart-outline" size={20} color="#0f172a" style={styles.drawerLinkIcon} />
                  <Text style={styles.drawerLinkText}>My Wishlist</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.drawerLink}
                  onPress={() => {
                    Alert.alert('Privacy Policy', 'This application preserves your user choices in full compliance with GDPR and AppTrove sandboxes.');
                  }}
                >
                  <Icon name="shield-outline" size={20} color="#0f172a" style={styles.drawerLinkIcon} />
                  <Text style={styles.drawerLinkText}>Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.drawerLink}
                  onPress={() => {
                    Alert.alert('Terms & Conditions', 'Your usage of this React Market app is governed by our developer SDK sandboxing terms.');
                  }}
                >
                  <Icon name="document-text-outline" size={20} color="#0f172a" style={styles.drawerLinkIcon} />
                  <Text style={styles.drawerLinkText}>Terms & Conditions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.drawerLink}
                  onPress={() => {
                    Alert.alert('About Us', 'React Market - Your premium e-commerce shopping destination. Version 1.0.0');
                  }}
                >
                  <Icon name="information-circle-outline" size={20} color="#0f172a" style={styles.drawerLinkIcon} />
                  <Text style={styles.drawerLinkText}>About Us</Text>
                </TouchableOpacity>

                <View style={styles.drawerDivider} />

                {/* Logout button */}
                <TouchableOpacity style={styles.drawerLogoutLink} onPress={handleLogout}>
                  <Icon name="log-out-outline" size={20} color="#ef4444" style={styles.drawerLinkIcon} />
                  <Text style={styles.drawerLogoutText}>Sign Out</Text>
                </TouchableOpacity>

                {/* Delete Account */}
                <TouchableOpacity style={styles.drawerLogoutLink} onPress={handleDeleteAccount}>
                  <Icon name="trash-bin-outline" size={20} color="#ef4444" style={styles.drawerLinkIcon} />
                  <Text style={styles.drawerLogoutText}>Delete Account</Text>
                </TouchableOpacity>
              </ScrollView>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 70,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  barIcon: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
    position: 'relative',
    padding: 6,
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1.5,
    borderBottomColor: '#f1f5f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  bannerCard: {
    backgroundColor: '#4f46e5',
    borderRadius: 24,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  bannerInfo: {
    flex: 1.3,
  },
  bannerTag: {
    color: '#c7d2fe',
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#e0e7ff',
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 16,
    fontWeight: '500',
  },
  bannerBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: '#4f46e5',
    fontWeight: '800',
    fontSize: 12,
  },
  bannerIcon: {
    opacity: 0.85,
    marginLeft: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  categoryChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  categoryChipSelected: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  categoryText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 13,
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: (width - 44) / 2,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  cardImageContainer: {
    width: '100%',
    height: 124,
    backgroundColor: '#f1f5f9',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteCardBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productDetails: {
    padding: 12,
  },
  productCardCategory: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  productNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPriceText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4f46e5',
  },
  addToCartCardBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    zIndex: 999,
  },
  drawerContent: {
    width: width * 0.75,
    height: height,
    backgroundColor: '#ffffff',
    paddingTop: 50,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 16,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1.5,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 10,
  },
  drawerName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f172a',
    maxWidth: '90%',
    marginBottom: 4,
  },
  drawerEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    maxWidth: '90%',
  },
  drawerRole: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '700',
    marginTop: 4,
  },
  drawerScroll: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  drawerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  drawerLinkIcon: {
    marginRight: 14,
  },
  drawerLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
    marginHorizontal: 12,
  },
  drawerLogoutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  drawerLogoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
  },
});

export default HomeScreen;
