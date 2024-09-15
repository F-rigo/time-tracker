import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { TimeRecord } from '../screens/HomeScreen';

interface DayRecordComponentProps {
  item: TimeRecord;
  openTimePicker: (day: TimeRecord, field: keyof TimeRecord) => void;
}

const DayRecordComponent: React.FC<DayRecordComponentProps> = ({ item, openTimePicker }) => {
  return (
    <View style={styles.dayContainer}>
      <Text style={styles.dateText}>{item.date}</Text>

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
};

const styles = StyleSheet.create({
  dayContainer: {
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
    marginLeft: 5,
    alignItems: 'center',
  },
});

export default DayRecordComponent;
