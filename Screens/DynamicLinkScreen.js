import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TrackierSDK } from 'react-native-trackier';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/Ionicons';
import { Snackbar } from 'react-native-paper';

const DynamicLinkScreen = () => {
  const navigation = useNavigation();
  const [dynamicLink, setDynamicLink] = useState('');
  const [customUrl, setCustomUrl] = useState('https://trackier58.u9ilnk.me/d/g5Hizea0AX');
  const [resolvedData, setResolvedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (msg) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const createSampleDynamicLink = async () => {
    setLoading(true);
    try {
      const config = {
        templateId: "M5Osa2",
        link: "https://trackier.u9ilnk.me/product/123",
        domainUriPrefix: "https://trackier.u9ilnk.me",
        deepLinkValue: "product_detail?product_id=123&quantity=2",
        androidParameters: {
          redirectLink: "https://play.google.com/store/apps/details?id=com.react_simulator"
        },
        iosParameters: {
          redirectLink: "https://apps.apple.com/app/id123456789"
        },
        desktopParameters: {
          redirectLink: "https://trackier.u9ilnk.me/desktop"
        },
        socialMetaTagParameters: {
          title: "Amazing Product",
          description: "Check out this amazing product!",
          imageLink: "https://example.com/product-image.jpg"
        },
        sdkParameters: {
          param1: "value1",
          param2: "value2",
          param3: "value3"
        },
        attributionParameters: {
          channel: "social",
          campaign: "summer_sale",
          mediaSource: "facebook",
          p1: "custom_param1",
          p2: "custom_param2",
          p3: "custom_param3"
        }
      };

      const result = await TrackierSDK.createDynamicLink(config);
      setDynamicLink(result);
      showSnackbar('Sample dynamic link created successfully!');
    } catch (error) {
      console.error('Error creating dynamic link:', error);
      Alert.alert('Error', 'Failed to create dynamic link: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resolveDeeplink = async () => {
    if (!dynamicLink) {
      showSnackbar('Please create a dynamic link first or enter a URL to resolve');
      return;
    }

    setLoading(true);
    try {
      const result = await TrackierSDK.resolveDeeplinkUrl(dynamicLink);
      setResolvedData(result);
      showSnackbar('Deeplink resolved successfully!');
    } catch (error) {
      console.error('Error resolving deeplink:', error);
      Alert.alert('Error', 'Failed to resolve deeplink: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testResolveWithSampleUrl = async () => {
    const sampleUrl = 'https://trackier58.u9ilnk.me/d/g5Hizea0AX';
    setDynamicLink(sampleUrl);

    setLoading(true);
    try {
      const result = await TrackierSDK.resolveDeeplinkUrl(sampleUrl);
      setResolvedData(result);
      showSnackbar('Sample URL resolved successfully!');
    } catch (error) {
      console.error('Error resolving sample URL:', error);
      Alert.alert('Error', 'Failed to resolve sample URL: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resolveCustomUrl = async () => {
    if (!customUrl.trim()) {
      showSnackbar('Please enter a URL to resolve');
      return;
    }

    setLoading(true);
    try {
      const result = await TrackierSDK.resolveDeeplinkUrl(customUrl.trim());
      setResolvedData(result);
      showSnackbar('Custom URL resolved successfully!');
    } catch (error) {
      console.error('Error resolving custom URL:', error);
      Alert.alert('Error', 'Failed to resolve custom URL: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setDynamicLink('');
    setCustomUrl('https://trackier58.u9ilnk.me/d/g5Hizea0AX');
    setResolvedData(null);
    showSnackbar('Cleared all data');
  };

  const copyToClipboard = () => {
    if (dynamicLink) {
      Clipboard.setString(dynamicLink);
      showSnackbar('Dynamic link copied to clipboard!');
    }
  };

  const formatResolvedData = (data) => {
    if (!data) return null;
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      return {
        url: parsedData.url || 'N/A',
        sdkParams: parsedData.sdkParams || {},
        trackingParams: parsedData.trackingParams || {},
        attributionData: parsedData.attributionData || {},
        rawData: parsedData
      };
    } catch (error) {
      console.error('Error parsing resolved data:', error);
      return {
        rawData: data
      };
    }
  };

  const formattedData = formatResolvedData(resolvedData);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.mainContainer}
    >
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deeplink Resolver</Text>
        <View style={{ width: 24 }} />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Card 1: Generator & Resolvers */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dynamic Link Generator</Text>
            <Text style={styles.cardDesc}>
              Generate a test dynamic link pre-configured with marketing parameters, channel, and custom SDK metadata.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={createSampleDynamicLink}
              disabled={loading}
            >
              <Icon name="git-pull-request-outline" size={18} color="#fff" style={styles.btnIcon} />
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : 'Create Sample Dynamic Link'}
              </Text>
            </TouchableOpacity>

            {dynamicLink ? (
              <View style={styles.linkContainer}>
                <Text style={styles.linkText} numberOfLines={3}>
                  {dynamicLink}
                </Text>
                <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                  <Icon name="copy-outline" size={18} color="#4f46e5" />
                </TouchableOpacity>
              </View>
            ) : null}

            {dynamicLink ? (
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#10b981', marginTop: 12 }]}
                onPress={resolveDeeplink}
                disabled={loading}
              >
                <Icon name="key-outline" size={18} color="#fff" style={styles.btnIcon} />
                <Text style={styles.buttonText}>Resolve Current Link</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Card 2: Custom URL Resolver */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resolve Custom Deeplink</Text>
            <Text style={styles.cardDesc}>
              Enter any Trackier redirection or deep link URL to simulate attribution resolution.
            </Text>

            <Text style={styles.fieldLabel}>URL to Resolve *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Trackier URL..."
              placeholderTextColor="#94a3b8"
              value={customUrl}
              onChangeText={setCustomUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />

            <View style={styles.rowButtons}>
              <TouchableOpacity
                style={[styles.submitButton, { flex: 1, marginRight: 8 }]}
                onPress={resolveCustomUrl}
                disabled={loading || !customUrl.trim()}
              >
                <Icon name="analytics-outline" size={18} color="#fff" style={styles.btnIcon} />
                <Text style={styles.buttonText}>Resolve URL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.outlineButton, { flex: 1 }]}
                onPress={testResolveWithSampleUrl}
                disabled={loading}
              >
                <Text style={styles.outlineButtonText}>Sample Test</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.clearButton} onPress={clearData}>
              <Icon name="trash-outline" size={16} color="#ef4444" style={styles.btnIcon} />
              <Text style={styles.clearButtonText}>Clear Data & Console</Text>
            </TouchableOpacity>
          </View>

          {/* Card 3: Resolved Attribution Data */}
          {formattedData ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Attribution Inspector</Text>
              <Text style={styles.cardDesc}>
                Real-time output and campaign attribution parameters parsed by Trackier SDK resolver.
              </Text>

              {formattedData.url ? (
                <View style={styles.inspectorSection}>
                  <Text style={styles.inspectorLabel}>🔗 Resolved URL</Text>
                  <Text style={styles.inspectorVal}>{formattedData.url}</Text>
                </View>
              ) : null}

              {/* SDK Parameters */}
              {formattedData.sdkParams && Object.keys(formattedData.sdkParams).length > 0 ? (
                <View style={styles.inspectorSection}>
                  <Text style={styles.inspectorLabel}>📱 SDK Parameters</Text>
                  {Object.entries(formattedData.sdkParams).map(([key, value]) => (
                    <View key={key} style={styles.paramRow}>
                      <Text style={styles.paramKey}>{key}</Text>
                      <Text style={styles.paramValue}>{String(value)}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {/* Tracking Parameters */}
              {formattedData.trackingParams && Object.keys(formattedData.trackingParams).length > 0 ? (
                <View style={styles.inspectorSection}>
                  <Text style={styles.inspectorLabel}>🎯 Campaign & Tracking</Text>
                  {Object.entries(formattedData.trackingParams).map(([key, value]) => (
                    <View key={key} style={styles.paramRow}>
                      <Text style={styles.paramKey}>{key}</Text>
                      <Text style={styles.paramValue}>{String(value)}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {/* Raw JSON */}
              <TouchableOpacity
                style={styles.consoleHeader}
                onPress={() => setShowRawData(!showRawData)}
              >
                <Text style={styles.consoleTitle}>📄 {showRawData ? 'Hide Raw JSON' : 'Show Raw JSON'}</Text>
                <Icon
                  name={showRawData ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#94a3b8"
                />
              </TouchableOpacity>

              {showRawData ? (
                <View style={styles.consoleBox}>
                  <Text style={styles.consoleText}>
                    {JSON.stringify(formattedData.rawData, null, 2)}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Snackbar notification */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={styles.snackbar}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
          textColor: '#6366f1',
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc', // Slate 50
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
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '800',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 10,
  },
  clearButtonText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '800',
  },
  rowButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  btnIcon: {
    marginRight: 6,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginLeft: 8,
  },
  inspectorSection: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  inspectorLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inspectorVal: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  paramKey: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  paramValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 10,
  },
  consoleTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  consoleBox: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
  },
  consoleText: {
    fontSize: 11,
    color: '#38bdf8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 16,
  },
  snackbar: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
  },
});

export default DynamicLinkScreen;