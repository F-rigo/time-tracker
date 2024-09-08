import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { PDFDocument, Page } from 'react-native-pdf-lib';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { TimeRecord } from './HomeScreen';


// Definir o tipo para a navegação e os parâmetros da rota
type ReportScreenProps = StackScreenProps<RootStackParamList, 'Report'>;

const ReportScreen = ({ route }: ReportScreenProps) => {
  const { timeRecords } = route.params;
  console.log('Time Records:', timeRecords);
  // Function to calculate extra hours, considering lunch break, and format it as HH:MM
  const calculateExtraHours = (entry: string | null, lunchStart: string | null, lunchEnd: string | null, exit: string | null): string => {
    if (!entry || !exit) return "N/A"; // If entry or exit is not set, return "N/A"

    // Convert time strings (entry and exit) to Date objects
    const [entryHour, entryMinute] = entry.split(':').map(Number);
    const [exitHour, exitMinute] = exit.split(':').map(Number);

    const entryDate = new Date();
    entryDate.setHours(entryHour, entryMinute, 0);

    const exitDate = new Date();
    exitDate.setHours(exitHour, exitMinute, 0);

    // Calculate lunch duration if lunch start and end are set
    let lunchDuration = 0; // In hours
    if (lunchStart && lunchEnd) {
      const [lunchStartHour, lunchStartMinute] = lunchStart.split(':').map(Number);
      const [lunchEndHour, lunchEndMinute] = lunchEnd.split(':').map(Number);

      const lunchStartDate = new Date();
      lunchStartDate.setHours(lunchStartHour, lunchStartMinute, 0);

      const lunchEndDate = new Date();
      lunchEndDate.setHours(lunchEndHour, lunchEndMinute, 0);

      // Calculate lunch duration in hours
      lunchDuration = (lunchEndDate.getTime() - lunchStartDate.getTime()) / (1000 * 60 * 60);
    }

    // Calculate total worked hours excluding lunch
    const hoursWorked = (exitDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60) - lunchDuration;
    const regularHours = 8; // Regular working hours (8 hours)

    // Calculate extra hours
    const extraHours = hoursWorked > regularHours ? hoursWorked - regularHours : 0;

    // Convert extra hours from decimal to hours and minutes (HH:MM format)
    const extraHoursInt = Math.floor(extraHours); // Hours part
    const extraMinutes = Math.round((extraHours - extraHoursInt) * 60); // Minutes part

    return `${extraHoursInt}:${extraMinutes.toString().padStart(2, '0')}`; // Return formatted as HH:MM
  };

  // Function to generate and share the PDF report
  const generateAndSharePDF = async () => {
    try {
      const currentMonth = new Date().toLocaleDateString('it-IT', { month: 'long' });

      const htmlContent = `
  <html>
    <body>
      <h1>Relazione delle Ore - ${currentMonth}</h1>
      <ul>
        ${timeRecords.map(record => `
          <li>${record.date}: Entrata: ${record.entry || '--'}, Uscita: ${record.exit || '--'}, Ore Extra: ${calculateExtraHours(record.entry, record.lunchStart, record.lunchEnd, record.exit)}</li>
        `).join('')}
      </ul>
    </body>
  </html>
`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF saved to: ", uri);

      // Compartilhar o PDF gerado
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert('Il sistema di condivisione non è disponibile su questa piattaforma');
      }
    } catch (error) {
      console.log('Errore durante la generazione o la condivisione del PDF', error);
    }
  };

  const renderItem = ({ item }: { item: TimeRecord }) => {
    const date = item.date ? String(item.date) : 'Data sconosciuta';
    const entry = item.entry && item.entry.trim() !== '' ? item.entry : '--';
    const exit = item.exit && item.exit.trim() !== '' ? item.exit : '--';
    const lunchStart = item.lunchStart && item.lunchStart.trim() !== '' ? item.lunchStart : '--';
    const lunchEnd = item.lunchEnd && item.lunchEnd.trim() !== '' ? item.lunchEnd : '--';
    const extraHours = calculateExtraHours(entry, lunchStart, lunchEnd, exit);

    return (
      <View style={styles.recordRow}>

        <Text style={styles.dateText}>{date}</Text>


        <View style={styles.timeRow}>
          <Text>Entrata: {entry}</Text>
          <Text style={styles.timeText}>Uscita: {exit}</Text>
          <Text style={styles.timeText}>Ore Extra: {extraHours}</Text>
        </View>
      </View>
    );
  };




  return (
    <View style={styles.container}>
      <FlatList
        data={timeRecords}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{ paddingBottom: 100 }} // Padding at the bottom, similar to HomeScreen
      />

      <Pressable style={styles.button} onPress={generateAndSharePDF}>

        <Text style={styles.buttonText}>Condividi Rapporto PDF</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  recordRow: {
    marginBottom: 20, // Separação entre os registros
  },
  dateText: {
    fontWeight: 'bold', // Destaque para a data
    fontSize: 16,
    marginBottom: 5, // Espaçamento entre a data e os horários
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espaçamento entre os horários
  },
  timeText: {
    marginLeft: 10, // Espaçamento entre cada elemento na linha
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

export default ReportScreen;
