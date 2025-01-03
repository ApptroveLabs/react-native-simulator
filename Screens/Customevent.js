import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have the react-native-vector-icons installed
import { TrackierEvent, TrackierSDK } from 'react-native-trackier';
import { Snackbar } from 'react-native-paper'; // Import Snackbar


const CustomEventScreen = () => {
  const [eventId, setEventId] = useState('');
  const [revenue, setRevenue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [params, setParams] = useState([]);
  const [paramValues, setParamValues] = useState({});
  const [currencyDropdownVisible, setCurrencyDropdownVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false); // State to control Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message


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
    if (!eventId || !revenue || !selectedCurrency) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarVisible(true);
      return;
    }

    const revenueValue = parseFloat(revenue);
    if (isNaN(revenueValue)) {
      setSnackbarMessage('Revenue must be a valid number.');
      setSnackbarVisible(true); 
      return;
    }

    const trackierEvent = new TrackierEvent(eventId);
    trackierEvent.revenue = revenueValue;
    trackierEvent.currency = selectedCurrency;
    trackierEvent.orderId = 'CustomOrder123';

    params.forEach((paramKey, index) => {
      if (paramValues[paramKey]) {
        trackierEvent[`param${index + 1}`] = paramValues[paramKey];
      }
    });

    TrackierSDK.trackEvent(trackierEvent);

    setSnackbarMessage('Custom Event Submitted Successfully');
    setSnackbarVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Custom Event Tracking</Text>

          {/* Event ID Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Event ID"
            placeholderTextColor="#888"
            value={eventId}
            onChangeText={setEventId}
          />

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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  revenueInput: {
    color: '#000',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  dropdownItem: {
    padding: 10,
  },
  paramContainer: {
    marginBottom: 20,
  },
  deleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteText: {
    fontSize: 14,
    color: '#ff0000',
    marginRight: 5,
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

export default CustomEventScreen;
