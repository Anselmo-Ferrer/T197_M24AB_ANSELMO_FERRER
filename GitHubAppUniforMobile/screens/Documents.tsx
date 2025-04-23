import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Background from './Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { deletarArquivo, listarArquivos } from '../supabase/storageUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'Documents'>;
type DocumentsRouteProp = RouteProp<RootStackParamList, 'Documents'>;

export default function DocumentsScreen({ navigation }: Props) {

  const [documentos, setDocumentos] = useState<any[]>([]);

  const route = useRoute<DocumentsRouteProp>();
  const { user, caso } = route.params;
  const { name, email, id } = user;

  useEffect(() => {
    carregarDocumentos();
  }, []);

  const carregarDocumentos = async () => {
    const resultado = await listarArquivos(`envios/${id}/${caso}/`);
    setDocumentos(resultado);
  };

  const handleDelete = async (itemName: string) => {
    const path = `envios/${id}/${caso}/${itemName}`;
    const sucesso = await deletarArquivo(path);
  
    if (sucesso) {
      setDocumentos(prev =>
        prev.filter(doc => doc.name !== itemName)
      );
    }
  };


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
        <Text style={styles.Title}>Documentos</Text>
        <Text style={styles.SubTitle}>{caso.split('-').slice(2).join('-').split('_')[0]}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
      {documentos.map((item, index) => (
        <View style={styles.CasosContainer} key={index}>
          <View style={styles.CasosContainerLeft}>
            <Image
              style={styles.pdfImg}
              source={require('../assets/images/pdf.png')}
            />
            <View>
              <Text style={styles.casosTitle}>{item.name.replace(/_/g, ' ').slice(0, -4)}</Text>
              <Text>{item.metadata?.lastModified || 'sem data'}</Text>
            </View>
          </View>
          <AntDesign name="delete" size={24} color="gray" onPress={() => handleDelete(item.name)}/>
        </View>
      ))}
      </ScrollView>

      <Pressable
        style={styles.NewDocumentButton}
        onPress={() => navigation.navigate('NewDocument', {
          user: {
            name: name,
            email: email,
            id: id,
          },
          caso: caso, // <-- esse é o nome da pasta/caso
        })}
      >
        <Text style={styles.NewDocumentText}>Enviar</Text>
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
    alignItems: 'center'
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
    marginBottom: 50
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
  
    // Box shadow equivalente
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, // Necessário para Android
  },
  CasosContainerLeft: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  pdfImg: {
    width: 36,
    height: 36
  },
  casosTitle: {
    color: '#000',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 5,
  },
  casosStatus: {
    width: 110,
    backgroundColor: '#55C06D',
    fontSize: 12,
    borderRadius: 10,
    height: 21,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
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
  
})