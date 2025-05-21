import React, { useState } from 'react';
import { styles } from './styles';
import { View, Text, Pressable, TextInput } from 'react-native';
import Background from '../../ui/background/Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import Toast from 'react-native-toast-message';
import BackButton from '../../ui/backButton/BackButton';
import { validarLogin } from '../../../services/firebase/firebaseUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'LoginAccount'>;

export default function LoginAccount({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

  const HandleLogin = async () => {
     try {
      const usario = await validarLogin(email, senha);

      if (!usario) {
        console.warn('Email ou senha inválidos!');
        return showToast();
      }

      console.log('Login bem-sucedido!');
      console.log('Usuário:', usario);
      setEmail('')
      setSenha('')

      if (usario.role === 'Advogado') {
        navigation.navigate('CasosList', {
          user: {
            name: usario.name,
            email: usario.email,
            id: usario.id,
          }
        });
      } else {
        navigation.navigate('Casos', {
          user: {
            name: usario.name,
            email: usario.email,
            id: usario.id,
          }
        });
      }
        
      } catch (error) {
      console.error('Erro ao fazer login:', error);
      showToast()
    }
  };

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Email ou senha invalido',
      text2: 'Tente novamente'
    });
  }

  return (
    <View style={styles.View}>
      <Background />
      <BackButton />
      <View style={styles.ToastView}>
        <Toast/>
      </View>
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Entre em sua conta</Text>
        <Text style={styles.SubTitle}>
        Bem vindo de volta, estávamos sentindo sua falta
        </Text>
      </View>
      <View style={styles.ViewInputs}>
        <TextInput
          style={styles.Input}
          placeholder="Email"
          placeholderTextColor="#9E9E9E"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.Input}
          placeholder="Senha"
          placeholderTextColor="#9E9E9E"
          secureTextEntry
          onChangeText={setSenha}
          value={senha}
        />
      </View>
      <Pressable
        style={styles.ForgotPassword}
        onPress={() => navigation.navigate('Start')}
      >
        <Text style={styles.ForgotPasswordText}>Esqueceu sua senha?</Text>
      </Pressable>
      <Pressable style={styles.LoginAccountButton} onPress={HandleLogin}>
        <Text style={styles.LoginAccountText}>Entrar</Text>
      </Pressable>
      <Pressable
        style={styles.CreateAccountButton}
        onPress={() => navigation.navigate('CreateAccount')}
      >
        <Text style={styles.CreateAccountText}>Criar uma nova conta</Text>
      </Pressable>
    </View>
  );
}