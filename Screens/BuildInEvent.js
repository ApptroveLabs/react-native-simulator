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
import Icon from 'react-native-vector-icons/Ionicons'; // Import vector icons
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';
import { Snackbar } from 'react-native-paper'; // Import Snackbar

const BuiltInEventsScreen = ({ navigation }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [revenue, setRevenue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [params, setParams] = useState([]);
  const [paramValues, setParamValues] = useState({});
  const [eventDropdownVisible, setEventDropdownVisible] = useState(false);
  const [currencyDropdownVisible, setCurrencyDropdownVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false); // Snackbar visibility state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message

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

    setSnackbarMessage('Built-in Event Submitted Successfully');
    setSnackbarVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Welcome To Built-In Events</Text>

          {/* Event Dropdown */}
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setEventDropdownVisible(!eventDropdownVisible)}
          >
            <View style={styles.dropdownContent}>
              <Text style={styles.dropdownText}>
                {selectedEvent || 'Select Built-in Event'}
              </Text>
              <Icon
                name={eventDropdownVisible ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#333"
              />
            </View>
          </TouchableOpacity>
          {eventDropdownVisible && (
            <View style={styles.dropdownList}>
              <ScrollView style={{ maxHeight: 200 }}>
                {eventsList.map((event, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedEvent(event);
                      setEventDropdownVisible(false);
                    }}
                  >
                    <Text>{event}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Revenue Input */}
          <TextInput
            style={[styles.input, styles.revenueInput]}
            placeholder="Enter Revenue"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={revenue}
            onChangeText={setRevenue}
          />

          {/* Currency Dropdown */}
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setCurrencyDropdownVisible(!currencyDropdownVisible)}
          >
            <View style={styles.dropdownContent}>
              <Text style={styles.dropdownText}>
                {selectedCurrency || 'Select Currency'}
              </Text>
              <Icon
                name={currencyDropdownVisible ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#333"
              />
            </View>
          </TouchableOpacity>
          {currencyDropdownVisible && (
            <View style={styles.dropdownList}>
              <ScrollView style={{ maxHeight: 200 }}>
                {currencyList.map((currency, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCurrency(currency);
                      setCurrencyDropdownVisible(false);
                    }}
                  >
                    <Text>{currency}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Parameters */}
          {params.map((paramKey, index) => (
            <View key={index} style={styles.paramContainer}>
              <TextInput
                style={styles.input}
                placeholder={`Param ${index + 1}`}
                placeholderTextColor="#888"
                value={paramValues[paramKey] || ''}
                onChangeText={(value) => handleParamChange(paramKey, value)}
              />
              <View style={styles.deleteContainer}>
                <Text style={styles.deleteText}>Delete Param {index + 1}</Text>
                <TouchableOpacity onPress={() => deleteParam(index)} style={styles.deleteButton}>
                  <Image
                    source={require('../assets/remove.png')} // Ensure the path matches your project
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add Parameter Button */}
          <TouchableOpacity style={styles.addButton} onPress={addParam}>
            <Text style={styles.buttonText}>Add Parameter</Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Event</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        action={{
          label: 'Close',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Add your styles here
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  revenueInput: {
    marginTop: 10,
  },
  paramContainer: {
    marginBottom: 15,
  },
  deleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteText: {
    color: '#ff0000',
    fontSize: 14,
  },
  deleteButton: {
    padding: 5,
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },

});

export default BuiltInEventsScreen;
