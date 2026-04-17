import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://nbijolcytzinsncoonbn.supabase.co';
export function canUseTable(error) {
  if (!error) return true;
  const code = String(error.code || '');
  const message = String(error.message || '');
  return !(
    code === '42P01' ||
    code === 'PGRST205' ||
    code === 'PGRST204' ||
    message.includes('Could not find the table') ||
    message.includes('schema cache')
  );
}

export async function getAuthenticatedClient(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  const token = String(authHeader).replace(/^Bearer\s+/i, '').trim();
  if (!token) return { error: 'No autorizado', status: 401 };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseAnonKey) return { error: 'Falta configurar Supabase en el servidor.', status: 500 };

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return { error: 'No autorizado', status: 401 };
  return { supabase, user, token };
}

export async function safeInsert(supabase, table, payload) {
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error && !canUseTable(error)) return { data: null, error: null, unsupported: true };
  return { data, error, unsupported: false };
}
