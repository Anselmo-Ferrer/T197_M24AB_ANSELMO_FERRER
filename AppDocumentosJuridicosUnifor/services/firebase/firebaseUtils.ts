import { getDocs, query, where, collection } from 'firebase/firestore';
import { dbAccounts } from './firebaseConfig';

export const buscarFirebase = async (field: string, value: string) => {
  try {
    const q = query(
      collection(dbAccounts, 'casosProgress'),
      where(field, '==', value)
    );

    const snapshot = await getDocs(q);
    const resultado: any[] = [];

    snapshot.forEach((doc) => {
      resultado.push({ ...doc.data(), firebaseId: doc.id });
    });

    return resultado;
  } catch (error) {
    console.error('Erro ao buscar casos assumidos:', error);
    return [];
  }
};

export const validarLogin = async (email: string, senha: string) => {
  const q = query(
    collection(dbAccounts, 'users'),
    where('email', '==', email),
    where('senha', '==', senha)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const { name, email: emailUsuario, id, role } = snapshot.docs[0].data();

  return {
    name,
    email: emailUsuario,
    id,
    role,
  };
}