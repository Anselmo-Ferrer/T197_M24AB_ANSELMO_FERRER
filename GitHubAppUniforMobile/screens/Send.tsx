import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Background from './Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Send'>;
type SendRouteProp = RouteProp<RootStackParamList, 'Send'>;

export default function SendScreen({ navigation }: Props) {

  const route = useRoute<SendRouteProp>();
  const { user } = route.params;
  const { name, email, id } = user;

  return (
    <View style={styles.View}>
      <Background
        circleColor="#2354E6"
        rectangleBorderColor="#2D5EE6"
        circleBorderColor="#6C8DEF"
      />
      <View style={styles.ViewTop}>
        <Feather name="check-circle" size={120} color="white" />
        <Text style={styles.TextSucess}>Documento enviado com sucesso</Text>
      </View>
      <View style={styles.ViewBottom}>
        <Pressable
          style={styles.ContinueButton}
          onPress={() => navigation.navigate('Casos', {
            user: {
              name: name,
              email: email,
              id: id,
            }
          })}
        >
          <Text style={styles.TextButton}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  View: {
    backgroundColor: '#1849D6',
    width: '100%',
    height: '100%',
    paddingTop: 40,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
  },
  ViewTop: {
    width: '100%',
    height: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 15,
  },
  TextSucess: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
  },
  ViewBottom: {
    width: '100%',
    height: '38%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ContinueButton: {
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 63,
    shadowColor: '#3B67E9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  TextButton: {
    color: '#1849D6', // corrigido: estava com dois #
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },
});