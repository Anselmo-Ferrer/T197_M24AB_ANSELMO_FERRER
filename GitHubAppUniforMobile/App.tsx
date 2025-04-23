import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import StartScreen from './screens/Start';
import LoginAccount from './screens/LoginAccount';
import CreateAccount from './screens/CreateAccount';
import CasosScreen from './screens/Casos';
import DocumentsScreen from './screens/Documents';
import NewDocumentScreen from './screens/NewDocument';
import SendScreen from './screens/Send';
import CreateCasoScreen from './screens/CreateCaso'
import CasoRecusedScreen from './screens/CasoRecused';
import CasosList from './screens/Admin/CasosList';
import LawyerCases from './screens/Admin/LawyerCases';
import CaseInformations from './screens/Admin/CaseInformations';
import CaseDocuments from './screens/Admin/CaseDocuments';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="LoginAccount" component={LoginAccount} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Casos" component={CasosScreen} />
        <Stack.Screen name="RecusedCaso" component={CasoRecusedScreen} />
        <Stack.Screen name="CreateCaso" component={CreateCasoScreen} />
        <Stack.Screen name="Documents" component={DocumentsScreen} />
        <Stack.Screen name="NewDocument" component={NewDocumentScreen} />
        <Stack.Screen name="Send" component={SendScreen} />

        <Stack.Screen name="CasosList" component={CasosList} />
        <Stack.Screen name="LawyerCases" component={LawyerCases} />
        <Stack.Screen name="CaseInformations" component={CaseInformations} />
        <Stack.Screen name="CaseDocuments" component={CaseDocuments} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}