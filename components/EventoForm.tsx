import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Chip, HelperText, Text, TextInput } from "react-native-paper";

import Mensagem from "@/components/Mensagem";
import { Colors, Spacing } from "@/constants/theme";
import { TIPOS_EVENTO } from "@/constants/eventos";
import type { Evento, EventoInput } from "@/types/evento";
import {
  dataDaTelaParaBanco,
  dataParaTela,
  horarioParaTela,
  horarioValido,
} from "@/utils/datetime";
import { mascaraData, mascaraHorario } from "@/utils/masks";

type CampoComErro = "titulo" | "descricao" | "tipo" | "local" | "data" | "horario";
type Erros = Partial<Record<CampoComErro, string>>;

type EventoFormProps = {
  /** Evento a editar. Sem ele, o formulário começa vazio (novo evento). */
  inicial?: Evento;
  textoBotao: string;
  textoEnviando: string;
  onSubmit: (dados: EventoInput) => Promise<void>;
  onCancelar: () => void;
};

/** Formulário usado para criar e para editar eventos. */
export default function EventoForm({
  inicial,
  textoBotao,
  textoEnviando,
  onSubmit,
  onCancelar,
}: EventoFormProps) {
  const [titulo, setTitulo] = useState(inicial?.titulo ?? "");
  const [descricao, setDescricao] = useState(inicial?.descricao ?? "");
  const [tipo, setTipo] = useState(inicial?.tipo ?? "");
  const [local, setLocal] = useState(inicial?.local ?? "");
  const [dataTexto, setDataTexto] = useState(
    inicial ? dataParaTela(inicial.data) : "",
  );
  const [horarioTexto, setHorarioTexto] = useState(
    inicial ? horarioParaTela(inicial.horario) : "",
  );

  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Se o evento editado tiver um tipo que não está na lista, ele também aparece como opção.
  const opcoesDeTipo =
    inicial?.tipo && !TIPOS_EVENTO.includes(inicial.tipo)
      ? [...TIPOS_EVENTO, inicial.tipo]
      : TIPOS_EVENTO;

  async function enviar() {
    setErroGeral(null);

    const novosErros: Erros = {};
    let faltouCampo = false;

    if (titulo.trim() === "") {
      novosErros.titulo = "Informe o título.";
      faltouCampo = true;
    }
    if (descricao.trim() === "") {
      novosErros.descricao = "Informe a descrição.";
      faltouCampo = true;
    }
    if (tipo.trim() === "") {
      novosErros.tipo = "Escolha o tipo do evento.";
      faltouCampo = true;
    }
    if (local.trim() === "") {
      novosErros.local = "Informe o local.";
      faltouCampo = true;
    }

    const dataISO = dataDaTelaParaBanco(dataTexto);
    if (dataTexto.trim() === "") {
      novosErros.data = "Informe a data.";
      faltouCampo = true;
    } else if (!dataISO) {
      novosErros.data = "Data inválida. Use DD/MM/AAAA.";
    }

    if (horarioTexto.trim() === "") {
      novosErros.horario = "Informe o horário.";
      faltouCampo = true;
    } else if (!horarioValido(horarioTexto)) {
      novosErros.horario = "Horário inválido. Use HH:MM.";
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0 || !dataISO) {
      setErroGeral(
        faltouCampo
          ? "Preencha todos os campos obrigatórios."
          : "Corrija os campos destacados.",
      );
      return;
    }

    setEnviando(true);
    try {
      await onSubmit({
        titulo,
        descricao,
        tipo,
        local,
        data: dataISO,
        horario: horarioTexto,
      });
    } catch (e) {
      setErroGeral(
        e instanceof Error ? e.message : "Não foi possível salvar o evento.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.form}>
      <View>
        <TextInput
          mode="outlined"
          label="Título"
          value={titulo}
          onChangeText={setTitulo}
          error={Boolean(erros.titulo)}
          editable={!enviando}
          maxLength={120}
        />
        {erros.titulo ? <HelperText type="error">{erros.titulo}</HelperText> : null}
      </View>

      <View>
        <Text variant="labelLarge" style={styles.label}>
          Tipo
        </Text>
        <View style={styles.chips}>
          {opcoesDeTipo.map((opcao) => (
            <Chip
              key={opcao}
              selected={tipo === opcao}
              showSelectedCheck
              disabled={enviando}
              onPress={() => setTipo(opcao)}
            >
              {opcao}
            </Chip>
          ))}
        </View>
        {erros.tipo ? <HelperText type="error">{erros.tipo}</HelperText> : null}
      </View>

      <View>
        <TextInput
          mode="outlined"
          label="Local"
          value={local}
          onChangeText={setLocal}
          error={Boolean(erros.local)}
          editable={!enviando}
          maxLength={160}
        />
        {erros.local ? <HelperText type="error">{erros.local}</HelperText> : null}
      </View>

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <TextInput
            mode="outlined"
            label="Data (DD/MM/AAAA)"
            value={dataTexto}
            onChangeText={(texto) => setDataTexto(mascaraData(texto))}
            keyboardType="number-pad"
            placeholder="12/11/2026"
            error={Boolean(erros.data)}
            editable={!enviando}
          />
          {erros.data ? <HelperText type="error">{erros.data}</HelperText> : null}
        </View>

        <View style={styles.rowItem}>
          <TextInput
            mode="outlined"
            label="Horário (HH:MM)"
            value={horarioTexto}
            onChangeText={(texto) => setHorarioTexto(mascaraHorario(texto))}
            keyboardType="number-pad"
            placeholder="19:00"
            error={Boolean(erros.horario)}
            editable={!enviando}
          />
          {erros.horario ? (
            <HelperText type="error">{erros.horario}</HelperText>
          ) : null}
        </View>
      </View>

      <View>
        <TextInput
          mode="outlined"
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          error={Boolean(erros.descricao)}
          editable={!enviando}
          multiline
          numberOfLines={5}
          style={styles.descricao}
        />
        {erros.descricao ? (
          <HelperText type="error">{erros.descricao}</HelperText>
        ) : null}
      </View>

      {erroGeral ? <Mensagem texto={erroGeral} /> : null}

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={enviar}
          disabled={enviando}
          loading={enviando}
          contentStyle={styles.buttonContent}
        >
          {enviando ? textoEnviando : textoBotao}
        </Button>
        <Button
          mode="outlined"
          onPress={onCancelar}
          disabled={enviando}
          contentStyle={styles.buttonContent}
        >
          Cancelar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.md,
  },
  label: {
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  descricao: {
    minHeight: 120,
  },
  actions: {
    gap: Spacing.sm,
  },
  buttonContent: {
    height: 48,
  },
});