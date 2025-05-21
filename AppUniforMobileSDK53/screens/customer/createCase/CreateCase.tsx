import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import Background from '../../ui/background/Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { supabase } from '../../../services/supabase/supabaseConfig';
import { listarPastas } from '../../../services/supabase/supabaseUtils';
import { dbAccounts } from '../../../services/firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import uuid from 'react-native-uuid';
import { styles } from './styles';
import BackButton from '../../ui/backButton/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateCaso'>;
type CreateCasoRouteProp = RouteProp<RootStackParamList, 'CreateCaso'>;

export default function CreateCasoScreen({ navigation }: Props) {

  const [numCasos, setNumCasos] = useState<number>();
  const [casoName, setCasoName] = useState<string>('');

  const route = useRoute<CreateCasoRouteProp>();
  const { user } = route.params;
  const { name, email, id } = user

  useEffect(() => {
    carregarCasos();
  }, []);

  const carregarCasos = async () => {
    const resultado = await listarPastas(`envios/${id}/`);
    setNumCasos(resultado.length)
  };

  const criarCaso = async () => {
    const customId = uuid.v4() as string;

    const docRef = await addDoc(collection(dbAccounts, 'casosProgress'), {
      casoId: customId,
      client: name,
      clientId: id,
      advogadoName: '',
      advogadoId: '',
      casoName: `${numCasos}-${casoName}`,
      casoPath: `${numCasos}-${casoName}_${customId}`,
      casoStatus: 'Esperando analise',
      casoRecused: '',
      createdAt: new Date()
    });

    console.log('caso criada com ID customizado: ', customId);
    console.log('Caso Firestore ID gerado: ', docRef.id);

    const caminho = `envios/${id}/${numCasos}-${casoName}_${customId}/.keep.txt`;
  
    const blob = new Blob(['pasta criada'], { type: 'text/plain' });
  
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(caminho, blob, {
        upsert: false,
      });
  
    if (error) {
      console.error('Erro ao criar pasta:', error.message);
    } else if (data && 'path' in data) {
      console.log('Pasta simulada com sucesso:', (data as { path: string }).path);
    }

    navigation.navigate('NewDocument', {
      user: {
        name: name,
        email: email,
        id: id,
      },
      caso: `${numCasos}-${casoName}_${customId}`,
    })
  };
  
  return (
    <View style={styles.View}>
      <Background />
      <BackButton />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Criar caso</Text>
        <Text style={styles.SubTitle}>
        Crie um novo caso
        </Text>
      </View>
      <View style={styles.ViewInputs}>
        <TextInput
          style={styles.Input}
          placeholder="Nome"
          placeholderTextColor="#9E9E9E"
          onChangeText={setCasoName}
          value={casoName}
        />
      </View>
      <Pressable
       style={styles.LoginAccountButton}
       onPress={criarCaso}
      >
        <Text style={styles.LoginAccountText}>Criar</Text>
      </Pressable>
    </View>
  )
}