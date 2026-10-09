import type { ComponentProps } from "react";
import type { Href } from "expo-router";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export type NavItem = {
  label: string;
  href: Href;
  icon: IconName;
  /** Caminhos que deixam este item "ativo" */
  matchPrefixes: string[];
  /** Se true, só fica ativo quando o caminho for exatamente "/" */
  exact?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Início",
    href: "/",
    icon: "home-outline",
    matchPrefixes: ["/"],
    exact: true,
  },
  {
    label: "Calendário",
    href: "/calendario",
    icon: "calendar-month-outline",
    matchPrefixes: ["/calendario"],
  },
  {
    label: "Eventos",
    href: "/eventos",
    icon: "format-list-bulleted",
    matchPrefixes: ["/eventos", "/evento"],
  },
];

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.exact) {
    return pathname === "/";
  }
  return item.matchPrefixes.some((prefix) => pathname.startsWith(prefix));
}