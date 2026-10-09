import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Armazenamento da sessão de login:
 * - Android: AsyncStorage.
 * - Web: undefined -> o supabase-js usa o armazenamento do próprio navegador.
 */
const storage = Platform.OS === "web" ? undefined : AsyncStorage;

/**
 * Se as variáveis do .env estiverem faltando, usamos valores falsos só para o app
 * não quebrar ao abrir. Nesse caso `supabaseConfigurado` é false e as telas podem avisar.
 */
export const supabase = createClient(
  supabaseUrl ?? "https://sem-configuracao.supabase.co",
  supabaseAnonKey ?? "sem-configuracao",
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);