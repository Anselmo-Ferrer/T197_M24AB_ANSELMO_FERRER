import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Background from './Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'RecusedCaso'>;
type CasoRecusedRouteProp = RouteProp<RootStackParamList, 'RecusedCaso'>;

export default function CasoRecusedScreen({ navigation }: Props) {

  const route = useRoute<CasoRecusedRouteProp>();
  const { user } = route.params;
  const { name, email, id } = user;

  return (
    <View style={styles.View}>
      <Background />
      <View style={styles.ViewBackIcon}>
        <AntDesign name="left" size={30} color="#1F41BB" style={styles.BackIcon}
          onPress={() => navigation.navigate('Casos', {
            user: {
              name: name,
              email: email,
              id: id,
            }
          })}/>
      </View>
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Caso recusado</Text>
        <Text style={styles.SubTitle}>fale com seu advodago</Text>
      </View>


      <View style={styles.ViewContainer}>
        <Text style={styles.MotivoTitle}>Motivo</Text>
        <Text style={styles.MotivoText}>Seu caso foi recusado pela falta de um renda necessária para da andamento no processo, contato seu advogado para renegociar.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  View: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    paddingTop: 40,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
  },
  ViewTop: {
    width: '80%',
  },
  Title: {
    color: '#1F41BB',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: 30,
    marginTop:  60,
  },
  SubTitle: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    fontStyle: 'normal',
    marginTop: 6,
    marginBottom: 50,
  },
  ViewBackIcon: {
    padding: 16,
    marginTop: 30,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
  ViewContainer: {
    width: '80%',
    gap: 16,
    display: 'flex',
    alignItems: 'center',
  },
  BackIcon: {
    backgroundColor: '#CBD6FF',
    borderRadius: 30,
    padding: 4,
    textAlign: 'center'
  },
  MotivoTitle: {
    width: '100%',
    backgroundColor: '#CBD6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center'
  },
  MotivoText: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    fontStyle: 'normal',
  }
});