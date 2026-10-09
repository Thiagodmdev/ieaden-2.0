import type { ReactNode } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, Layout } from "@/constants/theme";
import { useResponsive } from "@/hooks/useResponsive";

type ScreenProps = {
  children: ReactNode;
  /** Largura máxima do conteúdo. Padrão: Layout.maxContentWidth */
  maxWidth?: number;
  /** Use true em telas que não têm cabeçalho próprio (respeita o entalhe/barra de status) */
  safeArea?: boolean;
  /** Se informado, ativa o gesto de puxar para atualizar (Android). */
  onRefresh?: () => void;
  refreshing?: boolean;
};

export default function Screen({
  children,
  maxWidth = Layout.maxContentWidth,
  safeArea = false,
  onRefresh,
  refreshing = false,
}: ScreenProps) {
  const { contentPadding } = useResponsive();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        {
          padding: contentPadding,
          paddingTop: contentPadding + (safeArea ? insets.top : 0),
          paddingBottom: contentPadding + (safeArea ? insets.bottom : 0),
        },
      ]}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        ) : undefined
      }
    >
      <View style={[styles.inner, { maxWidth }]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
  },
  inner: {
    width: "100%",
  },
});