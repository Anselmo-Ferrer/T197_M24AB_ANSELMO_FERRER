import { createClient } from '@supabase/supabase-js';
import {
  SUPABASE_URL_DOCUMENTS,
  SUPABASE_KEY_DOCUMENTS
} from '@env';

export const supabase = createClient(SUPABASE_URL_DOCUMENTS, SUPABASE_KEY_DOCUMENTS);