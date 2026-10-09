import type { ComponentProps } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Text } from "react-native-paper";

import { Colors, Spacing } from "@/constants/theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type CarregandoProps = {
  mensagem?: string;
};

export function Carregando({ mensagem = "Carregando..." }: CarregandoProps) {
  return (
    <View style={styles.box} accessibilityLabel={mensagem}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text variant="bodyMedium" style={styles.text}>
        {mensagem}
      </Text>
    </View>
  );
}

type ErroViewProps = {
  mensagem: string;
  onTentarNovamente?: () => void;
};

export function ErroView({ mensagem, onTentarNovamente }: ErroViewProps) {
  return (
    <View style={styles.box}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={40}
        color={Colors.error}
      />
      <Text variant="bodyMedium" style={styles.text}>
        {mensagem}
      </Text>
      {onTentarNovamente ? (
        <Button mode="outlined" onPress={onTentarNovamente}>
          Tentar novamente
        </Button>
      ) : null}
    </View>
  );
}

type VazioViewProps = {
  mensagem: string;
  icone?: IconName;
};

export function VazioView({
  mensagem,
  icone = "calendar-blank-outline",
}: VazioViewProps) {
  return (
    <View style={styles.box}>
      <MaterialCommunityIcons
        name={icone}
        size={40}
        color={Colors.textSecondary}
      />
      <Text variant="bodyMedium" style={styles.text}>
        {mensagem}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  text: {
    color: Colors.textSecondary,
    textAlign: "center",
  },
});