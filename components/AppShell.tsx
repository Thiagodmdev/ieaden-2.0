import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NAV_ITEMS, isNavItemActive } from "@/constants/navigation";
import { Colors, FontSize, Layout, Radius, Spacing } from "@/constants/theme";
import { useResponsive } from "@/hooks/useResponsive";

function Brand() {
  return (
    <Link href="/" asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="IEADEN - ir para o início"
        style={styles.brand}
      >
        <View style={styles.logo}>
          <MaterialCommunityIcons name="church" size={24} color={Colors.primary} />
        </View>
        <View style={styles.brandTextBox}>
          <Text style={styles.brandTitle}>IEADEN</Text>
          <Text style={styles.brandSubtitle} numberOfLines={2}>
            Assembleia de Deus em Nazária – PI
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

function TopNav() {
  const pathname = usePathname();

  return (
    <View style={styles.topNav}>
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(item, pathname);
        return (
          <Link key={item.label} href={item.href} asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={item.label}
              style={StyleSheet.flatten([
                styles.topNavItem,
                active && styles.topNavItemActive,
              ])}
            >
              <Text style={[styles.topNavText, active && styles.topNavTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          </Link>
        );
      })}

      <Link href="/admin/login" asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Área administrativa"
          style={styles.adminLink}
        >
          <MaterialCommunityIcons
            name="shield-lock-outline"
            size={18}
            color={Colors.white}
          />
          <Text style={styles.adminLinkText}>Admin</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function BottomBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(item, pathname);
        return (
          <Link key={item.label} href={item.href} asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={item.label}
              style={StyleSheet.flatten([
                styles.bottomItem,
                active && styles.bottomItemActive,
              ])}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={active ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[styles.bottomLabel, active && styles.bottomLabelActive]}
              >
                {item.label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const { isMobile, contentPadding } = useResponsive();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View
          style={[styles.headerInner, { paddingHorizontal: contentPadding }]}
        >
          <Brand />
          {!isMobile && <TopNav />}
        </View>
      </View>

      <View style={styles.content}>{children}</View>

      {isMobile && <BottomBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },

  // Cabeçalho
  header: {
    backgroundColor: Colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: Colors.gold,
  },
  headerInner: {
    width: "100%",
    maxWidth: Layout.maxContentWidth,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    minHeight: 64,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: Spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTextBox: {
    flexShrink: 1,
  },
  brandTitle: {
    color: Colors.white,
    fontSize: FontSize.subtitle,
    fontWeight: "800",
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: FontSize.caption,
  },

  // Navegação no topo (tablet / desktop)
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  topNavItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  topNavItemActive: {
    borderBottomColor: Colors.gold,
  },
  topNavText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: FontSize.body,
    fontWeight: "500",
  },
  topNavTextActive: {
    color: Colors.white,
    fontWeight: "700",
  },
  adminLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginLeft: Spacing.md,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  adminLinkText: {
    color: Colors.white,
    fontSize: FontSize.body - 2,
    fontWeight: "600",
  },

  // Barra inferior (celular)
  bottomBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bottomItem: {
    flex: 1,
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderTopWidth: 3,
    borderTopColor: "transparent",
  },
  bottomItemActive: {
    borderTopColor: Colors.gold,
  },
  bottomLabel: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  bottomLabelActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
});