import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  View: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    paddingTop: 40,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
  },
  ViewTop: {
    width: '80%',
  },
  Title: {
    color: '#1F41BB',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: 30,
    marginTop:  60,
  },
  SubTitle: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    fontStyle: 'normal',
    marginTop: 6,
    marginBottom: 50,
  },
  ViewBackIcon: {
    padding: 16,
    marginTop: 30,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
  ViewContainer: {
    width: '80%',
    gap: 16,
    display: 'flex',
    alignItems: 'center',
  },
  BackIcon: {
    backgroundColor: '#CBD6FF',
    borderRadius: 30,
    padding: 4,
    textAlign: 'center'
  },
  MotivoTitle: {
    width: '100%',
    backgroundColor: '#CBD6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center'
  },
  MotivoText: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    fontStyle: 'normal',
  }
});