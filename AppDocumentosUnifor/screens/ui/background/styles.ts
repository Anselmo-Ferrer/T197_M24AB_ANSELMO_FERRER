import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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