import { useWindowDimensions } from "react-native";

import { Layout, Spacing } from "@/constants/theme";

export function useResponsive() {
  const { width } = useWindowDimensions();

  const isMobile = width < Layout.tabletBreakpoint;
  const isDesktop = width >= Layout.desktopBreakpoint;
  const isTablet = !isMobile && !isDesktop;

  const contentPadding = isDesktop
    ? Spacing.xl
    : isTablet
      ? Spacing.lg
      : Spacing.md;

  return { width, isMobile, isTablet, isDesktop, contentPadding };
}