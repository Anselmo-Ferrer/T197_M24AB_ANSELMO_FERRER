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
  Title: {
    color: '#1F41BB',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: 30,
    marginTop: 60,
    marginBottom: 53
  },
  viewBottom: {
    width: '100%',
    alignItems: 'center',
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
  title: {
    color: '#0B0B0B',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    paddingBottom: 50,
  },
  inputField: {
    width: '90%',
    gap: 10,
    marginBottom: 30,
  },
  inputText: {
    fontSize: 16,
    color: '#0B0B0B',
    fontFamily: 'Poppins_600SemiBold',
  },
  buttonText: {
    fontSize: 12,
    color: '#0B0B0B',
    fontFamily: 'Poppins_600SemiBold',
  },
  buttonSubText: {
    fontSize: 12,
    color: '#6D6D6D',
    fontFamily: 'Poppins_400Regular'
  },
  botaoEnviarArquivo: {
    width: '100%',
    height: 84,
    borderWidth: 1,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
    marginBottom: -5
  },
  botaoVazio: {
    borderColor: '#d3d3d3',
    backgroundColor: '#fff',
  },
  botaoPreenchido: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  folderimage: {
    height: 42,
    width: 42,
  },
  botaoSalvar: {
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1F41BB',
    borderRadius: 10,
    marginTop: 20,

    shadowColor: '#CBD6FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  textSalvar: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },
  subLineBotaoSalvar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    width: '100%',
  },
  ViewModal: {
    backgroundColor: "#fff",
    position: 'absolute',
    width: '100%',
    height: '100%',
    marginTop: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: .8
  }
});