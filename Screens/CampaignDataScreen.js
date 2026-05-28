import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TrackierSDK, TrackierEvent } from 'react-native-trackier';

const CampaignDataScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState('MtXCvY3Bdu');
  const [trackResult, setTrackResult] = useState('');
  const [trackSuccess, setTrackSuccess] = useState(false);
  const [campaignData, setCampaignData] = useState(null);

  const handleGetCampaignData = async () => {
    setLoading(true);
    setCampaignData(null);

    // Give a slight visual delay for premium loading experience
    setTimeout(() => {
      const data = {};

      const sdkMethods = {
        'Ad Name': 'getAd',
        'Ad ID': 'getAdID',
        'Campaign Name': 'getCampaign',
        'Campaign ID': 'getCampaignID',
        'Ad Set Name': 'getAdSet',
        'Ad Set ID': 'getAdSetID',
        'Click ID': 'getClickId',
        'Partner ID': 'getPid',
        'Deep Link Value': 'getDlv',
        'Is Retargeting': 'getIsRetargeting',
        'P1': 'getP1',
        'P2': 'getP2',
        'P3': 'getP3',
        'P4': 'getP4',
        'P5': 'getP5',
      };

      for (const [label, method] of Object.entries(sdkMethods)) {
        try {
          if (TrackierSDK && typeof TrackierSDK[method] === 'function') {
            const val = TrackierSDK[method]();
            data[label] = val !== undefined && val !== null ? String(val) : 'N/A';
          } else {
            data[label] = 'Method N/A';
          }
        } catch (e) {
          data[label] = 'Error';
        }
      }

      setCampaignData(data);
      setLoading(false);
    }, 800);
  };

  const handleTrackEvent = () => {
    if (!eventId.trim()) {
      setTrackResult('Event ID cannot be empty');
      setTrackSuccess(false);
      return;
    }

    try {
      const event = new TrackierEvent(eventId.trim());
      event.param1 = 'Campaign_Data_Screen';
      event.param2 = 'manual_trigger';
      TrackierSDK.trackEvent(event);

      setTrackResult(`Event successfully tracked!\nID: ${eventId.trim()}`);
      setTrackSuccess(true);
    } catch (error) {
      setTrackResult(`Error tracking event: ${error.message}`);
      setTrackSuccess(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-outline" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campaign Data</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card 1 — Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Campaign Data Overview</Text>
          <Text style={styles.cardDesc}>
            View real-time attribution and campaign data from the Apptrove/Trackier SDK.
            Use this tool to verify your acquisition tracking integration.
          </Text>
        </View>

        {/* Card 2 — Get Campaign Data */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Attribution Data</Text>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetCampaignData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" style={{ marginRight: 8 }} />
            ) : (
              <Icon name="analytics-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            )}
            <Text style={styles.primaryButtonText}>
              {loading ? 'Fetching...' : 'Get Campaign Data'}
            </Text>
          </TouchableOpacity>

          {/* Monospace Console View */}
          {(campaignData || loading) && (
            <View style={styles.consoleBox}>
              {loading ? (
                <View style={styles.consoleLoading}>
                  <ActivityIndicator size="small" color="#38bdf8" />
                  <Text style={styles.consoleLoadingText}>Querying SDK attributes...</Text>
                </View>
              ) : (
                <View>
                  <View style={styles.consoleHeader}>
                    <Text style={styles.consoleHeaderText}>SDK ATTRIBUTION CONSOLE</Text>
                    <View style={styles.consoleGreenDot} />
                  </View>
                  {Object.entries(campaignData).map(([key, val]) => (
                    <View key={key} style={styles.consoleRow}>
                      <Text style={styles.consoleKey}>{key}:</Text>
                      <Text style={styles.consoleVal}>{val || 'NULL'}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Card 3 — Track Event */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Track Event with Campaign</Text>
          <Text style={styles.cardDesc}>
            Enter an event ID below to track it manually. This helps verify event attribution links.
          </Text>

          <View style={styles.inputContainer}>
            <Icon name="key-outline" size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Event ID"
              placeholderTextColor="#94a3b8"
              value={eventId}
              onChangeText={setEventId}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleTrackEvent}>
            <Icon name="paper-plane-outline" size={18} color="#4f46e5" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryButtonText}>Track Event</Text>
          </TouchableOpacity>

          {trackResult ? (
            <View
              style={[
                styles.resultBox,
                trackSuccess ? styles.resultSuccess : styles.resultError,
              ]}
            >
              <Text style={[styles.resultText, trackSuccess ? styles.textSuccess : styles.textError]}>
                {trackResult}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  consoleBox: {
    backgroundColor: '#0f172a', // Dark Slate 900
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: '#1e293b',
  },
  consoleLoading: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consoleLoadingText: {
    color: '#38bdf8',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 12,
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
  consoleHeaderText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  consoleGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  consoleRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  consoleKey: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    width: 140,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textTransform: 'uppercase',
  },
  consoleVal: {
    color: '#38bdf8', // Cyan
    fontSize: 12,
    flex: 1,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
    marginTop: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#4f46e5',
    borderRadius: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: '800',
  },
  resultBox: {
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
  },
  resultSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  resultError: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  resultText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  textSuccess: {
    color: '#16a34a',
  },
  textError: {
    color: '#dc2626',
  },
});

export default CampaignDataScreen;
