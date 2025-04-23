import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { dbAccounts } from '../../firebase/firebaseAccount';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import Background from '../Background';

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
      marginTop: 100,
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
    CasosContainer: {
      width: 344,
      height: 120,
      padding: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 12,
      borderColor: '#E7E7E7',
      borderWidth: 1,
      marginBottom: 28,
      backgroundColor: '#FFF',
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
      width: 150,
      fontSize: 12,
      borderRadius: 10,
      height: 21,
      textAlign: 'center',
      fontFamily: 'Poppins_600SemiBold',
      color: '#000',
      borderColor: '#000',
      borderWidth: 1
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