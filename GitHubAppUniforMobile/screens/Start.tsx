import React from 'react';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'
import Background from './Background';

type Props = NativeStackScreenProps<RootStackParamList, 'Start'>;

export default function StartScreen({ navigation }: Props) {
  return (
    <View style={styles.View}>
      <Background />
      <View>
        <Image
          style={styles.WelcomeImage}
          source={require('../assets/images/welcomeImage.png')}
        />
      </View>
      <Text style={styles.Title}>Envie documentos jurídicos</Text>
      <Text style={styles.SubTitle}>
        Faça o envio de documentos pessoais e jurídicos de forma rápida
      </Text>
      <View style={styles.ViewButtons}>
        <Pressable
          style={styles.EntrarButton}
          onPress={() => navigation.navigate('LoginAccount')}
        >
          <Text style={styles.EntrarButtonText}>Entrar</Text>
        </Pressable>
        <Pressable
          style={styles.CriarButton}
          onPress={() => navigation.navigate('CreateAccount')}
        >
          <Text style={styles.CriarButtonText}>Registrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  View: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    paddingTop: 40,
    padding: 20,
    display: 'flex',
    alignItems: 'center'
  },
  WelcomeImage: {
    height: 422,
    paddingHorizontal: 11,
    paddingVertical: 52,
  },
  Title: {
    width: '80%',
    color: '#1F41BB',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 33,
    fontStyle: 'normal',
  },
  SubTitle: {
    width: '80%',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    fontStyle: 'normal',
    marginTop: 23,
  },
  ViewButtons: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    paddingTop: 100 
  },
  EntrarButton: {
    display: 'flex',
    width: 160,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1F41BB',
    borderRadius: 10,
    shadowColor: '#CBD6FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  EntrarButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontStyle: 'normal',
    fontFamily: 'Poppins_600SemiBold'
  },
  CriarButton: {
    display: 'flex',
    width: 160,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  CriarButtonText: {
    color: '#0A0A0A',
    textAlign: 'center',
    fontSize: 20,
    fontStyle: 'normal',
    fontFamily: 'Poppins_600SemiBold',
  }
});