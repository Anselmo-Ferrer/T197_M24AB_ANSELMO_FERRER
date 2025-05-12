import { View, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Background from '../../ui/background/Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { buscarFirebase } from '../../../services/firebase/firebaseUtils';
import { styles } from './styles';
import BackButton from '../../ui/backButton/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'RecusedCaso'>;
type CasoRecusedRouteProp = RouteProp<RootStackParamList, 'RecusedCaso'>;

export default function CasoRecusedScreen({ navigation }: Props) {

  const route = useRoute<CasoRecusedRouteProp>();
  const { user, caso } = route.params;
  const { name, email, id } = user;

  const [casos, setCasos] = useState<any[]>([]);

  useEffect(() => {
    console.log(caso)
    fetchCasos()
  }, [])

  const fetchCasos = async () => {
    const data = await buscarFirebase('casoPath', caso);
    setCasos(data);
  };

  return (
    <View style={styles.View}>
      <Background />
      <BackButton />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Caso recusado</Text>
        <Text style={styles.SubTitle}>fale com seu advodago</Text>
      </View>


      <View style={styles.ViewContainer}>
        <Text style={styles.MotivoTitle}>Motivo</Text>
        <Text style={styles.MotivoText}>{casos.map(item => item.casoRecused)}</Text>
      </View>
    </View>
  )
}