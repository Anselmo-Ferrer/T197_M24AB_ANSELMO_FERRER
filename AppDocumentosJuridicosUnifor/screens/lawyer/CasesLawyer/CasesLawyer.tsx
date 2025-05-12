import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { dbAccounts } from '../../../services/firebase/firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import Background from '../../ui/background/Background';
import AntDesign from '@expo/vector-icons/AntDesign';
import BackButton from '../../ui/backButton/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerCases'>;
type LawyerCasesRouteProp = RouteProp<RootStackParamList, 'LawyerCases'>;

export default function LawyerCases({ navigation }: Props) {

  const route = useRoute<LawyerCasesRouteProp>();
  const { user } = route.params;
  const { name, email, id } = user;

  const [meusCasos, setMeusCasos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarMeusCasos();
  }, []);

  const buscarMeusCasos = async () => {
    try {
      const q = query(
        collection(dbAccounts, 'casosProgress'),
        where('advogadoId', '==', id)
      );

      const snapshot = await getDocs(q);
      const casos: any[] = [];

      snapshot.forEach((doc) => {
        casos.push({ ...doc.data(), firebaseId: doc.id });
      });

      setMeusCasos(casos);
      setCarregando(false);
    } catch (error) {
      console.error('Erro ao buscar casos assumidos:', error);
    }
  };

  return (
    <View style={styles.View}>
      <Background />
      <BackButton />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Meus casos</Text>
        <Text style={styles.SubTitle}>verifique seus casos em aberto</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {meusCasos.map((caso, index) => (
          <TouchableOpacity 
            style={styles.CasosContainer} 
            key={index} 
            onPress={() => navigation.navigate('CaseInformations', {
              user: {
                name: name,
                email: email,
                id: id,
              },
              caso: caso.casoId
            })}>
            <View>
              <View style={styles.CasosNameView}>
                <Text style={styles.casosIndex}>{index+1}</Text>
                <Text style={styles.casosTitle}>{`${caso.client} / ${caso.casoId}`}</Text>
              </View>
              <Text
                style={[
                  styles.casosStatus,
                  caso.casoStatus === 'Aprovado'
                    ? { backgroundColor: '#55C06D' }
                    : caso.casoStatus === 'Recusado'
                    ? { backgroundColor: '#EF5350' }
                    : caso.casoStatus === 'Em andamento'
                    ? { backgroundColor: '#F8C33E' }
                    : {},
                ]}
              >
                {caso.casoStatus}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}