import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import { View, Text, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { doc, getDocs, query, where, updateDoc, collection } from 'firebase/firestore';
import { dbAccounts } from '../../../services/firebase/firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import Background from '../../ui/background/Background';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Modal } from 'react-native';
import BackButton from '../../ui/backButton/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'CaseInformations'>;
type CaseInformationsRouteProp = RouteProp<RootStackParamList, 'CaseInformations'>;

export default function CaseInformations({ navigation }: Props) {
  const route = useRoute<CaseInformationsRouteProp>();
  const { user, caso } = route.params;
  const { name, email, id } = user;

  const [detalhes, setDetalhes] = useState<any | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    buscarDetalhes();
  }, []);

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

  const aprovarCaso = async () => {
    if (!detalhes) return;
    try {
      const docRef = doc(dbAccounts, 'casosProgress', detalhes.firebaseId);
      await updateDoc(docRef, {
        advogadoId: id,
        advogadoName: name,
        casoStatus: 'Aprovado',
      });
      navigation.navigate('LawyerCases', {
        user: {
          name: name,
          email: email,
          id: id,
        }
      })
    } catch (e) {
      console.error(e);
    }
  };

  const recusarCaso = async () => {
    if (!detalhes) return;
    try {
      const docRef = doc(dbAccounts, 'casosProgress', detalhes.firebaseId);
      await updateDoc(docRef, {
        casoStatus: 'Recusado',
        casoRecused: motivo
      });
      navigation.navigate('LawyerCases', {
        user: {
          name: name,
          email: email,
          id: id,
        }
      })
    } catch (e) {
      console.error(e);
    }
  };

  if (!detalhes) return <Text style={{ padding: 20 }}>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Background />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Motivo da recusa:</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Descreva o motivo..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={motivo}
              onChangeText={setMotivo}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={async () => {
                  if (motivo.trim().length === 0) {
                    Alert.alert("Por favor, insira um motivo para recusar.");
                    return;
                  }
                  setModalVisible(false);
                  await recusarCaso();
                }}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BackButton />


      <Image source={require('../../../assets/images/men.png')} style={styles.avatar} />
      <Text style={styles.name}>{detalhes.client}</Text>
      <Text style={styles.subtitle}>{detalhes.casoName.slice(2)}</Text>
      
      <View style={styles.inputView}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.input}>joao@gmail.com</Text>
      </View>

      <View style={styles.inputView}>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.input}>+8599123123</Text>
      </View> 

      <View style={styles.inputView}>
        <Text style={styles.label}>CPF</Text>
        <Text style={styles.input}>000.000.000-00</Text>
      </View>

      <View style={styles.inputView}>
        <Text style={styles.label}>Documentos</Text>
        <TouchableOpacity 
          style={styles.buttonDocs} 
          onPress={() => navigation.navigate('CaseDocuments', {
            user,
            caso: caso
          })}
        >
          <Text style={styles.buttonDocsText}>Ver documentos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.buttonRecusar} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAprovar} onPress={aprovarCaso}>
          <Text style={styles.buttonText}>Aprovar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}