import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native';
import Background from './Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { supabase } from '../supabase/supabaseClient';
import AntDesign from '@expo/vector-icons/AntDesign';
import { listarPastas } from '../supabase/storageUtils';
import { dbAccounts } from '../firebase/firebaseAccount';
import { collection, addDoc } from 'firebase/firestore';
import uuid from 'react-native-uuid';

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
    setNumCasos(resultado.length-1)
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
    } else {
      console.log('Pasta simulada com sucesso:', data.path);
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
      {/* <View style={styles.ToastView}>
        <Toast/>
      </View> */}
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
  ToastView: {
    marginBottom: 20
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
    marginTop: 10,
  },
  ViewInputs: {
    width: '80%',
    alignItems: 'center',
    gap: 26,
    marginTop: 53
  },
  Input: {
    display: 'flex',
    width: 357,
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 35,
    borderRadius: 10,
    backgroundColor: '#F1F4FF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  LoginAccountButton: {
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1F41BB',
    borderRadius: 10,
    marginTop: 30,
    shadowColor: '#CBD6FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  LoginAccountText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  }
});