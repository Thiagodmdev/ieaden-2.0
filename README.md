<p align="center">
  <img src="assets/icon.png" width="96" alt="Ícone do IEADEN">
</p>

<h1 align="center">IEADEN 2.0</h1>

<p align="center">
  Agenda de eventos da <b>Igreja Evangélica Assembleia de Deus em Nazária – PI</b>.<br>
  App Android e Web feito com <b>React Native (Expo)</b> e <b>Supabase</b>.
</p>

<p align="center">
  <a href="https://ieaden-app.vercel.app"><b>🌐 Acessar a versão web</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React Native">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
</p>

---

## 📱 Sobre o projeto

O IEADEN reúne em um só lugar a programação da igreja: cultos, reuniões, vigílias, conferências e ensaios. Os membros consultam a agenda pelo celular ou pelo navegador, e a liderança cadastra e atualiza os eventos por um painel administrativo protegido por login.

<!-- Adicione prints em docs/ e descomente:
<p align="center">
  <img src="docs/inicio.png" width="230">
  <img src="docs/calendario.png" width="230">
  <img src="docs/admin.png" width="230">
</p>
-->

## ✨ Funcionalidades

**Área pública**
- Tela inicial com os próximos eventos
- Calendário mensal em português com os dias que têm programação
- Lista de eventos e página de detalhes (data, horário, local e descrição)
- Etiquetas por tipo de evento (Culto, Reunião, Vigília, Conferência…)

**Painel administrativo**
- Login com e-mail e senha (Supabase Auth)
- Acesso liberado só para usuários com perfil `admin`
- Criar, editar e excluir eventos, com confirmação antes de excluir
- Formulário com máscaras de data e horário

**Técnico**
- Um único código para **Android** e **Web**
- Layout responsivo para celular e desktop
- Datas tratadas como texto (`AAAA-MM-DD`), sem erros de fuso horário

## 🛠️ Tecnologias

| Camada | Ferramentas |
|---|---|
| App | React Native, Expo, Expo Router, TypeScript |
| Interface | React Native Paper, React Native Calendars, Material Community Icons |
| Back-end | Supabase (PostgreSQL + Auth) |
| Deploy | Vercel (web) · EAS Build (Android) |

## 📂 Estrutura

```
app/
  (public)/        # telas públicas: início, calendário, eventos, detalhe
  admin/           # login e painel (dashboard, novo/editar evento)
components/        # componentes reutilizáveis (cards, formulário, shells)
hooks/             # useEventos, useAdminStatus, useResponsive
services/          # acesso ao Supabase (auth e eventos)
constants/         # tema, navegação e tipos de evento
types/             # tipos TypeScript
utils/             # datas, máscaras, erros, locale do calendário
```

## 🚀 Como rodar

**Pré-requisitos:** Node.js 20+ e um projeto no [Supabase](https://supabase.com).

```bash
git clone https://github.com/Thiagodmdev/ieaden-2.0.git
cd ieaden-2.0
npm install
cp .env.example .env   # preencha com a URL e a anon key do seu projeto Supabase
npm run web            # ou: npm run android
```

### Banco de dados

O app usa duas tabelas no Supabase:

- **`eventos`**: `id`, `titulo`, `descricao`, `tipo`, `local`, `data` (date), `horario` (time), `imagem`, `created_at`
- **`profiles`**: `id` (= `auth.users.id`), `email`, `role` (`admin` libera o painel), `created_at`

> Ative o **Row Level Security**: leitura pública em `eventos` e escrita apenas para usuários com `role = 'admin'`.

## 📦 Build e deploy

```bash
npx expo export --platform web            # gera a versão web em dist/
npx eas-cli@latest build -p android --profile preview   # gera o APK
```

## 👨‍💻 Autor

Feito por **Thiago Dias** · [GitHub](https://github.com/Thiagodmdev)

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE).
