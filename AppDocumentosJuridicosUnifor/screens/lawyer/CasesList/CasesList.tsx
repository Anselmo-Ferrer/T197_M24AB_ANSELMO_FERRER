import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import { View, Text, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { dbAccounts } from '../../../services/firebase/firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import Background from '../../ui/background/Background';

type Props = NativeStackScreenProps<RootStackParamList, 'CasosList'>;
type CasosListRouteProp = RouteProp<RootStackParamList, 'CasosList'>;

export default function CasosList({ navigation }: Props) {

  const route = useRoute<CasosListRouteProp>();
  const { user } = route.params;
  const { name, email, id } = user;

  const [casos, setCasos] = useState<any[]>([]);
  const [numCasos, setNumCasos] = useState(0);

  useEffect(() => {
    carregarCasosFirebase();
  }, []);

  const carregarCasosFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(dbAccounts, 'casosProgress'));

      const casosExtraidos: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        casosExtraidos.push({ ...data, firebaseId: doc.id });
      });

      // Filtra apenas casos ainda não assumidos
      const pendentes = casosExtraidos.filter((c) => c.advogadoId === '');
      setCasos(pendentes);
      setNumCasos(pendentes.length);
    } catch (error) {
      console.error('Erro ao carregar casos do Firebase:', error);
    }
  };

  const assumirCaso = async (firebaseId: string) => {
    try {
      const ref = doc(dbAccounts, 'casosProgress', firebaseId);

      await updateDoc(ref, {
        advogadoName: name,
        advogadoId: id,
        casoStatus: 'Em andamento',
      });

      // Remove da lista atual
      setCasos((prev) => prev.filter((c) => c.firebaseId !== firebaseId));
      setNumCasos((prev) => prev - 1);

      console.log('✅ Caso assumido com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao assumir o caso:', error);
    }
  };

  return (
    <View style={styles.View}>
      <Background />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Casos</Text>
        <Text style={styles.SubTitle}>{`${numCasos} casos em andamento`}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {casos.map((caso, index) => (
          <TouchableOpacity 
            style={styles.CasosContainer} 
            key={index} 
            onPress={() => assumirCaso(caso.firebaseId)}>
            <View>
              <View style={styles.CasosNameView}>
                <Text style={styles.casosIndex}>{index+1}</Text>
                <Text style={styles.casosTitle}>{`${caso.client} / ${caso.casoId}`}</Text>
              </View>
              <Text
                style={[styles.casosStatus,]}
              >
                {caso.casoStatus}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Pressable
        style={styles.NewDocumentButton}
        onPress={() => navigation.navigate('LawyerCases', {
          user: {
            name: name,
            email: email,
            id: id,
          }
        })}
      >
        <Text style={styles.NewDocumentText}>Meus casos</Text>
      </Pressable>

    </View>
  );
}
  