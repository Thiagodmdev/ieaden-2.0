import type { ReactNode } from "react";
import { Redirect } from "expo-router";

import { Carregando } from "@/components/Estados";
import Screen from "@/components/Screen";
import { useAdminStatus } from "@/hooks/useAdminStatus";

type AdminGuardProps = {
  children: ReactNode;
};

/** Só mostra o conteúdo para administradores logados. Os demais vão para o login. */
export default function AdminGuard({ children }: AdminGuardProps) {
  const status = useAdminStatus();

  if (status === "verificando") {
    return (
      <Screen safeArea maxWidth={400}>
        <Carregando mensagem="Verificando acesso..." />
      </Screen>
    );
  }

  if (status === "negado") {
    return <Redirect href="/admin/login" />;
  }

  return <>{children}</>;
}