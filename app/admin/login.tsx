import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { Button, Text, TextInput } from "react-native-paper";

import Card from "@/components/Card";
import { Carregando } from "@/components/Estados";
import Mensagem from "@/components/Mensagem";
import Screen from "@/components/Screen";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { login } from "@/services/auth";

export default function AdminLoginScreen() {
  const router = useRouter();
  const status = useAdminStatus();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function entrar() {
    if (entrando) return;

    if (email.trim() === "" || senha === "") {
      setErro("Informe o email e a senha.");
      return;
    }

    setEntrando(true);
    setErro(null);
    try {
      await login(email, senha);
      router.replace("/admin/dashboard");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível entrar.");
    } finally {
      setEntrando(false);
    }
  }

  // Quem já está logado como admin vai direto para o painel.
  if (status === "autorizado") {
    return <Redirect href="/admin/dashboard" />;
  }

  if (status === "verificando") {
    return (
      <Screen safeArea maxWidth={440}>
        <Carregando mensagem="Verificando acesso..." />
      </Screen>
    );
  }

  return (
    <Screen safeArea maxWidth={440}>
      <Card style={styles.card}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="shield-lock-outline"
            size={32}
            color={Colors.primary}
          />
        </View>
        <Text variant="headlineSmall" style={styles.title}>
          Área administrativa
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Entre com seu email e senha de administrador.
        </Text>

        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          keyboardType="email-address"
          editable={!entrando}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          returnKeyType="go"
          onSubmitEditing={entrar}
          editable={!entrando}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={mostrarSenha ? "eye-off-outline" : "eye-outline"}
              onPress={() => setMostrarSenha((atual) => !atual)}
            />
          }
        />

        {erro ? <Mensagem texto={erro} /> : null}

        <Button
          mode="contained"
          onPress={entrar}
          disabled={entrando}
          loading={entrando}
          contentStyle={styles.buttonContent}
        >
          {entrando ? "Entrando..." : "Entrar"}
        </Button>
        <Button
          mode="text"
          onPress={() => router.push("/")}
          disabled={entrando}
        >
          Voltar ao site
        </Button>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    color: Colors.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: "center",
  },
  input: {
    backgroundColor: Colors.surface,
  },
  buttonContent: {
    height: 48,
  },
});