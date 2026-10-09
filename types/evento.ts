/**
 * Evento como vem do banco.
 *
 * IMPORTANTE sobre datas:
 * - `data` é uma data de calendário em texto: "AAAA-MM-DD" (ex.: "2026-11-12").
 * - `horario` é um horário em texto: "HH:MM:SS" (ex.: "19:00:00").
 * Nunca convertemos esses valores para `Date`, para não haver deslocamento de fuso.
 */
export type Evento = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  local: string;
  data: string;
  horario: string;
  imagem: string | null;
  created_at: string;
};

/** Dados enviados pelo formulário ao criar ou editar um evento. */
export type EventoInput = {
  titulo: string;
  descricao: string;
  tipo: string;
  local: string;
  /** "AAAA-MM-DD" */
  data: string;
  /** "HH:MM" ou "HH:MM:SS" (o serviço converte para "HH:MM:SS") */
  horario: string;
};