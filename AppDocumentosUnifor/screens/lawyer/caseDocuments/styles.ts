import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  InputsContainer: {
    width: '80%'
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
    marginBottom: 50,
  },
  inputView: {
    width: '100%',
    gap: 12,
  },
  label: { 
    color: '#262422',
    alignSelf: 'flex-start', 
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 15, 
    fontSize: 14
  },
  buttonDocs: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1F41BB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonDocsText: { 
    color: '#1F41BB', 
    fontWeight: '600',
    textAlign: 'center',
  },
});