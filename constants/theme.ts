import { MD3LightTheme } from "react-native-paper";

export const Colors = {
  primary: "#1E3A8A",
  primaryDark: "#172B66",
  primaryLight: "#E8EDFA",
  gold: "#C9A227",
  goldLight: "#FBF4DC",
  white: "#FFFFFF",
  background: "#F5F7FB",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  textPrimary: "#1F2937",
  textSecondary: "#5B6472",
  error: "#B3261E",
  success: "#2E7D32",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const FontSize = {
  caption: 12,
  body: 16,
  subtitle: 18,
  title: 24,
  headline: 32,
} as const;

export const Layout = {
  /** Largura máxima do conteúdo (evita telas largas demais) */
  maxContentWidth: 1100,
  /** A partir daqui a barra de navegação vai para o topo */
  tabletBreakpoint: 768,
  /** A partir daqui usamos layouts em colunas */
  desktopBreakpoint: 1024,
} as const;

/** Tema do React Native Paper com as cores do IEADEN */
export const paperTheme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    onPrimary: Colors.white,
    primaryContainer: Colors.primaryLight,
    onPrimaryContainer: Colors.primaryDark,
    secondary: Colors.gold,
    secondaryContainer: Colors.goldLight,
    background: Colors.background,
    surface: Colors.surface,
    error: Colors.error,
  },
};