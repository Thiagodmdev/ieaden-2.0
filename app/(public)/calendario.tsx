import "@/utils/calendarLocale";

import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import type { DateData } from "react-native-calendars";
import { Text } from "react-native-paper";

import Card from "@/components/Card";
import { Carregando, ErroView, VazioView } from "@/components/Estados";
import EventoCard from "@/components/EventoCard";
import Screen from "@/components/Screen";
import { Colors, Spacing } from "@/constants/theme";
import { useEventos } from "@/hooks/useEventos";
import { useResponsive } from "@/hooks/useResponsive";
import { dataLongaParaTela, hojeISO } from "@/utils/datetime";
import { eventosDoDia } from "@/utils/eventos";

type MarcaDoDia = {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
  selectedDotColor?: string;
};

export default function CalendarioScreen() {
  const { isDesktop } = useResponsive();
  const { eventos, carregando, atualizando, erro, recarregar, atualizar } =
    useEventos();

  // Guardamos "hoje" uma única vez, para o calendário não pular de mês sozinho.
  const [hoje] = useState(hojeISO);
  const [diaSelecionado, setDiaSelecionado] = useState(hoje);

  // Pontinho dourado nos dias com evento + destaque no dia selecionado.
  const datasMarcadas = useMemo(() => {
    const marcas: Record<string, MarcaDoDia> = {};

    for (const evento of eventos) {
      marcas[evento.data] = { marked: true, dotColor: Colors.gold };
    }

    marcas[diaSelecionado] = {
      ...marcas[diaSelecionado],
      selected: true,
      selectedColor: Colors.primary,
      selectedDotColor: Colors.gold,
    };

    return marcas;
  }, [eventos, diaSelecionado]);

  const eventosDoDiaSelecionado = useMemo(
    () => eventosDoDia(eventos, diaSelecionado),
    [eventos, diaSelecionado],
  );

  function renderEventosDoDia() {
    if (carregando) {
      return <Carregando mensagem="Carregando eventos..." />;
    }
    if (erro) {
      return <ErroView mensagem={erro} onTentarNovamente={recarregar} />;
    }
    if (eventosDoDiaSelecionado.length === 0) {
      return <VazioView mensagem="Nenhum evento neste dia." />;
    }
    return (
      <View style={styles.lista}>
        {eventosDoDiaSelecionado.map((evento) => (
          <EventoCard key={evento.id} evento={evento} />
        ))}
      </View>
    );
  }

  return (
    <Screen onRefresh={atualizar} refreshing={atualizando}>
      <View style={[styles.row, isDesktop && styles.rowDesktop]}>
        <Card style={[styles.calendarCard, isDesktop && styles.calendarColumn]}>
          <Calendar
            current={hoje}
            markedDates={datasMarcadas}
            onDayPress={(dia: DateData) => setDiaSelecionado(dia.dateString)}
            firstDay={0}
            hideExtraDays
            enableSwipeMonths
            theme={{
              calendarBackground: Colors.surface,
              textSectionTitleColor: Colors.textSecondary,
              dayTextColor: Colors.textPrimary,
              textDisabledColor: Colors.border,
              todayTextColor: Colors.primary,
              todayBackgroundColor: Colors.goldLight,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.white,
              arrowColor: Colors.primary,
              monthTextColor: Colors.textPrimary,
              textMonthFontWeight: "700",
              dotColor: Colors.gold,
              selectedDotColor: Colors.gold,
            }}
          />
        </Card>

        <View style={isDesktop ? styles.eventsColumn : undefined}>
          <Text variant="titleMedium" style={styles.dayTitle}>
            {dataLongaParaTela(diaSelecionado)}
          </Text>
          {renderEventosDoDia()}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.md,
  },
  rowDesktop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  calendarCard: {
    padding: Spacing.sm,
  },
  calendarColumn: {
    flex: 1,
  },
  eventsColumn: {
    flex: 1,
  },
  dayTitle: {
    color: Colors.textPrimary,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  lista: {
    gap: Spacing.sm,
  },
});