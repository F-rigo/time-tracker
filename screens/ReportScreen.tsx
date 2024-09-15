import React, { useMemo } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { TimeRecord } from './HomeScreen';
import { calculateExtraHours, calculateTotalExtraHours } from '../utils/timeCalculations'; // Utilities
import ReportScreenStyles from '../styles/ReportScreenStyles'; // Styles

type ReportScreenProps = StackScreenProps<RootStackParamList, 'Report'>;

const ReportScreen = ({ route }: ReportScreenProps) => {
  const { timeRecords } = route.params;

  // Calculate total extra hours
  const totalExtraHours = useMemo(() => calculateTotalExtraHours(timeRecords), [timeRecords]);

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
            <h2>Totale Ore Extra: ${totalExtraHours}</h2>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF saved to: ", uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert('Il sistema di condivisione non è disponibile su questa piattaforma');
      }
    } catch (error) {
      console.log('Errore durante la generazione o la condivisione del PDF', error);
    }
  };

  // Render function for each item in the list
  const renderItem = ({ item }: { item: TimeRecord }) => {
    const date = item.date ? String(item.date) : 'Data sconosciuta';
    const entry = item.entry && item.entry.trim() !== '' ? item.entry : '--';
    const exit = item.exit && item.exit.trim() !== '' ? item.exit : '--';
    const lunchStart = item.lunchStart && item.lunchStart.trim() !== '' ? item.lunchStart : '--';
    const lunchEnd = item.lunchEnd && item.lunchEnd.trim() !== '' ? item.lunchEnd : '--';
    const extraHours = calculateExtraHours(entry, lunchStart, lunchEnd, exit);

    return (
      <View style={ReportScreenStyles.recordRow}>
        <Text style={ReportScreenStyles.dateText}>{date}</Text>
        <View style={ReportScreenStyles.timeRow}>
          <Text>Entrata: {entry}</Text>
          <Text style={ReportScreenStyles.timeText}>Uscita: {exit}</Text>
          <Text style={ReportScreenStyles.timeText}>Ore Extra: {extraHours}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={ReportScreenStyles.container}>
      <FlatList
        data={timeRecords}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <Text style={ReportScreenStyles.totalText}>Totale Ore Extra: {totalExtraHours}</Text>
      <Pressable style={ReportScreenStyles.button} onPress={generateAndSharePDF}>
        <Text style={ReportScreenStyles.buttonText}>Condividi Rapporto PDF</Text>
      </Pressable>
    </View>
  );
};

export default ReportScreen;
