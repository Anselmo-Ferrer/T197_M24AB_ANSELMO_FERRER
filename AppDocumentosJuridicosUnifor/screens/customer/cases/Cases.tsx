import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Background from '../../ui/background/Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { buscarFirebase } from '../../../services/firebase/firebaseUtils';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Casos'>;
type CasosRouteProp = RouteProp<RootStackParamList, 'Casos'>;

export default function CreateCaso({ navigation }: Props) {

  const route = useRoute<CasosRouteProp>();
  const { user } = route.params;
  const { name, email, id } = user;

  const [casos, setCasos] = useState<any[]>([]);
  const [numCasos, setNumCasos] = useState<number>();

  useEffect(() => {
    fetchCasos();
  }, []);

  const fetchCasos = async () => {
    const data = await buscarFirebase('clientId', id);
    setCasos(data);
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