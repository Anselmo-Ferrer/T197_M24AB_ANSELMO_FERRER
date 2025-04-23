import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { supabase } from '../../supabase/supabaseClient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { dbAccounts } from '../../firebase/firebaseAccount';
import Background from '../Background';
import AntDesign from '@expo/vector-icons/AntDesign';

type CaseDocumentsRouteProp = RouteProp<RootStackParamList, 'CaseDocuments'>;
type Props = NativeStackScreenProps<RootStackParamList, 'CaseDocuments'>;

export default function CaseDocuments({ navigation }: Props) {
  const route = useRoute<CaseDocumentsRouteProp>();
  const { user, caso } = route.params;
  const { name, email, id } = user;

  const [documentos, setDocumentos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [detalhes, setDetalhes] = useState<any | null>(null);

  useEffect(() => {
    buscarDetalhes();
  }, []);

  useEffect(() => {
    if (detalhes) {
      carregarDocs();
    }
  }, [detalhes]);

  const buscarDetalhes = async () => {
    try {
      const q = query(collection(dbAccounts, 'casosProgress'), where('casoId', '==', caso));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        setDetalhes({ ...docSnap.data(), firebaseId: docSnap.id });
      } else {
        Alert.alert('Erro', 'Caso não encontrado');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const carregarDocs = async () => {
    const path = `envios/${detalhes.clientId}/${detalhes.casoName}_${detalhes.casoId}`;
    console.log('📂 Path Supabase:', path);

    const { data, error } = await supabase.storage
      .from('documents')
      .list(path);

    if (error) {
      console.error('Erro ao buscar documentos:', error.message);
      setCarregando(false);
      return;
    }

    const arquivos = data.filter(doc => doc.name);
    setDocumentos(arquivos);
    setCarregando(false);
  };

  const abrirDocumento = async (fileName: string) => {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(`envios/${detalhes.clientId}/${detalhes.casoName}_${detalhes.casoId}/${fileName}`);

    if (data?.publicUrl) {
      Linking.openURL(data.publicUrl);
    }
  };

  return (
    <View style={styles.View}>
      <Background />
      <View style={styles.ViewBackIcon}>
        <AntDesign name="left" size={30} color="#1F41BB" style={styles.BackIcon}
          onPress={() => navigation.navigate('CaseInformations', {
            user: {
              name: name,
              email: email,
              id: id,
            },
            caso: caso
          })}/>
      </View>
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Documentos</Text>
        <Text style={styles.SubTitle}>
          Visualize os documentos do processo: processo de transito
        </Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#1F41BB" />
      ) : (
        <ScrollView style={styles.InputsContainer}>
          {documentos.map((doc, index) => (
            <View style={styles.inputView} key={index}>
              <Text style={styles.label}>{doc.name.replace(/_/g, ' ').slice(0, -4)}</Text>
              <TouchableOpacity 
                style={styles.buttonDocs} 
                onPress={() => abrirDocumento(doc.name)}
              >
                <Text style={styles.buttonDocsText}>Ver documentos</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
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
  InputsContainer: {
    width: '80%'
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
    marginTop: 10,
    marginBottom: 50,
  },
  inputView: {
    width: '100%',
    gap: 12,
  },
  label: { 
    color: '#262422',
    alignSelf: 'flex-start', 
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 15, 
    fontSize: 14
  },
  buttonDocs: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1F41BB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonDocsText: { 
    color: '#1F41BB', 
    fontWeight: '600',
    textAlign: 'center',
  },
});