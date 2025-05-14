import React from 'react';
import { styles } from './styles';
import { View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AntDesign
        name="left"
        size={30}
        color="#1F41BB"
        style={styles.icon}
        onPress={navigation.goBack}
      />
    </View>
  );
}