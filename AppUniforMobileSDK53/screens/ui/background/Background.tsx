import React from 'react';
import { View, StyleSheet } from 'react-native';
import { styles } from './styles';

export default function Background({
  circleColor = '#F8F9FF',
  circleBorderColor = '#F8F9FF',
  rectangleBorderColor = '#F1F4FF',
}) {
  return (
    <View>
      <View style={[styles.circle1, { backgroundColor: circleColor }]} />
      <View style={[styles.circle2, { borderColor: circleBorderColor }]} />
      <View style={[styles.rectangle1, { borderColor: rectangleBorderColor }]} />
      <View style={[styles.rectangle2, { borderColor: rectangleBorderColor }]} />
    </View>
  );
}