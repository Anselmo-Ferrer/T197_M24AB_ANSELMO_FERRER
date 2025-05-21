import { supabase } from "./supabaseConfig";

interface SupabaseItem {
  name: string;
  metadata?: {
    eTag?: string;
    [key: string]: any;
  };
}

export const exportarSupabase = async (path: string): Promise<SupabaseItem[]> => {
  const { data, error } = await supabase.storage
    .from('documents')
    .list(path, {
      limit: 100,
      offset: 0,
    });

  if (error) {
    console.error('Erro ao listar arquivos:', error.message);
    return [];
  }

  return data ?? [];
};

export const listarPastas = async (path: string) => {
  const itens = await exportarSupabase(path);
  return itens.filter((item) => item.name && !item.metadata?.eTag);
};

export const listarArquivos = async (path: string) => {
  const itens = await exportarSupabase(path);
  return itens.filter((item) => item.name && item.metadata?.eTag);
};

export const deletarArquivo = async (path: string): Promise<boolean> => {
  const { error } = await supabase.storage
    .from('documents')
    .remove([path]);

  if (error) {
    console.error('❌ Erro ao deletar arquivo:', error.message);
    return false;
  }

  console.log(`✅ Arquivo deletado com sucesso: ${path}`);
  return true;
};