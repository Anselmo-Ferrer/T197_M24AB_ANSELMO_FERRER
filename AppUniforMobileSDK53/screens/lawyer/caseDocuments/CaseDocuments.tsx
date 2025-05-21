import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';
import { supabase } from '../../../services/supabase/supabaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { dbAccounts } from '../../../services/firebase/firebaseConfig';
import Background from '../../ui/background/Background';
import AntDesign from '@expo/vector-icons/AntDesign';
import BackButton from '../../ui/backButton/BackButton';

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

    const arquivos = (data ?? []).filter(doc => doc.name);
    setDocumentos(arquivos);
    setCarregando(false);
  };

  const abrirDocumento = async (fileName: string) => {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(`envios/${detalhes.clientId}/${detalhes.casoName}_${detalhes.casoId}/${fileName}`);

    if (data?.publicURL) {
      Linking.openURL(data.publicURL);
    }
  };

  return (
    <View style={styles.View}>
      <Background />
      <BackButton />
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