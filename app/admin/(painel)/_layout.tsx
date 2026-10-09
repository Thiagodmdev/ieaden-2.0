import { Slot } from "expo-router";

import AdminGuard from "@/components/AdminGuard";
import AdminShell from "@/components/AdminShell";

/** Tudo dentro de (painel) exige login de administrador. */
export default function PainelLayout() {
  return (
    <AdminGuard>
      <AdminShell>
        <Slot />
      </AdminShell>
    </AdminGuard>
  );
}