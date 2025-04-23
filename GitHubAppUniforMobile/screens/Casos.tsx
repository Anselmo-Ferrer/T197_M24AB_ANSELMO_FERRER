import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Background from './Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { listarPastas } from '../supabase/storageUtils';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { dbAccounts } from '../firebase/firebaseAccount';

type Props = NativeStackScreenProps<RootStackParamList, 'Casos'>;
type CasosRouteProp = RouteProp<RootStackParamList, 'Casos'>;

export default function CreateCaso({ navigation }: Props) {

  const route = useRoute<CasosRouteProp>();
  const { user } = route.params;
  const { name, email, id } = user;

  const [casos, setCasos] = useState<any[]>([]);
  const [numCasos, setNumCasos] = useState<number>();

  useEffect(() => {
    buscarMeusCasos();
  }, []);

  // const carregarCasos = async () => {
  //   const resultado = await listarPastas(`envios/${id}/`);
  //   setNumCasos(resultado.length)
  //   setCasos(resultado);
  // };


  const buscarMeusCasos = async () => {
    try {
      const q = query(
        collection(dbAccounts, 'casosProgress'),
        where('clientId', '==', id)
      );

      const snapshot = await getDocs(q);
      const casos: any[] = [];

      snapshot.forEach((doc) => {
        casos.push({ ...doc.data(), firebaseId: doc.id });
      });

      setNumCasos(casos.length)
      setCasos(casos);
    } catch (error) {
      console.error('Erro ao buscar casos assumidos:', error);
    }
  };


  const abrirTela = (casoPath: string, casoStatus: string) => {
    if (casoStatus === 'Aprovado') {
      navigation.navigate('Documents', {
        user: {
          name: name,
          email: email,
          id: id,
        },
        caso: casoPath,
      })
    } else if(casoStatus === 'Recusado') {
      navigation.navigate('RecusedCaso', {
        user: {
          name: name,
          email: email,
          id: id,
        },
        caso: casoPath,
      })
    } else {
      navigation.navigate('Casos', {
        user: {
          name: name,
          email: email,
          id: id,
        }
      })
    }
  }





  return (
    <View style={styles.View}>
      <Background />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Processos Ativos</Text>
        <Text style={styles.SubTitle}>{`${numCasos} processos em andamento`}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {casos.map((caso, index) => (
          <TouchableOpacity 
            style={styles.CasosContainer} 
            key={index} 
            onPress={() => abrirTela(caso.casoPath, caso.casoStatus)}
          >
            <View>
              <View style={styles.CasosNameView}>
                <Text style={styles.casosIndex}>{index+1}</Text>
                <Text style={styles.casosTitle}>{caso.casoName.slice(2)}</Text>
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

      <Pressable
        style={styles.NewDocumentButton}
        onPress={() => navigation.navigate('CreateCaso', {
          user: {
            name: name,
            email: email,
            id: id,
          }
        })}
        // onPress={() => navigation.navigate('RecusedCaso', {
        //   user: {
        //     email: email,
        //     id: id,
        //   }
        // })}
      >
        <Text style={styles.NewDocumentText}>Criar</Text>
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