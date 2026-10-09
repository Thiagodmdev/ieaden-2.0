import { useEffect, useState } from "react";

import { obterSessao, usuarioEhAdmin } from "@/services/auth";

export type StatusAdmin = "verificando" | "autorizado" | "negado";

/**
 * Verifica, ao abrir a tela, se existe sessão e se o usuário é administrador.
 * Qualquer falha (sem sessão, sem permissão, erro de rede) resulta em "negado".
 */
export function useAdminStatus(): StatusAdmin {
  const [status, setStatus] = useState<StatusAdmin>("verificando");

  useEffect(() => {
    let ativo = true;

    async function verificar() {
      try {
        const sessao = await obterSessao();
        if (!sessao) {
          if (ativo) setStatus("negado");
          return;
        }
        const ehAdmin = await usuarioEhAdmin(sessao.user.id);
        if (ativo) setStatus(ehAdmin ? "autorizado" : "negado");
      } catch {
        if (ativo) setStatus("negado");
      }
    }

    verificar();

    return () => {
      ativo = false;
    };
  }, []);

  return status;
}