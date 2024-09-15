import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import HomeScreenStyles from '../styles/HomeScreenStyles'; // Importing styles
import ButtonComponent from '../components/ButtonComponent'; // Importing ButtonComponent
import DayRecordComponent from '../components/DayRecordComponent'; // Importing DayRecordComponent
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [currentField, setCurrentField] = useState<keyof TimeRecord | null>(null);
  const [selectedDay, setSelectedDay] = useState<TimeRecord | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const getMonthKey = (date: Date) => `time_records_${date.getFullYear()}_${date.getMonth() + 1}`;

  const loadTimeRecords = async () => {
    const monthKey = getMonthKey(currentMonth);
    try {
      const jsonValue = await AsyncStorage.getItem(monthKey);
      if (jsonValue != null) {
        setDays(JSON.parse(jsonValue));
      } else {
        setDays(getDefaultWeekDays());
      }
    } catch (error) {
      console.log('Error loading time records:', error);
    }
  };

  const saveTimeRecords = async (timeRecords: TimeRecord[]) => {
    const monthKey = getMonthKey(currentMonth);
    try {
      await AsyncStorage.setItem(monthKey, JSON.stringify(timeRecords));
    } catch (error) {
      console.log('Error saving time records:', error);
    }
  };

  useEffect(() => {
    loadTimeRecords();
  }, [currentMonth]);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set' && selectedTime && selectedDay && currentField) {
      const timeString = selectedTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      const updatedDays = days.map((day) => (day.date === selectedDay.date ? { ...day, [currentField]: timeString } : day));
      setDays(updatedDays);
      saveTimeRecords(updatedDays);
    }
    setPickerVisible(false);
  };

  const getDefaultWeekDays = (): TimeRecord[] => {
    const days: TimeRecord[] = [];
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
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
  const openTimePicker = (day: TimeRecord, field: keyof TimeRecord) => {
    setCurrentField(field);
    setSelectedDay(day);
    setPickerVisible(true);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'prev' ? -1 : 1));
    setCurrentMonth(newMonth);
  };

  return (
    <View style={HomeScreenStyles.container}>
      <View style={HomeScreenStyles.chevronContainer}>
        <AntDesign name="left" size={24} onPress={() => changeMonth('prev')} />
        <Text style={HomeScreenStyles.monthText}>{currentMonth.toLocaleDateString('it-IT', { month: 'long' }).toUpperCase()}</Text>
        <AntDesign name="right" size={24} onPress={() => changeMonth('next')} />
      </View>

      <FlatList
        data={days}
        renderItem={({ item }) => <DayRecordComponent item={item} openTimePicker={openTimePicker} />}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {pickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}

      <ButtonComponent text="Visualizza Rapporto" onPress={() => navigation.navigate('Report', { timeRecords: days })} />
    </View>
  );
};

export default HomeScreen;
