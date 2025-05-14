import React, { useState } from 'react';
import { styles } from './styles';
import {
  Image, View, Text, TouchableOpacity, Pressable,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import mime from 'mime';
import Background from '../../ui/background/Background';
import { supabase } from '../../../services/supabase/supabaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import * as Progress from 'react-native-progress';
import { RouteProp, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

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
      .normalize('NFD') 
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/ç/g, 'c')
      .replace(/[^a-zA-Z0-9_]/g, '_');
  };

  const salvarTodosDocumentos = async () => {
    if (!fileId || !fileEndereco || !fileRenda || !fileProvas) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Por favor, envie todos os documentos antes de continuar',
      });
      return;
  }

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
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];
  
      const MAX_SIZE = 3 * 1024 * 1024;
  
      if (file.size && file.size > MAX_SIZE) {
        Toast.show({
          type: 'error',
          text1: 'O arquivo excede o tamanho de 5MB',
          text2: 'Tente novamente'
        });
        return;
      }
  
      setter(file);
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
              ? require('../../../assets/images/pdf.png')
              : require('../../../assets/images/open-folder.png')
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
      <View style={styles.ToastView}>
        <Toast/>
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

