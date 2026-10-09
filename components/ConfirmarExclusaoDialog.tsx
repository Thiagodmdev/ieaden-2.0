import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

import Mensagem from "@/components/Mensagem";
import { Colors, Spacing } from "@/constants/theme";
import type { Evento } from "@/types/evento";

type ConfirmarExclusaoDialogProps = {
  /** Evento que será excluído. Com null, o diálogo fica fechado. */
  evento: Evento | null;
  excluindo: boolean;
  erro: string | null;
  onConfirmar: () => void;
  onCancelar: () => void;
};

/** Confirmação de exclusão que funciona igual no Web e no Android (não usa Alert). */
export default function ConfirmarExclusaoDialog({
  evento,
  excluindo,
  erro,
  onConfirmar,
  onCancelar,
}: ConfirmarExclusaoDialogProps) {
  return (
    <Portal>
      <Dialog
        visible={evento !== null}
        onDismiss={excluindo ? undefined : onCancelar}
      >
        <Dialog.Title>Excluir evento?</Dialog.Title>
        <Dialog.Content style={styles.content}>
          <Text variant="bodyMedium">
            {evento
              ? `"${evento.titulo}" será excluído definitivamente. Essa ação não pode ser desfeita.`
              : ""}
          </Text>
          {erro ? <Mensagem texto={erro} /> : null}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancelar} disabled={excluindo}>
            Cancelar
          </Button>
          <Button
            onPress={onConfirmar}
            disabled={excluindo}
            loading={excluindo}
            textColor={Colors.error}
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.md,
  },
});