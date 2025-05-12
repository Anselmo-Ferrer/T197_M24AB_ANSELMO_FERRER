import React, { useState } from 'react';
import { styles } from './styles';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import Background from '../../ui/background/Background';
import { dbAccounts } from '../../../services/firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import uuid from 'react-native-uuid';
import AntDesign from '@expo/vector-icons/AntDesign';
import DropDownPicker from 'react-native-dropdown-picker';
import BackButton from '../../ui/backButton/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

export default function CreateAccount({ navigation }: Props) {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [cpf, setCpf] = useState<string>();
  const [senha, setSenha] = useState<string>();
  const [role, setRole] = useState<string>();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Cliente', value: 'Cliente' },
    { label: 'Advogado', value: 'Advogado' },
  ]);

  const criarConta = async () => {
    try {
      if (!name || !email || !cpf || !senha) {
        console.warn('Preencha todos os campos');
        return;
      }
  
      const customId = uuid.v4() as string;
  
      const docRef = await addDoc(collection(dbAccounts, 'users'), {
        id: customId,
        name,
        email,
        cpf,
        senha,
        role,
        createdAt: new Date()
      });
  
      console.log('Conta criada com ID customizado: ', customId);
      console.log('Firestore ID gerado: ', docRef.id);
  
      navigation.navigate('LoginAccount');
    } catch (e) {
      console.error('Erro ao criar conta: ', e);
    }
  };

  return (
    <View style={styles.View}>
      <Background />
      <BackButton />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Criar conta</Text>
        <Text style={styles.SubTitle}>
          Ao criar uma conta você poderá fazer o envio dos documentos
        </Text>
      </View>
      <View style={styles.ViewInputs}>
        <ScrollView>
        <DropDownPicker
          onChangeValue={(val) => val !== null && setRole(val)}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Selecione seu cargo"
          style={styles.pickerStyle}
          containerStyle={styles.pickerContainer}
          dropDownContainerStyle={styles.pickerDropdown}
          textStyle={{ fontFamily: 'Poppins_500Medium', fontSize: 16,  }}
          placeholderStyle={{ color: '#9E9E9E', fontFamily: 'Poppins_500Medium' }}
        />
        <TextInput
          style={styles.Input}
          placeholder="Nome"
          placeholderTextColor="#9E9E9E"
          onChangeText={setName}
        />
        <TextInput
          style={styles.Input}
          placeholder="Email"
          placeholderTextColor="#9E9E9E"
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.Input}
          placeholder="CPF"
          placeholderTextColor="#9E9E9E"
          onChangeText={setCpf}
          maxLength={11}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.Input}
          placeholder="Senha"
          placeholderTextColor="#9E9E9E"
          onChangeText={setSenha}
          secureTextEntry
        />
        <TextInput
          style={styles.Input}
          placeholder="Confirme sua senha"
          placeholderTextColor="#9E9E9E"
          secureTextEntry
        />
        </ScrollView>
      </View>
      <Pressable style={styles.CreateAccountButton} onPress={criarConta}>
        <Text style={styles.CreateAccountText}>Criar</Text>
      </Pressable>
      <Pressable
        style={styles.HaveAccountButton}
        onPress={() => navigation.navigate('LoginAccount')}
      >
        <Text style={styles.HaveAccountText}>Já tenho uma conta</Text>
      </Pressable>
    </View>
  );
}