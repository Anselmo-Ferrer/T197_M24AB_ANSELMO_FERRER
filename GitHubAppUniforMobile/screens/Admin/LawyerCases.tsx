import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { dbAccounts } from '../../firebase/firebaseAccount';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import Background from '../Background';
import AntDesign from '@expo/vector-icons/AntDesign';

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
      <View style={styles.ViewBackIcon}>
        <AntDesign name="left" size={30} color="#1F41BB" style={styles.BackIcon}
          onPress={() => navigation.navigate('CasosList', {
            user: {
              name: name,
              email: email,
              id: id,
            }
          })}/>
      </View>
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
  BackIcon: {
    backgroundColor: '#CBD6FF',
    borderRadius: 30,
    padding: 4,
    textAlign: 'center'
  },
  CasosContainer: {
    width: 344,
    height: 120,
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderColor: '#96A9DC',
    borderWidth: 1,
    marginBottom: 28,
    backgroundColor: '#C8D6FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  CasosNameView: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4
  },
  casosTitle: {
    color: '#000',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 5,
  },
  casosIndex: {
    backgroundColor: '#CBD6FF',
    width: 21,
    height: 21,
    borderRadius: 10.5,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  casosStatus: {
    width: 110,
    fontSize: 12,
    borderRadius: 10,
    height: 21,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    backgroundColor: '#55C06D',
  },
  NewDocumentButton: {
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1F41BB',
    borderRadius: 10,
    marginTop: 55,
    marginBottom: 55,
    shadowColor: '#CBD6FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  NewDocumentText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },
});