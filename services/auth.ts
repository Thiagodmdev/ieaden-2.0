import type { Session, User } from "@supabase/supabase-js";

import type { Profile } from "@/types/auth";
import { AppError, traduzirErroDeLogin } from "@/utils/errors";

import { supabase } from "./supabase";

/** Busca o perfil do usuário logado. Retorna null se não existir. */
async function buscarPerfil(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new AppError("Não foi possível verificar suas permissões.");
  }
  return data as Profile | null;
}

/** Retorna true se o usuário logado tem role "admin". */
export async function usuarioEhAdmin(userId: string): Promise<boolean> {
  const perfil = await buscarPerfil(userId);
  return perfil?.role === "admin";
}

/**
 * Faz login com email e senha e confirma que o usuário é administrador.
 * Se não for admin, faz logout na hora e lança um erro.
 */
export async function login(email: string, senha: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  });

  if (error || !data.user) {
    throw traduzirErroDeLogin(error);
  }

  let ehAdmin = false;
  try {
    ehAdmin = await usuarioEhAdmin(data.user.id);
  } catch (erroPerfil) {
    await supabase.auth.signOut();
    throw erroPerfil;
  }

  if (!ehAdmin) {
    await supabase.auth.signOut();
    throw new AppError("Você não possui permissão de administrador.");
  }

  return data.user;
}

/** Encerra a sessão. */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new AppError("Não foi possível sair. Tente novamente.");
  }
}

/** Retorna a sessão salva (ou null se não houver login). */
export async function obterSessao(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

/** Retorna o usuário atual (ou null). */
export async function obterUsuarioAtual(): Promise<User | null> {
  const sessao = await obterSessao();
  return sessao?.user ?? null;
}