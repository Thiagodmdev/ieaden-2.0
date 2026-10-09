import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, usePathname, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, FontSize, Radius, Spacing } from "@/constants/theme";
import { useResponsive } from "@/hooks/useResponsive";
import { logout } from "@/services/auth";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type ItemAdmin = {
  label: string;
  href: Href;
  icon: IconName;
  prefixos: string[];
};

const ITENS: ItemAdmin[] = [
  {
    label: "Painel",
    href: "/admin/dashboard",
    icon: "view-dashboard-outline",
    prefixos: ["/admin/dashboard", "/admin/editar-evento"],
  },
  {
    label: "Novo evento",
    href: "/admin/novo-evento",
    icon: "plus-circle-outline",
    prefixos: ["/admin/novo-evento"],
  },
  {
    label: "Ver site",
    href: "/",
    icon: "web",
    prefixos: [],
  },
];

type NavLinkProps = {
  item: ItemAdmin;
  ativo: boolean;
  lateral: boolean;
};

function NavLink({ item, ativo, lateral }: NavLinkProps) {
  return (
    <Link href={item.href} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={item.label}
        style={StyleSheet.flatten([
          lateral ? styles.sideItem : styles.topItem,
          ativo && (lateral ? styles.sideItemAtivo : styles.topItemAtivo),
        ])}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={20}
          color={lateral ? Colors.white : ativo ? Colors.primary : Colors.textSecondary}
        />
        <Text
          style={[
            lateral ? styles.sideText : styles.topText,
            ativo && (lateral ? styles.sideTextAtivo : styles.topTextAtivo),
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    </Link>
  );
}

type AdminShellProps = {
  children: ReactNode;
};

/** Moldura do painel: barra lateral no computador, barra superior no celular. */
export default function AdminShell({ children }: AdminShellProps) {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const [saindo, setSaindo] = useState(false);
  const [erroSair, setErroSair] = useState<string | null>(null);

  async function sair() {
    setSaindo(true);
    setErroSair(null);
    try {
      await logout();
      router.replace("/admin/login");
    } catch (e) {
      setErroSair(e instanceof Error ? e.message : "Não foi possível sair.");
      setSaindo(false);
    }
  }

  function estaAtivo(item: ItemAdmin) {
    return item.prefixos.some((prefixo) => pathname.startsWith(prefixo));
  }

  const botaoSair = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sair"
      disabled={saindo}
      onPress={sair}
      style={({ pressed }) => [
        isMobile ? styles.logoutMobile : styles.logoutSide,
        pressed && styles.pressed,
      ]}
    >
      <MaterialCommunityIcons name="logout" size={20} color={Colors.white} />
      <Text style={styles.logoutText}>{saindo ? "Saindo..." : "Sair"}</Text>
    </Pressable>
  );

  if (isMobile) {
    return (
      <View style={styles.root}>
        <View style={[styles.topBar, { paddingTop: insets.top }]}>
          <View style={styles.topBarInner}>
            <View>
              <Text style={styles.brandTitle}>IEADEN</Text>
              <Text style={styles.brandSubtitle}>Área administrativa</Text>
            </View>
            {botaoSair}
          </View>
        </View>

        <View style={styles.mobileNav}>
          {ITENS.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              ativo={estaAtivo(item)}
              lateral={false}
            />
          ))}
        </View>

        {erroSair ? <Text style={styles.erroSair}>{erroSair}</Text> : null}

        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.root, styles.rootDesktop]}>
      <View style={[styles.sidebar, { paddingTop: insets.top + Spacing.lg }]}>
        <View style={styles.sidebarBrand}>
          <View style={styles.logo}>
            <MaterialCommunityIcons name="church" size={24} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.brandTitle}>IEADEN</Text>
            <Text style={styles.brandSubtitle}>Área administrativa</Text>
          </View>
        </View>

        <View style={styles.sideNav}>
          {ITENS.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              ativo={estaAtivo(item)}
              lateral
            />
          ))}
        </View>

        <View style={styles.sidebarFooter}>
          {erroSair ? <Text style={styles.erroSairLateral}>{erroSair}</Text> : null}
          {botaoSair}
        </View>
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  rootDesktop: {
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },

  // Marca
  logo: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
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

  // Barra lateral (computador)
  sidebar: {
    width: 240,
    backgroundColor: Colors.primary,
    borderRightWidth: 3,
    borderRightColor: Colors.gold,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  sidebarBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  sideNav: {
    gap: Spacing.xs,
    flex: 1,
  },
  sideItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    minHeight: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  sideItemAtivo: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  sideText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: FontSize.body,
    fontWeight: "500",
  },
  sideTextAtivo: {
    color: Colors.white,
    fontWeight: "700",
  },
  sidebarFooter: {
    gap: Spacing.sm,
  },
  logoutSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    minHeight: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  logoutText: {
    color: Colors.white,
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  erroSairLateral: {
    color: Colors.white,
    fontSize: FontSize.caption + 1,
  },

  // Barra superior (celular)
  topBar: {
    backgroundColor: Colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: Colors.gold,
  },
  topBarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 60,
  },
  logoutMobile: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    minHeight: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  mobileNav: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    minHeight: 48,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  topItemAtivo: {
    borderBottomColor: Colors.gold,
  },
  topText: {
    color: Colors.textSecondary,
    fontSize: FontSize.caption + 1,
  },
  topTextAtivo: {
    color: Colors.primary,
    fontWeight: "700",
  },
  erroSair: {
    color: Colors.error,
    textAlign: "center",
    padding: Spacing.sm,
    fontSize: FontSize.caption + 1,
  },
});