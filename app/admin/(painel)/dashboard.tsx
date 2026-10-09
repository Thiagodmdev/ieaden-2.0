import { useState } from "react";
import { StyleSheet, Text as RNText, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native-paper";

import Card from "@/components/Card";
import ConfirmarExclusaoDialog from "@/components/ConfirmarExclusaoDialog";
import { Carregando, ErroView, VazioView } from "@/components/Estados";
import Mensagem from "@/components/Mensagem";
import Screen from "@/components/Screen";
import TipoTag from "@/components/TipoTag";
import { Colors, FontSize, Radius, Spacing } from "@/constants/theme";
import { useEventos } from "@/hooks/useEventos";
import { useResponsive } from "@/hooks/useResponsive";
import { excluirEvento } from "@/services/eventos";
import type { Evento } from "@/types/evento";
import { dataParaTela, hojeISO, horarioParaTela } from "@/utils/datetime";
import { eventosFuturos } from "@/utils/eventos";

type LinhaEventoProps = {
  evento: Evento;
  empilhar: boolean;
  onEditar: () => void;
  onExcluir: () => void;
};

function LinhaEvento({ evento, empilhar, onEditar, onExcluir }: LinhaEventoProps) {
  return (
    <View style={[styles.linha, empilhar && styles.linhaEmpilhada]}>
      <View style={styles.linhaInfo}>
        <RNText style={styles.linhaTitulo} numberOfLines={2}>
          {evento.titulo}
        </RNText>
        <TipoTag tipo={evento.tipo} />
        <View style={styles.meta}>
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <RNText style={styles.metaText}>
            {dataParaTela(evento.data)} às {horarioParaTela(evento.horario)}
          </RNText>
        </View>
        <View style={styles.meta}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <RNText style={[styles.metaText, styles.metaFlex]} numberOfLines={2}>
            {evento.local}
          </RNText>
        </View>
      </View>

      <View style={[styles.linhaBotoes, empilhar && styles.linhaBotoesEmpilhados]}>
        <Button
          mode="outlined"
          icon="pencil-outline"
          onPress={onEditar}
          accessibilityLabel={`Editar ${evento.titulo}`}
        >
          Editar
        </Button>
        <Button
          mode="outlined"
          icon="trash-can-outline"
          textColor={Colors.error}
          onPress={onExcluir}
          accessibilityLabel={`Excluir ${evento.titulo}`}
        >
          Excluir
        </Button>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const { eventos, carregando, erro, recarregar } = useEventos();

  const [paraExcluir, setParaExcluir] = useState<Evento | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const total = eventos.length;
  const proximos = eventosFuturos(eventos, hojeISO()).length;

  function pedirExclusao(evento: Evento) {
    setAviso(null);
    setErroExclusao(null);
    setParaExcluir(evento);
  }

  function cancelarExclusao() {
    if (excluindo) return;
    setParaExcluir(null);
    setErroExclusao(null);
  }

  async function confirmarExclusao() {
    if (!paraExcluir) return;

    setExcluindo(true);
    setErroExclusao(null);
    try {
      await excluirEvento(paraExcluir.id);
      setParaExcluir(null);
      setAviso("Evento excluído.");
      await recarregar();
    } catch (e) {
      setErroExclusao(
        e instanceof Error ? e.message : "Não foi possível excluir o evento.",
      );
    } finally {
      setExcluindo(false);
    }
  }

  function renderLista() {
    if (carregando) {
      return <Carregando mensagem="Carregando eventos..." />;
    }
    if (erro) {
      return <ErroView mensagem={erro} onTentarNovamente={recarregar} />;
    }
    if (eventos.length === 0) {
      return <VazioView mensagem="Nenhum evento encontrado." />;
    }
    return (
      <View style={styles.lista}>
        {eventos.map((evento) => (
          <LinhaEvento
            key={evento.id}
            evento={evento}
            empilhar={isMobile}
            onEditar={() => router.push(`/admin/editar-evento/${evento.id}`)}
            onExcluir={() => pedirExclusao(evento)}
          />
        ))}
      </View>
    );
  }

  return (
    <Screen maxWidth={1000}>
      <View style={styles.header}>
        <View style={styles.headerTexto}>
          <Text variant="headlineSmall" style={styles.title}>
            Painel administrativo
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Gerencie os eventos da igreja.
          </Text>
        </View>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => router.push("/admin/novo-evento")}
          contentStyle={styles.buttonContent}
        >
          Novo evento
        </Button>
      </View>

      <View style={styles.stats}>
        <Card style={styles.statCard}>
          <RNText style={styles.statNumber}>{carregando ? "–" : total}</RNText>
          <RNText style={styles.statLabel}>Total de eventos</RNText>
        </Card>
        <Card style={styles.statCard}>
          <RNText style={styles.statNumber}>{carregando ? "–" : proximos}</RNText>
          <RNText style={styles.statLabel}>Próximos eventos</RNText>
        </Card>
      </View>

      {aviso ? (
        <View style={styles.aviso}>
          <Mensagem texto={aviso} tipo="sucesso" />
        </View>
      ) : null}

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Eventos
      </Text>
      {renderLista()}

      <ConfirmarExclusaoDialog
        evento={paraExcluir}
        excluindo={excluindo}
        erro={erroExclusao}
        onConfirmar={confirmarExclusao}
        onCancelar={cancelarExclusao}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerTexto: {
    flexShrink: 1,
  },
  title: {
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  subtitle: {
    color: Colors.textSecondary,
  },
  buttonContent: {
    height: 48,
  },
  stats: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  statNumber: {
    color: Colors.primary,
    fontSize: FontSize.headline,
    fontWeight: "800",
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.body - 2,
    textAlign: "center",
  },
  aviso: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  lista: {
    gap: Spacing.sm,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  linhaEmpilhada: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  linhaInfo: {
    flex: 1,
    gap: Spacing.xs + 2,
  },
  linhaTitulo: {
    color: Colors.textPrimary,
    fontSize: FontSize.subtitle,
    fontWeight: "700",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: FontSize.body - 2,
  },
  metaFlex: {
    flexShrink: 1,
  },
  linhaBotoes: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  linhaBotoesEmpilhados: {
    justifyContent: "flex-start",
  },
});