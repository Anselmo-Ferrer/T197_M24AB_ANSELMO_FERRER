import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Background from '../../ui/background/Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { deletarArquivo, listarArquivos } from '../../../services/supabase/supabaseUtils'
import BackButton from '../../ui/backButton/BackButton';

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
      <BackButton />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Documentos</Text>
        <Text style={styles.SubTitle}>{caso.split('-').slice(2).join('-').split('_')[0]}</Text>
        <View style={styles.containerCasosStatus}>
          <Text style={styles.casosStatus}>Aprovado</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
      {documentos.map((item, index) => (
        <View style={styles.CasosContainer} key={index}>
          <View style={styles.CasosContainerLeft}>
            <Image
              style={styles.pdfImg}
              source={require('../../../assets/images/pdf.png')}
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
          caso: caso,
        })}
      >
        <Text style={styles.NewDocumentText}>Enviar</Text>
      </Pressable>
    </View>
  );
}
