/**
 * Erro com mensagem amigável, pronta para ser mostrada ao usuário.
 * As telas devem mostrar apenas `error.message`.
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

type ErroDoSupabase = {
  code?: string;
  message?: string;
  status?: number;
};

function lerErro(erro: unknown): ErroDoSupabase {
  if (typeof erro === "object" && erro !== null) {
    return erro as ErroDoSupabase;
  }
  return {};
}

const REGEX_SEM_REDE = /failed to fetch|network request failed|fetch failed/i;

/** Converte erros do banco (PostgREST/Postgres) em mensagens compreensíveis. */
export function traduzirErroDoBanco(
  erro: unknown,
  mensagemPadrao: string,
): AppError {
  const { code, message } = lerErro(erro);

  // 23502 = campo obrigatório vazio | 22007 / 22P02 / 22008 = formato de data/hora/id inválido
  if (code === "23502") {
    return new AppError("Preencha todos os campos obrigatórios.");
  }
  if (code === "22007" || code === "22P02" || code === "22008") {
    return new AppError("Verifique a data e o horário informados.");
  }
  // 42501 = permissão negada (RLS)
  if (code === "42501") {
    return new AppError("Você não possui permissão de administrador.");
  }
  if (message && REGEX_SEM_REDE.test(message)) {
    return new AppError("Sem conexão com o servidor. Verifique sua internet.");
  }

  return new AppError(mensagemPadrao);
}

/** Converte erros do Supabase Auth em mensagens compreensíveis. */
export function traduzirErroDeLogin(erro: unknown): AppError {
  const { message, status } = lerErro(erro);

  if (message && REGEX_SEM_REDE.test(message)) {
    return new AppError("Sem conexão com o servidor. Verifique sua internet.");
  }
  if (message && /email not confirmed/i.test(message)) {
    return new AppError("Este usuário ainda não foi confirmado no Supabase.");
  }
  if (status === 400 || (message && /invalid login credentials/i.test(message))) {
    return new AppError("Email ou senha incorretos.");
  }
  if (status === 429) {
    return new AppError("Muitas tentativas. Aguarde um pouco e tente novamente.");
  }

  return new AppError("Não foi possível entrar. Tente novamente.");
}