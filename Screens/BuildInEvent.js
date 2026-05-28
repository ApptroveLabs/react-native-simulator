import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TrackierSDK, TrackierEvent } from 'react-native-trackier';
import { Snackbar } from 'react-native-paper';

const BuiltInEventsScreen = ({ navigation }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [revenue, setRevenue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [params, setParams] = useState([]);
  const [paramValues, setParamValues] = useState({});
  const [eventDropdownVisible, setEventDropdownVisible] = useState(false);
  const [currencyDropdownVisible, setCurrencyDropdownVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const eventsList = [
    "ADD_TO_CART",
    "LEVEL_ACHIEVED",
    "ADD_TO_WISHLIST",
    "COMPLETE_REGISTRATION",
    "TUTORIAL_COMPLETION",
    "PURCHASE",
    "SUBSCRIBE",
    "START_TRIAL",
    "ACHIEVEMENT_UNLOCKED",
    "CONTENT_VIEW",
    "TRAVEL_BOOKING",
    "SHARE",
    "INVITE",
    "LOGIN",
    "UPDATE",
  ];

  const currencyList = [
    "USD", "EUR", "GBP", "INR", "AUD", "CAD", "SGD", "CHF", "MYR", "JPY",
    "ARS", "BHD", "BWP", "BRL", "BND", "BGN", "CLP", "COP", "HRK", "CZK",
    "DKK", "AED", "HKD", "HUF", "ISK", "IDR", "ILS", "KZT", "KWD", "LYD",
    "MUR", "MXN", "NPR", "NZD", "NOK", "OMR", "PKR", "PHP", "PLN", "RUB",
    "RON", "SAR", "ZAR", "KRW", "LKR", "SEK", "TWD", "THB", "TTD", "TRY",
    "VEF", "ZMW", "YER", "XPF", "VND", "VES"
  ];

  const addParam = () => {
    if (params.length < 10) {
      const newParamKey = `param${params.length + 1}`;
      setParams([...params, newParamKey]);
    } else {
      setSnackbarMessage('You can only add up to 10 parameters.');
      setSnackbarVisible(true);
    }
  };

  const deleteParam = (index) => {
    const updatedParams = params.filter((_, i) => i !== index);
    const updatedParamValues = { ...paramValues };
    delete updatedParamValues[params[index]];
    setParams(updatedParams);
    setParamValues(updatedParamValues);
  };

  const handleParamChange = (key, value) => {
    setParamValues({ ...paramValues, [key]: value });
  };

  const handleSubmit = () => {
    if (!selectedEvent || !revenue || !selectedCurrency) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarVisible(true);
      return;
    }

    let trackierEvent;

    switch (selectedEvent) {
      case "ADD_TO_CART":
        trackierEvent = new TrackierEvent(TrackierEvent.ADD_TO_CART);
        break;
      case "LEVEL_ACHIEVED":
        trackierEvent = new TrackierEvent(TrackierEvent.LEVEL_ACHIEVED);
        break;
      case "ADD_TO_WISHLIST":
        trackierEvent = new TrackierEvent(TrackierEvent.ADD_TO_WISHLIST);
        break;
      case "COMPLETE_REGISTRATION":
        trackierEvent = new TrackierEvent(TrackierEvent.COMPLETE_REGISTRATION);
        break;
      case "TUTORIAL_COMPLETION":
        trackierEvent = new TrackierEvent(TrackierEvent.TUTORIAL_COMPLETION);
        break;
      case "PURCHASE":
        trackierEvent = new TrackierEvent(TrackierEvent.PURCHASE);
        break;
      case "SUBSCRIBE":
        trackierEvent = new TrackierEvent(TrackierEvent.SUBSCRIBE);
        break;
      case "START_TRIAL":
        trackierEvent = new TrackierEvent(TrackierEvent.START_TRIAL);
        break;
      case "ACHIEVEMENT_UNLOCKED":
        trackierEvent = new TrackierEvent(TrackierEvent.ACHIEVEMENT_UNLOCKED);
        break;
      case "CONTENT_VIEW":
        trackierEvent = new TrackierEvent(TrackierEvent.CONTENT_VIEW);
        break;
      case "TRAVEL_BOOKING":
        trackierEvent = new TrackierEvent(TrackierEvent.TRAVEL_BOOKING);
        break;
      case "SHARE":
        trackierEvent = new TrackierEvent(TrackierEvent.SHARE);
        break;
      case "INVITE":
        trackierEvent = new TrackierEvent(TrackierEvent.INVITE);
        break;
      case "LOGIN":
        trackierEvent = new TrackierEvent(TrackierEvent.LOGIN);
        break;
      case "UPDATE":
        trackierEvent = new TrackierEvent(TrackierEvent.UPDATE);
        break;
      default:
        trackierEvent = new TrackierEvent(TrackierEvent.LOGIN);
        break;
    }

    const revenueValue = parseFloat(revenue);
    if (isNaN(revenueValue)) {
      setSnackbarMessage('Revenue must be a valid number.');
      setSnackbarVisible(true);
      return;
    }

    trackierEvent.revenue = revenueValue;
    trackierEvent.currency = selectedCurrency;

    params.forEach((paramKey, index) => {
      if (paramValues[paramKey]) {
        trackierEvent[`param${index + 1}`] = paramValues[paramKey];
      }
    });

    TrackierSDK.trackEvent(trackierEvent);

    setSnackbarMessage('Built-in Event Tracked Successfully');
    setSnackbarVisible(true);
  };

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
        <Text style={styles.headerTitle}>Built-In Events</Text>
        <View style={{ width: 24 }} />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Simulate Event Data</Text>

            {/* Event Dropdown */}
            <Text style={styles.fieldLabel}>Select Built-in Event *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setEventDropdownVisible(!eventDropdownVisible)}
            >
              <View style={styles.dropdownContent}>
                <Text style={[styles.dropdownText, !selectedEvent && styles.placeholderText]}>
                  {selectedEvent || 'Select Event Type'}
                </Text>
                <Icon
                  name={eventDropdownVisible ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#64748b"
                />
              </View>
            </TouchableOpacity>
            {eventDropdownVisible && (
              <View style={styles.dropdownList}>
                <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                  {eventsList.map((event, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedEvent(event);
                        setEventDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.itemText}>{event}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Revenue Input */}
            <Text style={styles.fieldLabel}>Event Revenue *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 30.00"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={revenue}
              onChangeText={setRevenue}
            />

            {/* Currency Dropdown */}
            <Text style={styles.fieldLabel}>Currency *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setCurrencyDropdownVisible(!currencyDropdownVisible)}
            >
              <View style={styles.dropdownContent}>
                <Text style={[styles.dropdownText, !selectedCurrency && styles.placeholderText]}>
                  {selectedCurrency || 'Select Currency'}
                </Text>
                <Icon
                  name={currencyDropdownVisible ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#64748b"
                />
              </View>
            </TouchableOpacity>
            {currencyDropdownVisible && (
              <View style={styles.dropdownList}>
                <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                  {currencyList.map((currency, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedCurrency(currency);
                        setCurrencyDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.itemText}>{currency}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Parameters header */}
            {params.length > 0 && <Text style={styles.paramsHeader}>Custom Parameters</Text>}

            {/* Parameter Fields List */}
            {params.map((paramKey, index) => (
              <View key={index} style={styles.paramContainer}>
                <View style={styles.paramInputRow}>
                  <TextInput
                    style={[styles.input, styles.paramInput]}
                    placeholder={`Param ${index + 1} Value`}
                    placeholderTextColor="#94a3b8"
                    value={paramValues[paramKey] || ''}
                    onChangeText={(value) => handleParamChange(paramKey, value)}
                  />
                  <TouchableOpacity onPress={() => deleteParam(index)} style={styles.deleteButton}>
                    <Icon name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Action Buttons */}
            <TouchableOpacity style={styles.addButton} onPress={addParam}>
              <Icon name="add-circle-outline" size={20} color="#4f46e5" style={styles.btnIcon} />
              <Text style={styles.addButtonText}>Add Custom Parameter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Icon name="send-outline" size={18} color="#fff" style={styles.btnIcon} />
              <Text style={styles.submitButtonText}>Track Event Now</Text>
            </TouchableOpacity>
          </View>
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
  formCard: {
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
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  placeholderText: {
    color: '#94a3b8',
    fontWeight: '500',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: -10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
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
  paramsHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 12,
  },
  paramContainer: {
    marginBottom: 12,
  },
  paramInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paramInput: {
    flex: 1,
    marginBottom: 0,
  },
  deleteButton: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    borderWidth: 2,
    borderColor: '#4f46e5',
    borderRadius: 16,
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '800',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  btnIcon: {
    marginRight: 6,
  },
  snackbar: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
  },
});

export default BuiltInEventsScreen;
