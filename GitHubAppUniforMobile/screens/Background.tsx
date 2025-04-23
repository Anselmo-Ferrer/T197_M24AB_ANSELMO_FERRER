import React from 'react';
import { View, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  circle1: {
    position: 'absolute',
    top: -327,
    left: 148,
    width: 635,
    height: 635,
    borderRadius: 635,
  },
  circle2: {
    position: 'absolute',
    top: -142,
    left: 57,
    width: 496,
    height: 496,
    borderRadius: 496,
    borderWidth: 3,
  },
  rectangle1: {
    position: 'absolute',
    width: 372,
    height: 372,
    borderWidth: 2,
    top: 625,
    left: -153,
    transform: [{ rotate: '27.089deg' }]
  },
  rectangle2: {
    position: 'absolute',
    width: 372,
    height: 372,
    borderWidth: 2,
    top: 684,
    left: -264
  }
});