import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Text } from "react-native-paper";

import Card from "@/components/Card";
import { Carregando, ErroView, VazioView } from "@/components/Estados";
import EventoForm from "@/components/EventoForm";
import Screen from "@/components/Screen";
import { Colors, Spacing } from "@/constants/theme";
import { atualizarEvento, buscarEventoPorId } from "@/services/eventos";
import type { Evento, EventoInput } from "@/types/evento";

export default function EditarEventoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setEvento(await buscarEventoPorId(String(id)));
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Não foi possível carregar o evento.",
      );
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function salvar(dados: EventoInput) {
    await atualizarEvento(String(id), dados);
    router.replace("/admin/dashboard");
  }

  function renderConteudo() {
    if (carregando) {
      return <Carregando mensagem="Carregando evento..." />;
    }
    if (erro) {
      return <ErroView mensagem={erro} onTentarNovamente={carregar} />;
    }
    if (!evento) {
      return (
        <>
          <VazioView mensagem="Evento não encontrado." />
          <Button mode="outlined" onPress={() => router.replace("/admin/dashboard")}>
            Voltar ao painel
          </Button>
        </>
      );
    }
    return (
      <Card>
        <EventoForm
          key={evento.id}
          inicial={evento}
          textoBotao="Salvar alterações"
          textoEnviando="Salvando..."
          onSubmit={salvar}
          onCancelar={() => router.replace("/admin/dashboard")}
        />
      </Card>
    );
  }

  return (
    <Screen maxWidth={720}>
      <Text variant="headlineSmall" style={styles.title}>
        Editar evento
      </Text>
      {renderConteudo()}
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
