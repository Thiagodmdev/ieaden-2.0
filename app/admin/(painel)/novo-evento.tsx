import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";

import Card from "@/components/Card";
import EventoForm from "@/components/EventoForm";
import Screen from "@/components/Screen";
import { Colors, Spacing } from "@/constants/theme";
import { criarEvento } from "@/services/eventos";
import type { EventoInput } from "@/types/evento";

export default function NovoEventoScreen() {
  const router = useRouter();

  async function salvar(dados: EventoInput) {
    await criarEvento(dados);
    router.replace("/admin/dashboard");
  }

  return (
    <Screen maxWidth={720}>
      <Text variant="headlineSmall" style={styles.title}>
        Novo evento
      </Text>
      <Card>
        <EventoForm
          textoBotao="Salvar evento"
          textoEnviando="Salvando..."
          onSubmit={salvar}
          onCancelar={() => router.replace("/admin/dashboard")}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.textPrimary,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
});