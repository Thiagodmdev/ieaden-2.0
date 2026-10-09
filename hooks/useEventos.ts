import { useCallback, useEffect, useState } from "react";

import { listarEventos } from "@/services/eventos";
import type { Evento } from "@/types/evento";

/**
 * Carrega a lista de eventos uma vez, quando a tela abre.
 * - `recarregar`: tenta de novo mostrando "Carregando..." (botão "Tentar novamente").
 * - `atualizar`: busca de novo sem esconder a lista (gesto de puxar para atualizar).
 */
export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setEventos(await listarEventos());
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Não foi possível carregar os eventos.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  const atualizar = useCallback(async () => {
    setAtualizando(true);
    try {
      setEventos(await listarEventos());
      setErro(null);
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Não foi possível carregar os eventos.",
      );
    } finally {
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { eventos, carregando, atualizando, erro, recarregar: carregar, atualizar };
}