import type { Evento, EventoInput } from "@/types/evento";
import { horarioParaBanco } from "@/utils/datetime";
import { AppError, traduzirErroDoBanco } from "@/utils/errors";

import { supabase } from "./supabase";

const COLUNAS = "id, titulo, descricao, tipo, local, data, horario, imagem, created_at";

const REGEX_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Prepara os dados do formulário para o banco (limpa espaços e ajusta o horário). */
function prepararParaBanco(dados: EventoInput) {
  return {
    titulo: dados.titulo.trim(),
    descricao: dados.descricao.trim(),
    tipo: dados.tipo.trim(),
    local: dados.local.trim(),
    data: dados.data.trim(),
    horario: horarioParaBanco(dados.horario),
  };
}

/** Lista todos os eventos, ordenados por data e horário. */
export async function listarEventos(): Promise<Evento[]> {
  const { data, error } = await supabase
    .from("eventos")
    .select(COLUNAS)
    .order("data", { ascending: true })
    .order("horario", { ascending: true });

  if (error) {
    throw traduzirErroDoBanco(error, "Não foi possível carregar os eventos.");
  }
  return (data ?? []) as Evento[];
}

/** Busca um evento pelo id. Retorna null se não existir (ou se o id for inválido). */
export async function buscarEventoPorId(id: string): Promise<Evento | null> {
  // Um id que não é UUID (ex.: "123") não pode existir no banco.
  if (!REGEX_UUID.test(id)) {
    return null;
  }

  const { data, error } = await supabase
    .from("eventos")
    .select(COLUNAS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw traduzirErroDoBanco(error, "Não foi possível carregar o evento.");
  }
  return data as Evento | null;
}

/** Cria um evento (somente administrador). */
export async function criarEvento(dados: EventoInput): Promise<Evento> {
  const { data, error } = await supabase
    .from("eventos")
    .insert(prepararParaBanco(dados))
    .select(COLUNAS)
    .single();

  if (error || !data) {
    throw traduzirErroDoBanco(error, "Não foi possível salvar o evento.");
  }
  return data as Evento;
}

/** Atualiza um evento (somente administrador). */
export async function atualizarEvento(
  id: string,
  dados: EventoInput,
): Promise<Evento> {
  const { data, error } = await supabase
    .from("eventos")
    .update(prepararParaBanco(dados))
    .eq("id", id)
    .select(COLUNAS)
    .maybeSingle();

  if (error) {
    throw traduzirErroDoBanco(error, "Não foi possível salvar o evento.");
  }
  // Sem erro e sem linha: o RLS bloqueou (não é admin) ou o evento não existe mais
  if (!data) {
    throw new AppError("Não foi possível salvar o evento.");
  }
  return data as Evento;
}

/** Exclui um evento (somente administrador). */
export async function excluirEvento(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("eventos")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    throw traduzirErroDoBanco(error, "Não foi possível excluir o evento.");
  }
  // Se nenhuma linha foi apagada, o RLS bloqueou ou o evento já não existe
  if (!data || data.length === 0) {
    throw new AppError("Não foi possível excluir o evento.");
  }
}