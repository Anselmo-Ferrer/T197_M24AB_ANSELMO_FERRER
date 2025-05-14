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

import StartScreen from './screens/auth/start/Start';
import LoginAccount from './screens/auth/loginAccount/LoginAccount';
import CreateAccount from './screens/auth/createAccount/CreateAccount';
import CasosScreen from './screens/customer/cases/Cases';
import DocumentsScreen from './screens/customer/document/Documents';
import NewDocumentScreen from './screens/customer/newDocument/NewDocument';
import SendScreen from './screens/customer/send/Send';
import CreateCasoScreen from './screens/customer/createCase/CreateCase'
import CasoRecusedScreen from './screens/customer/caseRecused/CaseRecused';
import CasosList from './screens/lawyer/CasesList/CasesList';
import LawyerCases from './screens/lawyer/CasesLawyer/CasesLawyer';
import CaseInformations from './screens/lawyer/caseInformations/CaseInformations';
import CaseDocuments from './screens/lawyer/caseDocuments/CaseDocuments';

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