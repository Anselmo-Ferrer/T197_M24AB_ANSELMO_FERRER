import { doc, getDocs, query, where, collection } from 'firebase/firestore';
import { dbAccounts } from '../firebase/firebaseAccount';
import { Alert } from 'react-native';


export const fetchCasosProgress = async (id: number | string) => {
  try {
    const q = query(
      collection(dbAccounts, 'casosProgress'),
      where('casoId', '==', id)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return { ...docSnap.data(), firebaseId: docSnap.id };
    } else {
      Alert.alert('Erro', 'Caso não encontrado');
    }
  } catch (e) {
    console.error(e);
  }
};