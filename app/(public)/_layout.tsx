import { Slot } from "expo-router";

import AppShell from "@/components/AppShell";

export default function PublicLayout() {
  return (
    <AppShell>
      <Slot />
    </AppShell>
  );
}