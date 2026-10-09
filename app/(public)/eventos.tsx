import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { Carregando, ErroView, VazioView } from "@/components/Estados";
import EventoCard from "@/components/EventoCard";
import Screen from "@/components/Screen";
import { Colors, Spacing } from "@/constants/theme";
import { useEventos } from "@/hooks/useEventos";
import { useResponsive } from "@/hooks/useResponsive";
import { hojeISO } from "@/utils/datetime";
import { eventosFuturos } from "@/utils/eventos";

export default function EventosScreen() {
  const { isDesktop } = useResponsive();
  const { eventos, carregando, atualizando, erro, recarregar, atualizar } =
    useEventos();

  const futuros = eventosFuturos(eventos, hojeISO());

  function renderConteudo() {
    if (carregando) {
      return <Carregando mensagem="Carregando eventos..." />;
    }
    if (erro) {
      return <ErroView mensagem={erro} onTentarNovamente={recarregar} />;
    }
    if (futuros.length === 0) {
      return <VazioView mensagem="Nenhum evento encontrado." />;
    }
    return (
      <View style={[styles.lista, isDesktop && styles.listaDesktop]}>
        {futuros.map((evento) => (
          <View key={evento.id} style={isDesktop ? styles.itemDesktop : undefined}>
            <EventoCard evento={evento} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <Screen onRefresh={atualizar} refreshing={atualizando}>
      <Text variant="headlineSmall" style={styles.title}>
        Eventos
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Confira os próximos eventos da nossa igreja.
      </Text>
      {renderConteudo()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  subtitle: {
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  lista: {
    gap: Spacing.md,
  },
  listaDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemDesktop: {
    flexBasis: "48%",
    flexGrow: 0,
  },
});