import { StyleSheet, Text, View } from "react-native";

import { Colors, FontSize, Radius, Spacing } from "@/constants/theme";

type MensagemProps = {
  texto: string;
  tipo?: "erro" | "sucesso";
};

/** Faixa de aviso para erros e confirmações dentro de formulários e telas. */
export default function Mensagem({ texto, tipo = "erro" }: MensagemProps) {
  const sucesso = tipo === "sucesso";

  return (
    <View
      accessibilityRole="alert"
      style={[styles.box, sucesso ? styles.boxSucesso : styles.boxErro]}
    >
      <Text style={[styles.text, { color: sucesso ? Colors.success : Colors.error }]}>
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  boxErro: {
    backgroundColor: "#FDECEA",
    borderColor: Colors.error,
  },
  boxSucesso: {
    backgroundColor: "#E8F5E9",
    borderColor: Colors.success,
  },
  text: {
    fontSize: FontSize.body - 1,
    fontWeight: "600",
  },
});