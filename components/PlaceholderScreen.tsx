import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { Button, Text } from "react-native-paper";

import Card from "@/components/Card";
import Screen from "@/components/Screen";
import { Colors, Radius, Spacing } from "@/constants/theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type PlaceholderScreenProps = {
  title: string;
  description: string;
  icon: IconName;
  backHref?: Href;
  backLabel?: string;
  safeArea?: boolean;
};

/** Tela provisória usada na Fase 1. Será substituída nas próximas fases. */
export default function PlaceholderScreen({
  title,
  description,
  icon,
  backHref,
  backLabel = "Voltar ao início",
  safeArea = false,
}: PlaceholderScreenProps) {
  const router = useRouter();

  return (
    <Screen safeArea={safeArea} maxWidth={640}>
      <Card style={styles.card}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={icon} size={32} color={Colors.primary} />
        </View>
        <Text variant="headlineSmall" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          {description}
        </Text>
        {backHref ? (
          <Button
            mode="contained"
            onPress={() => router.push(backHref)}
            contentStyle={styles.buttonContent}
            style={styles.button}
          >
            {backLabel}
          </Button>
        ) : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  description: {
    color: Colors.textSecondary,
    textAlign: "center",
  },
  button: {
    marginTop: Spacing.lg,
  },
  buttonContent: {
    height: 48,
    paddingHorizontal: Spacing.md,
  },
});