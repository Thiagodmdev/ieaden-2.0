import { StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button, Text as PaperText } from "react-native-paper";

import Card from "@/components/Card";
import { Carregando, ErroView, VazioView } from "@/components/Estados";
import EventoCard from "@/components/EventoCard";
import Screen from "@/components/Screen";
import { Colors, FontSize, Radius, Spacing } from "@/constants/theme";
import { useEventos } from "@/hooks/useEventos";
import { useResponsive } from "@/hooks/useResponsive";
import { hojeISO } from "@/utils/datetime";
import { eventosFuturos } from "@/utils/eventos";

export default function HomeScreen() {
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const { eventos, carregando, atualizando, erro, recarregar, atualizar } =
    useEventos();

  const proximos = eventosFuturos(eventos, hojeISO()).slice(0, 3);

  function renderProximos() {
    if (carregando) {
      return <Carregando mensagem="Carregando eventos..." />;
    }
    if (erro) {
      return <ErroView mensagem={erro} onTentarNovamente={recarregar} />;
    }
    if (proximos.length === 0) {
      return <VazioView mensagem="Nenhum evento encontrado." />;
    }
    return (
      <View style={styles.lista}>
        {proximos.map((evento) => (
          <EventoCard key={evento.id} evento={evento} />
        ))}
        <Button
          mode="text"
          icon="arrow-right"
          onPress={() => router.push("/eventos")}
          contentStyle={styles.buttonContentReverse}
        >
          Ver todos os eventos
        </Button>
      </View>
    );
  }

  return (
    <Screen onRefresh={atualizar} refreshing={atualizando}>
      <View style={styles.hero}>
        <View style={styles.heroAccent} />
        <Text style={styles.heroSigla}>IEADEN</Text>
        <Text style={[styles.heroName, isDesktop && styles.heroNameDesktop]}>
          Igreja Evangélica Assembleia de Deus em Nazária – PI
        </Text>
        <Text style={styles.heroMessage}>
          Seja bem-vindo(a)! Acompanhe aqui a agenda de eventos da nossa igreja.
        </Text>
      </View>

      <View style={[styles.row, isDesktop && styles.rowDesktop]}>
        <View style={isDesktop ? styles.mainColumn : undefined}>
          <PaperText variant="titleLarge" style={styles.sectionTitle}>
            Próximos eventos
          </PaperText>
          {renderProximos()}
        </View>

        <Card style={isDesktop ? styles.sideColumn : undefined}>
          <PaperText variant="titleLarge" style={styles.sectionTitle}>
            Acesso rápido
          </PaperText>
          <View style={styles.buttons}>
            <Button
              mode="contained"
              icon="calendar-month-outline"
              onPress={() => router.push("/calendario")}
              contentStyle={styles.buttonContent}
            >
              Ver calendário
            </Button>
            <Button
              mode="outlined"
              icon="format-list-bulleted"
              onPress={() => router.push("/eventos")}
              contentStyle={styles.buttonContent}
            >
              Lista de eventos
            </Button>
          </View>
        </Card>
      </View>

      <Link href="/admin/login" style={styles.adminLink}>
        Área administrativa
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  heroAccent: {
    width: 48,
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.gold,
    marginBottom: Spacing.md,
  },
  heroSigla: {
    color: Colors.gold,
    fontSize: FontSize.subtitle,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  heroName: {
    color: Colors.white,
    fontSize: FontSize.title,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  heroNameDesktop: {
    fontSize: FontSize.headline,
  },
  heroMessage: {
    color: "rgba(255,255,255,0.9)",
    fontSize: FontSize.body,
    lineHeight: 24,
  },
  row: {
    gap: Spacing.md,
  },
  rowDesktop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  mainColumn: {
    flex: 2,
  },
  sideColumn: {
    flex: 1,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  lista: {
    gap: Spacing.sm,
  },
  buttons: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  buttonContent: {
    height: 48,
  },
  buttonContentReverse: {
    flexDirection: "row-reverse",
  },
  adminLink: {
    marginTop: Spacing.lg,
    alignSelf: "center",
    color: Colors.textSecondary,
    fontSize: FontSize.body - 2,
    textDecorationLine: "underline",
    paddingVertical: Spacing.sm,
  },
});