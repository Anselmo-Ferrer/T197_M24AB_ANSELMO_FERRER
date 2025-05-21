import React from 'react';
import { styles } from './styles';
import { Image, View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import Background from '../../ui/background/Background';

type Props = NativeStackScreenProps<RootStackParamList, 'Start'>;

export default function StartScreen({ navigation }: Props) {
  return (
    <View style={styles.View}>
      <Background />
      <View>
        <Image
          style={styles.WelcomeImage}
          source={require('../../../assets/images/welcomeImage.png')}
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