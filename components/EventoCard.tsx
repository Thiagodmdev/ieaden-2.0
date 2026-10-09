import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

import TipoTag from "@/components/TipoTag";
import { Colors, FontSize, Radius, Spacing } from "@/constants/theme";
import type { Evento } from "@/types/evento";
import {
  dataLongaParaTela,
  dataParaTela,
  diaDoMes,
  horarioParaTela,
  mesAbreviado,
} from "@/utils/datetime";

type EventoCardProps = {
  evento: Evento;
};

/** Card resumido de um evento. Ao tocar, abre os detalhes. */
export default function EventoCard({ evento }: EventoCardProps) {
  const horario = horarioParaTela(evento.horario);

  return (
    <Link href={`/evento/${evento.id}`} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${evento.titulo}, ${dataLongaParaTela(evento.data)}, ${horario}. Ver detalhes`}
        android_ripple={{ color: "rgba(30,58,138,0.12)" }}
        style={styles.card}
      >
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{diaDoMes(evento.data)}</Text>
          <Text style={styles.dateMonth}>{mesAbreviado(evento.data)}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {evento.titulo}
          </Text>
          <TipoTag tipo={evento.tipo} />

          <View style={styles.metaWrap}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.metaText}>{dataParaTela(evento.data)}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.metaText}>{horario}</Text>
            </View>
          </View>

          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color={Colors.textSecondary}
            />
            <Text style={[styles.metaText, styles.flexText]} numberOfLines={2}>
              {evento.local}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    overflow: "hidden",
  },
  dateBadge: {
    width: 56,
    height: 64,
    borderRadius: Radius.md,
    backgroundColor: Colors.goldLight,
    borderWidth: 1,
    borderColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: {
    color: Colors.primary,
    fontSize: FontSize.title,
    fontWeight: "800",
    lineHeight: 28,
  },
  dateMonth: {
    color: Colors.primary,
    fontSize: FontSize.caption,
    fontWeight: "700",
    letterSpacing: 1,
  },
  info: {
    flex: 1,
    gap: Spacing.xs + 2,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.subtitle,
    fontWeight: "700",
  },
  metaWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: Spacing.md,
    rowGap: Spacing.xs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: FontSize.body - 2,
  },
  flexText: {
    flexShrink: 1,
  },
});