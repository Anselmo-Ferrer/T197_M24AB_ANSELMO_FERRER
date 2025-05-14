import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
  containerContent: {
    backgroundColor: '#CBD6FF',
    padding: 8,
    width: 90,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    gap: 10
  },
  icon: {
    textAlign: 'center',
    transform: [{ scaleX: -1 }],
  },
});