import type { Evento } from "@/types/evento";

/**
 * Eventos de hoje em diante. `hoje` e `evento.data` são textos "AAAA-MM-DD",
 * então a comparação de texto funciona e não envolve fuso horário.
 * A ordem da lista original (data e horário) é mantida.
 */
export function eventosFuturos(eventos: Evento[], hoje: string): Evento[] {
  return eventos.filter((evento) => evento.data >= hoje);
}

/** Eventos de um dia específico ("AAAA-MM-DD"). */
export function eventosDoDia(eventos: Evento[], dia: string): Evento[] {
  return eventos.filter((evento) => evento.data === dia);
}