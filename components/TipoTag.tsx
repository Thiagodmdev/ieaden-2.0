import { StyleSheet, Text, View } from "react-native";

import { Colors, FontSize, Radius, Spacing } from "@/constants/theme";

type TipoTagProps = {
  tipo: string;
};

/** Etiqueta com o tipo do evento (Culto, Reunião, etc.). */
export default function TipoTag({ tipo }: TipoTagProps) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{tipo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
  },
  text: {
    color: Colors.primary,
    fontSize: FontSize.caption + 1,
    fontWeight: "700",
  },
});