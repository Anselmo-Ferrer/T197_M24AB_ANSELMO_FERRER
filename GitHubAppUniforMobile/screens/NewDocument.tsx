import React, { useState } from 'react';
import {
  Image, StyleSheet, View, Text, TouchableOpacity, Pressable,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import mime from 'mime';
import Background from './Background';
import { supabase } from '../supabase/supabaseClient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import * as Progress from 'react-native-progress';
import { RouteProp, useRoute } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = NativeStackScreenProps<RootStackParamList, 'NewDocument'>;
type NewDocumentRouteProp = RouteProp<RootStackParamList, 'NewDocument'>;

interface Documento {
  name: string;
  desc: string;
  type: string;
  status: string;
  date: string;
  size: number;
}

export default function NewDocumentScreen({ navigation }: Props) {
  const [fileId, setFileId] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileEndereco, setFileEndereco] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileRenda, setFileRenda] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileProvas, setFileProvas] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState<Boolean>()
  
  const route = useRoute<NewDocumentRouteProp>();
  const { user, caso } = route.params;
  const { name, email, id } = user;

  const uploadParaSupabase = async (file: DocumentPicker.DocumentPickerAsset, nomeCustomizado: string): Promise<string | null> => {
    setLoading(true)
    console.log(loading)
    try {
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const arrayBuffer = decode(base64);
      const contentType = file.mimeType || mime.getType(file.name) || 'application/pdf';

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(nomeCustomizado, arrayBuffer, {
          contentType,
          upsert: true,
        });

      deletarArquivo(`envios/${id}/${caso}/.keep.txt`)

      setLoading(false)

      if (error) {
        console.error('Erro ao fazer upload no Supabase:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(nomeCustomizado);

      return urlData?.publicUrl || null;
    } catch (error) {
      console.error('Erro geral no upload:', error);
      return null;
    }
  };

  const deletarArquivo = async (path: string) => {
    const { data, error } = await supabase.storage
      .from('documents')
      .remove([path]);
  
    if (error) {
      console.error('Erro ao deletar:', error.message);
      return false;
    }
  
    return true;
  };

  const sanitizeFileName = (nome: string) => {
    return nome
      .normalize('NFD') // separa acentos de letras
      .replace(/[\u0300-\u036f]/g, '') // remove os acentos
      .replace(/ç/g, 'c') // troca cedilha
      .replace(/[^a-zA-Z0-9_]/g, '_'); // substitui tudo que não for letra/número por "_"
  };

  const salvarTodosDocumentos = async () => {
    try {
      const documentos = [
        { file: fileId, tipo: 'Documento Pessoal' },
        { file: fileEndereco, tipo: 'Comprovante de Endereço' },
        { file: fileRenda, tipo: 'Comprovante de Renda' },
        { file: fileProvas, tipo: 'Provas Relacionadas ao Caso' },
      ];
  
      for (const docItem of documentos) {
        if (docItem.file) {
          const ext = docItem.file.name?.split('.').pop() || 'pdf';
          const nomeFormatado = sanitizeFileName(docItem.tipo.replace(/ /g, '_'));
          const nomeArquivoFinal = `${nomeFormatado}.${ext}`;
          console.log(`caso: ${caso}`)
          const pathNoStorage = `envios/${id}/${caso}/${nomeArquivoFinal}`;
          const url = await uploadParaSupabase(docItem.file, pathNoStorage);

  
          if (!url) {
            console.warn(`⚠️ Falha ao enviar ${docItem.tipo}`);
            continue;
          }
  
          const doc: Documento = {
            name: docItem.file.name ?? 'documento.pdf',
            desc: docItem.tipo,
            type: docItem.file.mimeType || 'application/pdf',
            status: 'Enviado',
            date: new Date().toLocaleDateString(),
            size: docItem.file.size || 0,
          };
  
          // Apenas logando no console, sem salvar no Firebase
          console.log(`✅ Documento ${docItem.tipo} enviado com sucesso para: ${url}`);
          console.log('Metadados:', doc);
        }
      }

      navigation.navigate('Send', {
        user: {
          name: name,
          email: email,
          id: id,
        }
      })
    } catch (error) {
      console.error('Erro ao salvar todos os documentos:', error);
    }
  };

  const pickDocumento = async (
    setter: React.Dispatch<React.SetStateAction<DocumentPicker.DocumentPickerAsset | null>>
  ) => {
    const result = await DocumentPicker.getDocumentAsync();
    if (!result.canceled && result.assets.length > 0) {
      setter(result.assets[0]);
    }
  };

  const convertFileSize = (size: number) => {
    const sizeInMB = size / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
  };

  const renderFileInput = (
    file: DocumentPicker.DocumentPickerAsset | null,
    label: string,
    onPick: () => void
  ) => (
    <View style={styles.inputField}>
      <Text style={styles.inputText}>{label}</Text>
      <TouchableOpacity
        style={[styles.botaoEnviarArquivo, file ? styles.botaoPreenchido : styles.botaoVazio]}
        onPress={onPick}
      >
        <Image
          style={styles.folderimage}
          source={
            file
              ? require('../assets/images/pdf.png')
              : require('../assets/images/open-folder.png')
          }
        />
        <View style={{ flex: 1 }}>
          {!file ? (
            <>
              <Text style={styles.buttonText}>Adicionar documento</Text>
              <Text style={styles.buttonSubText}>PDF</Text>
            </>
          ) : (
            <>
              <Text style={styles.buttonText}>{file.name}</Text>
              <View style={styles.subLineBotaoSalvar}>
                <Text style={styles.buttonSubText}>
                  {file.mimeType?.split('/')[1].toUpperCase() || 'desconhecido'}
                </Text>
                <Text style={styles.buttonSubText}>{convertFileSize(file.size ?? 0)}</Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.View}>
      <Background />
      <View style={styles.ViewBackIcon}>
        <AntDesign name="left" size={30} color="#1F41BB" style={styles.BackIcon}
          onPress={() => navigation.navigate('Documents', {
            user: {
              name: name,
              email: email,
              id: id,
            },
            caso: caso
          })}/>
      </View>
      <Text style={styles.Title}>Enviar documentos</Text>

      {renderFileInput(fileId, 'Documento Pessoais', () => pickDocumento(setFileId))}
      {renderFileInput(fileEndereco, 'Comprovante de Endereço', () => pickDocumento(setFileEndereco))}
      {renderFileInput(fileRenda, 'Comprovante de Renda', () => pickDocumento(setFileRenda))}
      {renderFileInput(fileProvas, 'Provas Relacionadas ao Caso', () => pickDocumento(setFileProvas))}

      <View style={styles.viewBottom}>
        <Pressable style={styles.botaoSalvar} onPress={salvarTodosDocumentos}>
          <Text style={styles.textSalvar}>Salvar</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.ViewModal}>
          <Progress.Circle size={100} borderWidth={10} indeterminate={true} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 20,
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
