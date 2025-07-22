import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TrackierSDK } from 'react-native-trackier';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

const DynamicLinkScreen = () => {
  const navigation = useNavigation();
  const [dynamicLink, setDynamicLink] = useState('');
  const [customUrl, setCustomUrl] = useState('https://trackier58.u9ilnk.me/d/g5Hizea0AX');
  const [resolvedData, setResolvedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

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
      Alert.alert('Success', 'Sample dynamic link created successfully!');
    } catch (error) {
      console.error('Error creating dynamic link:', error);
      Alert.alert('Error', 'Failed to create dynamic link: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resolveDeeplink = async () => {
    if (!dynamicLink) {
      Alert.alert('Error', 'Please create a dynamic link first or enter a URL to resolve');
      return;
    }

    setLoading(true);
    try {
      const result = await TrackierSDK.resolveDeeplinkUrl(dynamicLink);
      setResolvedData(result);
      Alert.alert('Success', 'Deeplink resolved successfully!');
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
      Alert.alert('Success', 'Sample URL resolved successfully!');
    } catch (error) {
      console.error('Error resolving sample URL:', error);
      Alert.alert('Error', 'Failed to resolve sample URL: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resolveCustomUrl = async () => {
    if (!customUrl.trim()) {
      Alert.alert('Error', 'Please enter a URL to resolve');
      return;
    }

    setLoading(true);
    try {
      const result = await TrackierSDK.resolveDeeplinkUrl(customUrl.trim());
      setResolvedData(result);
      Alert.alert('Success', 'Custom URL resolved successfully!');
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
  };

  const testToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Toast Test',
      text2: 'This is a test toast notification',
      position: 'top',
      visibilityTime: 3000,
    });
    console.log("Manual toast test triggered");
  };

  const copyToClipboard = () => {
    if (dynamicLink) {
      Clipboard.setString(dynamicLink);
      Alert.alert('Copied!', 'Dynamic link copied to clipboard');
    }
  };

  const formatResolvedData = (data) => {
    if (!data) return null;
    
    try {
      // If data is already a string, try to parse it
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

  const renderResolvedData = (data) => {
    const formattedData = formatResolvedData(data);
    if (!formattedData) return null;

    return (
      <View style={styles.resolvedDataContainer}>
        {/* URL Section */}
        {formattedData.url && (
          <View style={styles.dataSection}>
            <Text style={styles.dataSectionTitle}>🔗 Resolved URL</Text>
            <Text style={styles.dataSectionValue}>{formattedData.url}</Text>
          </View>
        )}

        {/* SDK Parameters */}
        {formattedData.sdkParams && Object.keys(formattedData.sdkParams).length > 0 && (
          <View style={styles.dataSection}>
            <Text style={styles.dataSectionTitle}>📱 SDK Parameters</Text>
            {Object.entries(formattedData.sdkParams).map(([key, value]) => (
              <View key={key} style={styles.paramRow}>
                <Text style={styles.paramKey}>{key}:</Text>
                <Text style={styles.paramValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tracking Parameters */}
        {formattedData.trackingParams && Object.keys(formattedData.trackingParams).length > 0 && (
          <View style={styles.dataSection}>
            <Text style={styles.dataSectionTitle}>🎯 Tracking Parameters</Text>
            {Object.entries(formattedData.trackingParams).map(([key, value]) => (
              <View key={key} style={styles.paramRow}>
                <Text style={styles.paramKey}>{key}:</Text>
                <Text style={styles.paramValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Attribution Data */}
        {formattedData.attributionData && Object.keys(formattedData.attributionData).length > 0 && (
          <View style={styles.dataSection}>
            <Text style={styles.dataSectionTitle}>📊 Attribution Data</Text>
            {Object.entries(formattedData.attributionData).map(([key, value]) => (
              <View key={key} style={styles.paramRow}>
                <Text style={styles.paramKey}>{key}:</Text>
                <Text style={styles.paramValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Raw Data Toggle */}
        <View style={styles.rawDataSection}>
          <TouchableOpacity
            style={styles.rawDataToggle}
            onPress={() => setShowRawData(!showRawData)}
          >
            <Text style={styles.rawDataToggleText}>
              {showRawData ? '📄 Hide Raw JSON' : '📄 Show Raw JSON'}
            </Text>
          </TouchableOpacity>
          
          {showRawData && (
            <View style={styles.rawDataContainer}>
              <Text style={styles.rawDataText}>
                {JSON.stringify(formattedData.rawData, null, 2)}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Dynamic Link & Deeplink Resolver</Text>
          
          {/* Main Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={createSampleDynamicLink}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creating...' : 'Create Sample Dynamic Link'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={resolveDeeplink}
              disabled={loading || !dynamicLink}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Resolving...' : 'Resolve Current Link'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={testResolveWithSampleUrl}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                Test with Sample URL
              </Text>
            </TouchableOpacity>

                             <TouchableOpacity
                   style={[styles.button, styles.clearButton]}
                   onPress={clearData}
                 >
                   <Text style={styles.buttonText}>Clear All Data</Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                   style={[styles.button, styles.testToastButton]}
                   onPress={testToast}
                 >
                   <Text style={styles.buttonText}>Test Toast</Text>
                 </TouchableOpacity>
          </View>

          {/* Custom URL Input Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resolve Custom URL</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Trackier URL to resolve..."
                value={customUrl}
                onChangeText={setCustomUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <TouchableOpacity
                style={[styles.button, styles.resolveButton]}
                onPress={resolveCustomUrl}
                disabled={loading || !customUrl.trim()}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Resolving...' : 'Resolve URL'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Generated Dynamic Link */}
          {dynamicLink && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Generated Dynamic Link</Text>
              <View style={styles.linkContainer}>
                <Text style={styles.linkText} numberOfLines={3}>
                  {dynamicLink}
                </Text>
                <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Resolved Data Display */}
          {resolvedData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resolved Data</Text>
              {renderResolvedData(resolvedData)}
            </View>
          )}

          {/* Back Button */}
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  testButton: {
    backgroundColor: '#FF9500',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  testToastButton: {
    backgroundColor: '#FF9500',
  },
  backButton: {
    backgroundColor: '#8E8E93',
  },
  resolveButton: {
    backgroundColor: '#5856D6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#007AFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  dataContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  dataText: {
    fontSize: 12,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resolvedDataContainer: {
    marginTop: 8,
  },
  dataSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  dataSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dataSectionValue: {
    fontSize: 12,
    color: '#007AFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  paramKey: {
    fontSize: 12,
    fontWeight: '500',
    color: '#495057',
    flex: 1,
  },
  paramValue: {
    fontSize: 12,
    color: '#6c757d',
    flex: 2,
    textAlign: 'right',
  },
  rawDataSection: {
    marginTop: 16,
  },
  rawDataToggle: {
    backgroundColor: '#6c757d',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  rawDataToggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  rawDataContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  rawDataText: {
    fontSize: 10,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  backButtonContainer: {
    marginTop: 20,
  },
});

export default DynamicLinkScreen;