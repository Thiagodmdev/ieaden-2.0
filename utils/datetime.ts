/**
 * Funções de data e hora SEM usar `new Date()` para interpretar datas do banco.
 * Trabalhamos só com texto, então não há conversão de fuso horário.
 */

const REGEX_DATA = /^(\d{4})-(\d{2})-(\d{2})$/;
const REGEX_HORARIO = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const MESES_ABREVIADOS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

const DIAS_DA_SEMANA = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

/** Retorna true se o texto for uma data válida no formato AAAA-MM-DD. */
export function dataValida(data: string): boolean {
  const partes = REGEX_DATA.exec(data);
  if (!partes) return false;

  const ano = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);

  if (mes < 1 || mes > 12 || dia < 1) return false;

  // Date.UTC não sofre influência do fuso do aparelho
  const diasNoMes = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  return dia <= diasNoMes;
}

/** Retorna true se o texto for um horário válido: HH:MM ou HH:MM:SS. */
export function horarioValido(horario: string): boolean {
  const partes = REGEX_HORARIO.exec(horario);
  if (!partes) return false;

  const horas = Number(partes[1]);
  const minutos = Number(partes[2]);
  const segundos = partes[3] ? Number(partes[3]) : 0;

  return horas <= 23 && minutos <= 59 && segundos <= 59;
}

/** "19:00" -> "19:00:00". Se já tiver segundos, mantém. */
export function horarioParaBanco(horario: string): string {
  const texto = horario.trim();
  return texto.length === 5 ? `${texto}:00` : texto;
}

/** "19:00:00" -> "19:00" (para mostrar na tela e preencher formulários). */
export function horarioParaTela(horario: string): string {
  return horario.slice(0, 5);
}

/** "2026-11-12" -> "12/11/2026" */
export function dataParaTela(data: string): string {
  const partes = REGEX_DATA.exec(data);
  if (!partes) return data;
  return `${partes[3]}/${partes[2]}/${partes[1]}`;
}

/** "12/11/2026" -> "2026-11-12". Retorna null se o formato for inválido. */
export function dataDaTelaParaBanco(dataBR: string): string | null {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dataBR.trim());
  if (!partes) return null;
  const iso = `${partes[3]}-${partes[2]}-${partes[1]}`;
  return dataValida(iso) ? iso : null;
}

/**
 * Data de hoje no formato "AAAA-MM-DD", usando a data LOCAL do aparelho.
 * (Não usamos toISOString(), que converteria para UTC e poderia mudar o dia.)
 */
export function hojeISO(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/** "2026-11-12" -> "12" */
export function diaDoMes(data: string): string {
  const partes = REGEX_DATA.exec(data);
  if (!partes) return "";
  return String(Number(partes[3]));
}

/** "2026-11-12" -> "NOV" */
export function mesAbreviado(data: string): string {
  const partes = REGEX_DATA.exec(data);
  if (!partes) return "";
  return MESES_ABREVIADOS[Number(partes[2]) - 1] ?? "";
}

/** "2026-11-12" -> "Quinta-feira, 12 de novembro de 2026" */
export function dataLongaParaTela(data: string): string {
  const partes = REGEX_DATA.exec(data);
  if (!partes) return data;

  const ano = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);

  // Date.UTC + getUTCDay: o dia da semana não depende do fuso do aparelho
  const diaDaSemana = new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay();
  const nomeDoDia = DIAS_DA_SEMANA[diaDaSemana] ?? "";
  const nomeDoMes = MESES[mes - 1] ?? "";

  const texto = `${nomeDoDia}, ${dia} de ${nomeDoMes} de ${ano}`;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}