import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import Background from './Background';
import { dbAccounts } from '../firebase/firebaseAccount';
import { collection, addDoc } from 'firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import uuid from 'react-native-uuid';
import AntDesign from '@expo/vector-icons/AntDesign';
import DropDownPicker from 'react-native-dropdown-picker';

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
      <View style={styles.ViewBackIcon}>
        <AntDesign name="left" size={30} color="#1F41BB" style={styles.BackIcon}
          onPress={() => navigation.navigate('Start')}/>
      </View>
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
    marginTop: 10,
  },
  ViewInputs: {
    width: '100%',
    height: 430,
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
    //borderWidth: 2,
    //borderColor: '#1F41BB',
    backgroundColor: '#F1F4FF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    marginBottom: 26
  },
  CreateAccountButton: {
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1F41BB',
    borderRadius: 10,
    marginTop: 53,

    shadowColor: '#CBD6FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  CreateAccountText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },
  HaveAccountButton: {
    display: 'flex',
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20
  },
  HaveAccountText: {
    color: '#494949',
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Poppins_600SemiBold',
  },



  pickerStyle: {
  width: '100%',
  backgroundColor: '#F1F4FF',
  borderColor: '#fff',
  borderRadius: 10,
  paddingVertical: 20,
  paddingLeft: 20,
  paddingRight: 35,
  marginBottom: 26,
},
pickerContainer: {
  width: 357,
},
pickerDropdown: {
  width: 357,
  backgroundColor: '#fff',
  borderColor: '#ccc',
}
})