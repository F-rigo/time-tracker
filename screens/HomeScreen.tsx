import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export interface TimeRecord {
  date: string;
  entry: string | '';
  lunchStart: string | null;
  lunchEnd: string | null;
  exit: string | null;
}

const HomeScreen = () => {
  const [days, setDays] = useState<TimeRecord[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [currentField, setCurrentField] = useState<keyof TimeRecord | null>(null);
  const [selectedDay, setSelectedDay] = useState<TimeRecord | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Function to load time records from AsyncStorage
  const loadTimeRecords = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@time_records');
      if (jsonValue != null) {
        const loadedRecords = JSON.parse(jsonValue);
        setDays(loadedRecords); // Set the loaded records
        console.log('Loaded records:', loadedRecords); // Log loaded data
      } else {
        console.log('No records found, initializing with default values.');
        setDays(getDefaultWeekDays()); // Initialize with default values if no data is found
      }
    } catch (error) {
      console.log('Error loading time records:', error);
    }
  };

  // Function to save time records to AsyncStorage
  const saveTimeRecords = async (timeRecords: TimeRecord[]) => {
    try {
      const jsonValue = JSON.stringify(timeRecords);
      await AsyncStorage.setItem('@time_records', jsonValue);
      console.log('Time records saved');
    } catch (error) {
      console.log('Error saving time records:', error);
    }
  };

  // Initialize the component by loading time records
  useEffect(() => {
    loadTimeRecords(); // Load time records when the component is mounted
  }, []);

  // Function to handle time change and save updated records
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set' && selectedTime && selectedDay && currentField) {
      const timeString = selectedTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

      const updatedDays = days.map((day) =>
        day.date === selectedDay.date ? { ...day, [currentField]: timeString } : day
      );

      setDays(updatedDays); // Update the state with new times
      saveTimeRecords(updatedDays); // Save updated records
    }
    setPickerVisible(false);
  };

  // Function to get default week days in case there's no saved data
  const getDefaultWeekDays = (): TimeRecord[] => {
    const days: TimeRecord[] = [];
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const startDate = new Date(year, month, 1); // First day of the month
    const endDate = new Date(year, month + 1, 0); // Last day of the month

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        days.push({
          date: date.toLocaleDateString('it-IT'),
          entry: '',
          lunchStart: null,
          lunchEnd: null,
          exit: null,
        });
      }
    }

    return days;
  };

  // Function to render the list of days
  const renderDayInput = ({ item }: { item: TimeRecord }) => (
    <View style={styles.dayContainer}>
      {/* Display the date on a separate line */}
      <Text style={styles.dateText}>{item.date}</Text>

      {/* Display the inputs below the date */}
      <View style={styles.inputRow}>
        <Pressable style={styles.input} onPress={() => openTimePicker(item, 'entry')}>
          <Text>{item.entry || 'Entrata'}</Text>
        </Pressable>
        <Pressable style={styles.input} onPress={() => openTimePicker(item, 'lunchStart')}>
          <Text>{item.lunchStart || 'Inizio Pranzo'}</Text>
        </Pressable>
        <Pressable style={styles.input} onPress={() => openTimePicker(item, 'lunchEnd')}>
          <Text>{item.lunchEnd || 'Fine Pranzo'}</Text>
        </Pressable>
        <Pressable style={styles.input} onPress={() => openTimePicker(item, 'exit')}>
          <Text>{item.exit || 'Uscita'}</Text>
        </Pressable>
      </View>
    </View>
  );


  // Function to open the time picker
  const openTimePicker = (day: TimeRecord, field: keyof TimeRecord) => {
    setCurrentField(field);
    setSelectedDay(day);
    setPickerVisible(true);
  };

  return (
    <View style={styles.container}>
      {days.length > 0 ? (
        <FlatList
          data={days}
          renderItem={renderDayInput}
          keyExtractor={(item) => item.date}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <Text>Caricando orari...</Text> // Display loading message if no data is found
      )}

      {pickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Report', { timeRecords: days })}
      >
        <Text style={styles.buttonText}>Visualizza Rapporto</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  dayContainer: {
    marginBottom: 15, // Add some space between days
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5, // Space between the date and inputs
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: '#ccc',
    marginLeft: 5, // Space between inputs
    alignItems: 'center', // Center text inside the input
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default HomeScreen;
