import React from 'react';
import { styles } from './styles';
import { View, Text, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Background from '../../ui/background/Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
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