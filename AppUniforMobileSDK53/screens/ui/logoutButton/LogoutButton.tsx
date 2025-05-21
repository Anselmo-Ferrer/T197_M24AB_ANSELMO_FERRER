import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Start'>;

export default function LogoutButton() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.containerContent} onPress={() => navigation.navigate('Start')}>
        <AntDesign
          name="logout"
          size={25}
          color="#1F41BB"
          style={styles.icon}
        />
        <Text>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}