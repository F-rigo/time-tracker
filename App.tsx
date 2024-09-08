import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ReportScreen from './screens/ReportScreen';
import { TimeRecord } from './screens/HomeScreen';

export type RootStackParamList = {
  Home: undefined;
  Report: { timeRecords: TimeRecord[] };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Controllo Orario' }} />
        <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'Rapporto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
