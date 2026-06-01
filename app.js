const API = "/festa-viva/api";
const STORAGE_KEY = "festaVivaThemeFlowV2";

const questions = [
  {
    id: "age",
    prompt: "Qual a idade da criança?",
    type: "single",
    options: ["1 ano", "2 anos", "3 a 4 anos", "5 a 7 anos", "8+ anos"]
  },
  {
    id: "place",
    prompt: "Onde será a festa?",
    type: "single",
    options: ["Casa", "Condomínio", "Buffet", "Escola", "Salão", "Ao ar livre", "Ainda não sei"]
  },
  {
    id: "size",
    prompt: "Qual será o tamanho da festa?",
    type: "single",
    options: ["Só família", "Pequena", "Média", "Grande", "Ainda não sei"]
  },
  {
    id: "style",
    prompt: "Qual estilo você imagina?",
    type: "single",
    options: ["Fofo", "Divertido", "Econômico", "Sofisticado", "Criativo", "Com personagem", "Diferente", "Fácil de montar"]
  },
  {
    id: "interests",
    prompt: "O que a criança mais gosta?",
    type: "multi",
    options: ["Animais", "Futebol", "Música", "Princesas", "Heróis", "Dinossauros", "Carros", "Games", "Natureza", "Faz de conta", "Dança", "Desenhos", "Comidinhas", "Brincadeiras"]
  },
  {
    id: "avoid",
    prompt: "Tem algo que você quer evitar?",
    type: "multi",
    options: ["Tema muito caro", "Tema muito comum", "Tema difícil de decorar", "Personagem licenciado", "Algo muito infantil", "Algo muito adulto", "Não tenho restrições"]
  },
  {
    id: "budget",
    prompt: "Qual faixa de orçamento?",
    type: "single",
    options: ["Baixo", "Médio", "Alto", "Ainda não sei"]
  }
];

const featureModules = [
  { id: "invite", name: "Convite digital", plan: "included", description: "Página inicial com tema, data, horário, local e contagem regressiva.", section: "Convite digital com contagem regressiva", interaction: "Compartilhamento simples do convite" },
  { id: "rsvp", name: "RSVP por família", plan: "included", description: "Confirmação de presença com adultos, crianças pagantes e menores de 5.", section: "Confirmação de presença", interaction: "Contagem por família para os pais" },
  { id: "gallery", name: "Fotos com aprovação", plan: "included", description: "Convidados enviam fotos e os pais aprovam antes de publicar.", section: "Galeria de fotos com aprovação", interaction: "Upload de fotos moderado" },
  { id: "quiz", name: "Quiz da criança", plan: "included", description: "Perguntas rápidas para brincar com os convidados no dia da festa.", section: "Quiz sobre a criança", interaction: "Ranking leve do quiz" },
  { id: "messages", name: "Mural de recados", plan: "included", description: "Mensagens dos convidados com aprovação dos pais.", section: "Mural de recados", interaction: "Recados afetivos para a família" },
  { id: "capsule", name: "Cápsula do tempo", plan: "included", description: "Mensagens para a criança ler no futuro.", section: "Cápsula do tempo", interaction: "Pergunta afetiva para o futuro" },
  { id: "album", name: "Álbum pós-festa", plan: "included", description: "Página de lembranças depois da festa, com fotos aprovadas.", section: "Álbum pós-festa", interaction: "Agradecimento pós-festa" },
  { id: "screen", name: "Modo telão", plan: "evaluation", description: "Fotos, recados e ranking em uma tela durante o evento.", section: "Modo telão para o dia da festa", interaction: "Telão com recados, fotos e ranking" },
  { id: "missions", name: "Missões da festa", plan: "evaluation", description: "Desafios simples para convidados criarem fotos e memórias.", section: "Missões da festa", interaction: "Missões guiadas para convidados" },
  { id: "menu", name: "Cardápio", plan: "evaluation", description: "Cardápio do buffet ou da festa dentro do site.", section: "Cardápio", interaction: "Consulta rápida do cardápio" },
  { id: "story", name: "História da criança", plan: "evaluation", description: "Linha do tempo, fotos e pequenos marcos da criança.", section: "História da criança", interaction: "Linha do tempo afetiva" },
  { id: "customGame", name: "Jogo personalizado", plan: "evaluation", description: "Uma brincadeira digital sob medida para o tema.", section: "Jogo personalizado", interaction: "Mini jogo temático" },
  { id: "messaging", name: "Disparos por WhatsApp/e-mail", plan: "evaluation", description: "Convites e lembretes enviados por canais oficiais.", section: "Convites e lembretes automatizados", interaction: "Mensagem de convite e lembrete" }
];

const initialState = {
  screen: "home",
  questionIndex: 0,
  answers: {},
  suggestions: [],
  selectedTheme: null,
  refinementText: "",
  refinedThemes: [],
  aiPersonalization: null,
  confirmation: {},
  preview: null,
  briefing: null,
  briefingEditable: false,
  selectedModules: [],
  contact: { name: "", email: "", phone: "", buffetCode: "" },
  loading: "",
  error: ""
};

let state = loadState();
const app = document.getElementById("app");
const toast = document.getElementById("toast");

document.addEventListener("click", handleClick);
document.addEventListener("input", handleInput);
render();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") return { ...initialState, ...saved, screen: "home" };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return structuredClone(initialState);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setState(patch) {
  state = { ...state, ...patch };
  saveState();
  render();
}

function resetFlow() {
  state = structuredClone(initialState);
  saveState();
  render();
}

function startPlanner() {
  state = { ...structuredClone(initialState), screen: "quiz" };
  saveState();
  render();
}

function render() {
  app.innerHTML = {
    home: MinimalHome,
    quiz: ChatThemeAssistant,
    suggestions: ThemeSuggestionsStep,
    refine: AIPersonalizationPanel,
    confirm: ThemeConfirmationStep,
    features: FeatureSelectionStep,
    preview: ExperiencePreview,
    briefing: DevelopmentBriefingPreview
  }[state.screen]();
}

function MinimalHome() {
  return `
    <section class="home screen">
      <div class="home-card">
        <div class="brand"><span class="brand-mark"></span> Agente Festeiro</div>
        <h1>Escolha como quer conhecer a experiência</h1>
        <p class="lead">Veja demos reais de festas digitais ou planeje uma experiência personalizada com o assistente.</p>
        <div class="home-options">
          <a class="route-card luiza" href="/festa-luiza/">
            <span class="route-eyebrow">Demo 1</span>
            <strong>Festa da Luiza</strong>
            <small>Conheça uma experiência publicada, com convite, segurança e galeria.</small>
          </a>
          <a class="route-card luma" href="/festa-luma/">
            <span class="route-eyebrow">Demo 2</span>
            <strong>Festa da Luma</strong>
            <small>Veja uma festa tema Minnie com RSVP, fotos, quiz, mural e cápsula.</small>
          </a>
          <button class="route-card planner" data-action="start">
            <span class="route-eyebrow">Assistente</span>
            <strong>Planejar minha festa</strong>
            <small>Descubra o tema, gere uma prévia e envie o briefing para avaliação.</small>
          </button>
        </div>
        <p class="micro">O planejamento leva menos de 2 minutos.</p>
      </div>
    </section>
  `;
}

function ChatThemeAssistant() {
  const question = questions[state.questionIndex];
  const progress = Math.round((state.questionIndex / questions.length) * 100);
  return StepShell(`
    <div class="assistant-layout">
      <aside class="assistant-card">
        <p><strong>Oi!</strong> Vou te ajudar a escolher um tema que combine com a idade, gostos e estilo da criança.</p>
        <p class="micro">No final, você confirma o tema e gera um briefing para o time avaliar viabilidade, prazo e complexidade.</p>
        ${AnswerStrip()}
      </aside>
      ${ChatQuestion(question)}
    </div>
  `, `Pergunta ${state.questionIndex + 1} de ${questions.length}`, progress);
}

function ChatQuestion(question) {
  return `
    <section class="question-card">
      <h2>${escapeHtml(question.prompt)}</h2>
      <div class="chips">
        ${question.options.map(option => OptionChip(question, option)).join("")}
      </div>
      ${question.type === "multi" ? `
        <div class="cta-row">
          <button class="button primary" data-action="next-question" ${getAnswer(question.id).length ? "" : "disabled"}>Continuar</button>
          <button class="button ghost" data-action="back-question">Voltar</button>
        </div>
      ` : `
        <div class="cta-row">
          <button class="button ghost" data-action="back-question" ${state.questionIndex === 0 ? "disabled" : ""}>Voltar</button>
        </div>
      `}
    </section>
  `;
}

function OptionChip(question, option) {
  const answer = getAnswer(question.id);
  const active = Array.isArray(answer) ? answer.includes(option) : answer === option;
  return `<button class="chip ${active ? "active" : ""}" data-action="answer" data-question="${question.id}" data-value="${escapeAttr(option)}">${escapeHtml(option)}</button>`;
}

function ThemeSuggestionsStep() {
  return StepShell(`
    <div class="section-title">
      <h2>Escolha um caminho</h2>
      <p class="lead">Separei temas possíveis, bonitos e viáveis para o contexto da festa.</p>
    </div>
    <div class="cards">
      ${state.suggestions.map((theme, index) => ThemeSuggestionCard(theme, index)).join("")}
    </div>
    <div class="cta-row">
      <button class="button secondary" data-action="back-to-quiz">Ajustar respostas</button>
      <button class="button ghost" data-action="reset">Recomeçar</button>
    </div>
  `, "Sugestões", 100);
}

function ThemeSuggestionCard(theme, index) {
  return `
    <article class="theme-card">
      <h3>${escapeHtml(theme.name)}</h3>
      <p class="micro">${escapeHtml(theme.whyFits)}</p>
      <div class="theme-meta">
        <span class="tag">Custo: ${escapeHtml(theme.cost)}</span>
        <span class="tag">Dificuldade: ${escapeHtml(theme.difficulty)}</span>
      </div>
      <div class="card-actions">
        <button class="button primary" data-action="choose-theme" data-index="${index}">Escolher este tema</button>
        <button class="button secondary" data-action="refine-theme" data-index="${index}">Refinar com IA</button>
      </div>
    </article>
  `;
}

function AIPersonalizationPanel() {
  const theme = state.selectedTheme || {};
  return StepShell(`
    <div class="assistant-layout">
      <aside class="assistant-card">
        <p><strong>Base escolhida:</strong> ${escapeHtml(theme.name || "Tema")}</p>
        <p class="micro">Agora a IA pode deixar a ideia mais pessoal, sem inventar algo caro ou difícil demais.</p>
      </aside>
      <section class="question-card">
        <h2>Refinar com IA</h2>
        <p class="lead">Como é a personalidade da criança e o que ela mais ama fazer hoje?</p>
        <textarea class="textarea" data-bind="refinementText" placeholder="Ex: é curiosa, ama dançar, brincar de faz de conta e desenhar...">${escapeHtml(state.refinementText)}</textarea>
        <div class="cta-row">
          <button class="button primary" data-action="generate-refinement" ${state.loading ? "disabled" : ""}>Pensar em temas</button>
          <button class="button secondary" data-action="choose-selected">Usar tema base</button>
          <button class="button ghost" data-action="back-to-suggestions">Voltar</button>
        </div>
        ${state.loading === "refine" ? AgentThinkingLoader() : ""}
        ${state.error ? `<p class="micro">${escapeHtml(state.error)}</p>` : ""}
      </section>
    </div>
    ${state.refinedThemes.length ? `
      <div class="section-title">
        <h2>Opções refinadas</h2>
        <p class="micro">Escolha uma delas para confirmar o tema final.</p>
      </div>
      <div class="cards">
        ${state.refinedThemes.map((theme, index) => RefinedThemeCard(theme, index)).join("")}
      </div>
    ` : ""}
  `, "Refinamento", 100);
}

function AgentThinkingLoader() {
  return `
    <div class="agent-loader" role="status" aria-live="polite">
      <div class="agent-avatar" aria-hidden="true">
        <span class="party-hat"></span>
        <span class="agent-face">
          <span class="agent-eye left"></span>
          <span class="agent-eye right"></span>
          <span class="agent-smile"></span>
        </span>
        <span class="agent-baton"></span>
      </div>
      <div>
        <strong>Agente Festeiro em ação</strong>
        <p>Ele está misturando tema, cores, brincadeiras e lembrancinhas possíveis.</p>
        <span class="thought-dots"><i></i><i></i><i></i></span>
      </div>
    </div>
  `;
}

function RefinedThemeCard(theme, index) {
  return `
    <article class="theme-card">
      <h3>${escapeHtml(theme.name)}</h3>
      <p class="micro">${escapeHtml(theme.concept)}</p>
      <ul class="mini-list">
        <li><strong>Paleta:</strong> ${escapeHtml((theme.palette || []).join(", "))}</li>
        <li><strong>Decoração:</strong> ${escapeHtml(theme.decorIdea)}</li>
        <li><strong>Interação:</strong> ${escapeHtml(theme.guestInteraction)}</li>
        <li><strong>Lembrancinha:</strong> ${escapeHtml(theme.partyFavor)}</li>
      </ul>
      <div class="theme-meta">
        <span class="tag">Custo: ${escapeHtml(theme.costLevel)}</span>
        <span class="tag">Dificuldade: ${escapeHtml(theme.difficultyLevel)}</span>
      </div>
      <button class="button primary full" data-action="choose-refined" data-index="${index}">Escolher este tema</button>
    </article>
  `;
}

function ThemeConfirmationStep() {
  const c = currentConfirmation();
  return StepShell(`
    <div class="section-title">
      <h2>Confirme o tema da festa</h2>
      <p class="lead">Esse será o tema usado para gerar a prévia e o briefing para avaliação.</p>
    </div>
    <section class="panel">
      <div class="form-grid two">
        ${inputField("Tema escolhido", "confirmation.themeName", c.themeName)}
        ${inputField("Nome sugerido da experiência", "confirmation.experienceName", c.experienceName)}
        ${inputField("Idade da criança", "confirmation.age", c.age)}
        ${inputField("Local da festa", "confirmation.place", c.place)}
        ${inputField("Estilo", "confirmation.style", c.style)}
        ${inputField("Orçamento", "confirmation.budget", c.budget)}
      </div>
      <label style="display:grid;gap:6px;margin-top:10px;color:var(--muted);font-size:13px;font-weight:850">
        Observações adicionais
        <textarea class="textarea" data-bind="confirmation.notes">${escapeHtml(c.notes)}</textarea>
      </label>
      <div class="cta-row">
        <button class="button primary" data-action="confirm-theme">Confirmar tema</button>
        <button class="button secondary" data-action="back-to-suggestions">Escolher outro</button>
        <button class="button ghost" data-action="refine-current">Refinar mais</button>
      </div>
    </section>
  `, "Confirmação", 100);
}

function FeatureSelectionStep() {
  const recommended = recommendedModuleIds(currentConfirmation(), state.answers);
  const included = featureModules.filter(module => module.plan === "included");
  const evaluation = featureModules.filter(module => module.plan === "evaluation");
  const selected = selectedModuleDetails();
  return StepShell(`
    <div class="section-title">
      <h2>Escolha as features</h2>
      <p class="lead">Já deixei marcada uma recomendação inicial, normalmente escolhida por outras famílias. Você pode ajustar e adicionar itens Plus.</p>
    </div>
    <section class="panel">
      <div class="module-note">
        <strong>Antes da prévia, escolha o que quer contratar</strong>
        <p>As features recomendadas já entram como ponto de partida. Os itens Plus vão no briefing para o time avaliar viabilidade, prazo e complexidade.</p>
      </div>
      <div class="cta-row compact">
        <button class="button secondary" data-action="select-recommended-modules">Restaurar recomendação inicial</button>
        <span class="micro">${recommended.length} features normalmente escolhidas para este perfil.</span>
      </div>
    </section>
    <div class="module-columns">
      <section>
        <h3>Recomendação inicial</h3>
        <p class="micro">Normalmente escolhido por outras famílias.</p>
        <div class="module-grid">
          ${included.map(module => FeatureModuleCard(module, recommended)).join("")}
        </div>
      </section>
      <section>
        <h3>Itens Plus</h3>
        <p class="micro">Selecione extras para o time avaliar.</p>
        <div class="module-grid">
          ${evaluation.map(module => FeatureModuleCard(module, recommended)).join("")}
        </div>
      </section>
    </div>
    <section class="panel">
      <h2>Resumo das features</h2>
      ${ModuleSummary(selected)}
      <div class="cta-row">
        <button class="button primary" data-action="continue-to-preview" ${state.selectedModules.length ? "" : "disabled"}>Gerar prévia com estas features</button>
        <button class="button secondary" data-action="back-to-confirm">Voltar ao tema</button>
      </div>
    </section>
  `, "Features", 100);
}

function FeatureModuleCard(module, recommended = []) {
  const active = state.selectedModules.includes(module.id);
  const suggested = recommended.includes(module.id);
  return `
    <button class="module-card ${active ? "active" : ""}" data-action="toggle-module" data-module="${module.id}">
      <span class="module-badge ${module.plan}">${module.plan === "included" ? "Recomendado" : "Plus"}</span>
      <strong>${escapeHtml(module.name)}</strong>
      <small>${escapeHtml(module.description)}</small>
      ${suggested ? `<em>Normalmente escolhido</em>` : ""}
    </button>
  `;
}

function ModuleSummary(modules) {
  if (!modules.length) {
    return `<p class="micro">Escolha pelo menos uma feature para a experiência. Você pode começar pela recomendação inicial.</p>`;
  }
  const included = modules.filter(module => module.plan === "included");
  const evaluation = modules.filter(module => module.plan === "evaluation");
  return `
    <div class="module-summary">
      <div>
        <span class="module-badge included">Recomendado</span>
        <p>${included.length ? included.map(module => module.name).join(", ") : "Nenhum selecionado."}</p>
      </div>
      <div>
        <span class="module-badge evaluation">Plus</span>
        <p>${evaluation.length ? evaluation.map(module => module.name).join(", ") : "Nenhum selecionado."}</p>
      </div>
    </div>
  `;
}

function ExperiencePreview() {
  const preview = state.preview || generateExperiencePreview(currentConfirmation(), state.answers, state.aiPersonalization, state.selectedModules);
  const modules = selectedModuleDetails();
  return StepShell(`
    <div class="section-title">
      <h2>Prévia da experiência</h2>
      <p class="lead">Uma visão conceitual com tema, features recomendadas e itens Plus para avaliação.</p>
    </div>
    <section class="preview-hero">
      <h2>${escapeHtml(preview.experienceName)}</h2>
      <p>${escapeHtml(preview.conceptSummary)}</p>
    </section>
    <div class="preview-grid" style="margin-top:12px">
      <section class="panel">
        <h2>Visual</h2>
        <p class="micro">${escapeHtml(preview.visualStyle)}</p>
        <div class="palette">
          ${preview.palette.map(color => `<span class="swatch" style="--swatch:${escapeAttr(color.hex)}">${escapeHtml(color.name)}</span>`).join("")}
        </div>
      </section>
      <section class="panel">
        <h2>Complexidade</h2>
        <p class="lead">${escapeHtml(preview.complexity)}</p>
        <p class="micro">${escapeHtml(preview.viabilityNotes)}</p>
      </section>
      <section class="panel">
        <h2>Features escolhidas</h2>
        ${ModuleSummary(modules)}
      </section>
      <section class="panel">
        <h2>Seções do site</h2>
        <ul class="mini-list">${preview.sections.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="panel">
        <h2>Interações</h2>
        <ul class="mini-list">${preview.interactions.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="panel">
        <h2>Convite digital</h2>
        <p class="micro">${escapeHtml(preview.invitationSuggestion)}</p>
      </section>
      <section class="panel">
        <h2>Atividades</h2>
        <ul class="mini-list">${preview.activities.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
    </div>
    <div class="cta-row">
      <button class="button primary" data-action="generate-briefing">Gerar briefing</button>
      <button class="button secondary" data-action="back-to-features">Voltar às features</button>
    </div>
  `, "Prévia", 100);
}

function DevelopmentBriefingPreview() {
  const briefing = state.briefing || generateDevelopmentBriefing(currentConfirmation(), state.answers, state.aiPersonalization, state.preview, state.selectedModules);
  const disabled = state.briefingEditable ? "" : "disabled";
  return StepShell(`
    <div class="section-title">
      <h2>Briefing para avaliação</h2>
      <p class="lead">Este briefing será enviado para o time avaliar viabilidade, prazo e complexidade. O envio não garante criação automática.</p>
    </div>
    <section class="panel">
      <label class="micro"><strong>Assunto</strong></label>
      <input class="input" data-bind="briefing.subject" value="${escapeAttr(briefing.subject)}">
      <div style="height:10px"></div>
      <textarea class="briefing-box" data-bind="briefing.body" ${disabled}>${escapeHtml(briefing.body)}</textarea>
      <div class="cta-row">
        <button class="button secondary" data-action="copy-briefing">Copiar briefing</button>
        <button class="button secondary" data-action="toggle-edit">${state.briefingEditable ? "Concluir edição" : "Editar briefing"}</button>
        <button class="button ghost" data-action="back-to-preview">Voltar e ajustar tema</button>
      </div>
    </section>
    ${EmailReviewStep()}
  `, "Briefing", 100);
}

function EmailReviewStep() {
  return `
    <section class="panel" style="margin-top:12px">
      <h2>Enviar por e-mail</h2>
      <p class="micro">O time recebe o pedido em contato@claudiocode.dev para avaliar a próxima etapa.</p>
      <div class="form-grid two">
        ${inputField("Nome do responsável", "contact.name", state.contact.name)}
        ${inputField("E-mail para retorno", "contact.email", state.contact.email)}
        ${inputField("WhatsApp", "contact.phone", state.contact.phone)}
        ${inputField("Buffet ou código do buffet", "contact.buffetCode", state.contact.buffetCode)}
      </div>
      <div class="cta-row">
        <button class="button primary" data-action="send-email" ${state.loading === "submit" ? "disabled" : ""}>Enviar por e-mail</button>
        ${state.loading === "submit" ? `<span class="loading">Enviando...</span>` : ""}
      </div>
    </section>
  `;
}

function StepShell(content, label, progress) {
  return `
    <section class="screen">
      <header class="topline">
        <div class="brand"><span class="brand-mark"></span> Agente Festeiro</div>
        <span class="step-pill">${escapeHtml(label)}</span>
      </header>
      <div class="progress" style="--progress:${Math.max(4, progress)}%"><span></span></div>
      ${FlowRoadmap()}
      ${content}
    </section>
  `;
}

function FlowRoadmap() {
  const steps = [
    { key: "quiz", label: "Dados" },
    { key: "theme", label: "Tema" },
    { key: "features", label: "Features" },
    { key: "preview", label: "Prévia" },
    { key: "briefing", label: "Envio" }
  ];
  const activeKey = ["suggestions", "refine", "confirm"].includes(state.screen) ? "theme" : state.screen;
  const activeIndex = Math.max(0, steps.findIndex(step => step.key === activeKey));
  return `
    <nav class="flow-roadmap" aria-label="Etapas do assistente">
      ${steps.map((step, index) => `
        <span class="${index < activeIndex ? "done" : ""} ${index === activeIndex ? "active" : ""}">
          <b>${index + 1}</b>${escapeHtml(step.label)}
        </span>
      `).join("")}
    </nav>
  `;
}

function inputField(label, bind, value) {
  return `
    <label>
      ${escapeHtml(label)}
      <input class="input" data-bind="${escapeAttr(bind)}" value="${escapeAttr(value || "")}">
    </label>
  `;
}

function AnswerStrip() {
  const entries = questions
    .slice(0, state.questionIndex)
    .map(question => [question.prompt, getAnswer(question.id)])
    .filter(([, value]) => Array.isArray(value) ? value.length : value);
  if (!entries.length) return "";
  return `<div class="answer-strip">${entries.map(([, value]) => `<span>${escapeHtml(Array.isArray(value) ? value.join(", ") : value)}</span>`).join("")}</div>`;
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  event.preventDefault();
  const action = target.dataset.action;
  const value = target.dataset.value;
  const index = Number(target.dataset.index);
  const questionId = target.dataset.question;

  if (action === "start") return startPlanner();
  if (action === "reset") return resetFlow();
  if (action === "answer") return answerQuestion(questionId, value);
  if (action === "next-question") return nextQuestion();
  if (action === "back-question") return backQuestion();
  if (action === "back-to-quiz") return setState({ screen: "quiz", questionIndex: Math.max(0, questions.length - 1) });
  if (action === "back-to-suggestions") return setState({ screen: "suggestions", loading: "", error: "" });
  if (action === "choose-theme") return chooseTheme(state.suggestions[index]);
  if (action === "refine-theme") return setState({ screen: "refine", selectedTheme: state.suggestions[index], refinedThemes: [], error: "" });
  if (action === "generate-refinement") return refineWithAI();
  if (action === "choose-selected") return chooseTheme(state.selectedTheme);
  if (action === "choose-refined") return chooseTheme(state.refinedThemes[index], state.refinedThemes[index]);
  if (action === "refine-current") return setState({ screen: "refine", selectedTheme: state.selectedTheme || currentConfirmation(), refinedThemes: [], error: "" });
  if (action === "confirm-theme") return confirmTheme();
  if (action === "back-to-confirm") return setState({ screen: "confirm" });
  if (action === "toggle-module") return toggleModule(target.dataset.module);
  if (action === "select-recommended-modules") return selectRecommendedModules();
  if (action === "continue-to-preview") return continueToPreview();
  if (action === "back-to-features") return setState({ screen: "features" });
  if (action === "generate-briefing") return generateBriefingStep();
  if (action === "back-to-preview") return setState({ screen: "preview" });
  if (action === "copy-briefing") return copyBriefing();
  if (action === "toggle-edit") return setState({ briefingEditable: !state.briefingEditable });
  if (action === "send-email") return sendEmail();
}

function handleInput(event) {
  const bind = event.target.dataset.bind;
  if (!bind) return;
  setDeepValue(state, bind, event.target.value);
  saveState();
  if (bind.startsWith("confirmation.")) {
    state.preview = null;
    state.briefing = null;
  }
}

function answerQuestion(questionId, value) {
  const question = questions.find(item => item.id === questionId);
  if (!question) return;
  if (question.type === "multi") {
    const current = getAnswer(questionId);
    let next = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
    if (value === "Não tenho restrições") next = current.includes(value) ? [] : [value];
    if (questionId === "avoid" && value !== "Não tenho restrições") next = next.filter(item => item !== "Não tenho restrições");
    state.answers = { ...state.answers, [questionId]: next };
    return setState({ answers: state.answers });
  }
  state.answers = { ...state.answers, [questionId]: value };
  saveState();
  nextQuestion();
}

function nextQuestion() {
  if (state.questionIndex < questions.length - 1) {
    return setState({ questionIndex: state.questionIndex + 1 });
  }
  const suggestions = generateThemeRecommendations(state.answers);
  return setState({ screen: "suggestions", suggestions });
}

function backQuestion() {
  if (state.questionIndex === 0) return;
  setState({ questionIndex: state.questionIndex - 1 });
}

function chooseTheme(theme, personalization = null) {
  const selected = normalizeTheme(theme);
  const confirmation = buildConfirmation(selected, personalization);
  setState({
    screen: "confirm",
    selectedTheme: selected,
    aiPersonalization: personalization || state.aiPersonalization,
    confirmation,
    preview: null,
    briefing: null
  });
}

async function refineWithAI() {
  if (!state.refinementText.trim()) {
    showToast("Conte uma frase sobre a criança para a IA refinar.");
    return;
  }
  setState({ loading: "refine", error: "" });
  try {
    const response = await api("/refine", {
      baseTheme: state.selectedTheme,
      userDescription: state.refinementText,
      quizAnswers: state.answers
    }, { timeoutMs: 7000 });
    setState({ loading: "", refinedThemes: response.themes || [] });
  } catch (error) {
    const refinedThemes = generatePersonalizedThemes(state.selectedTheme, state.refinementText, state.answers);
    setState({
      loading: "",
      refinedThemes,
      error: "Mostrei uma versão rápida porque a IA demorou. Dá para seguir normalmente."
    });
  }
}

function confirmTheme() {
  const confirmation = currentConfirmation();
  const selectedModules = state.selectedModules.length ? state.selectedModules : recommendedModuleIds(confirmation, state.answers);
  setState({ screen: "features", confirmation, selectedModules, preview: null, briefing: null });
}

function toggleModule(moduleId) {
  if (!featureModules.some(module => module.id === moduleId)) return;
  const selectedModules = state.selectedModules.includes(moduleId)
    ? state.selectedModules.filter(id => id !== moduleId)
    : [...state.selectedModules, moduleId];
  setState({ selectedModules, preview: null, briefing: null });
}

function selectRecommendedModules() {
  setState({
    selectedModules: recommendedModuleIds(currentConfirmation(), state.answers),
    preview: null,
    briefing: null
  });
}

function continueToPreview() {
  const preview = generateExperiencePreview(currentConfirmation(), state.answers, state.aiPersonalization, state.selectedModules);
  setState({ screen: "preview", preview, briefing: null });
}

function generateBriefingStep() {
  const briefing = generateDevelopmentBriefing(currentConfirmation(), state.answers, state.aiPersonalization, state.preview, state.selectedModules);
  setState({ screen: "briefing", briefing, briefingEditable: false });
}

async function copyBriefing() {
  const briefing = state.briefing || generateDevelopmentBriefing(currentConfirmation(), state.answers, state.aiPersonalization, state.preview, state.selectedModules);
  const text = `${briefing.subject}\n\n${briefing.body}`;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Briefing copiado.");
  } catch {
    showToast("Não consegui copiar automaticamente. O texto está pronto para seleção manual.");
  }
}

async function sendEmail() {
  const briefing = state.briefing || generateDevelopmentBriefing(currentConfirmation(), state.answers, state.aiPersonalization, state.preview, state.selectedModules);
  if (!state.contact.name || !state.contact.email) {
    showToast("Preencha nome e e-mail para retorno.");
    return;
  }
  setState({ loading: "submit" });
  try {
    const response = await api("/submit", {
      kind: "quote",
      buffetCode: state.contact.buffetCode,
      contact: state.contact,
      brief: currentConfirmation(),
      preview: state.preview,
      quizAnswers: state.answers,
      featureModules: selectedModuleDetails(),
      developmentBriefing: briefing
    });
    setState({ loading: "" });
    showToast(`Briefing enviado. ID ${response.id}.`);
  } catch (error) {
    setState({ loading: "" });
    showToast(error.message || "Não foi possível enviar agora.");
  }
}

async function api(path, body, options = {}) {
  const controller = options.timeoutMs ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), options.timeoutMs) : null;
  let response;
  try {
    response = await fetch(API + path, {
    method: "POST",
    headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller?.signal
    });
  } catch (error) {
    if (error.name === "AbortError") throw new Error("O Agente Festeiro demorou demais para pensar.");
    throw error;
  } finally {
    if (timer) clearTimeout(timer);
  }
  const payload = await response.json().catch(() => ({ ok: false, error: "Erro inesperado." }));
  if (!response.ok || payload.ok === false) throw new Error(payload.error || "Erro inesperado.");
  return payload;
}

function generateThemeRecommendations(answers) {
  const interests = answers.interests || [];
  const avoid = answers.avoid || [];
  const budget = answers.budget || "Ainda não sei";
  const place = answers.place || "Ainda não sei";
  const style = answers.style || "Fofo";
  const simplePlace = ["Casa", "Condomínio", "Escola"].includes(place);
  const lowBudget = budget === "Baixo" || avoid.includes("Tema muito caro") || simplePlace;
  const noLicense = avoid.includes("Personagem licenciado");

  const pool = [
    ["Animais", { name: "Safari de Abraços", whyFits: "Funciona bem para crianças pequenas, rende fotos lindas e é fácil de montar com bichinhos, folhagens e tons quentes.", cost: "Médio", difficulty: "Baixa" }],
    ["Futebol", { name: "Campeõezinhos em Campo", whyFits: "É divertido, participativo e permite brincadeiras simples sem depender de estrutura cara.", cost: lowBudget ? "Baixo" : "Médio", difficulty: "Baixa" }],
    ["Música", { name: "Mini Festival", whyFits: "Combina com festa animada, playlists afetivas e atividades de dança para convidados.", cost: "Médio", difficulty: "Média" }],
    ["Princesas", { name: "Jardim Encantado", whyFits: "Entrega encanto sem depender de personagem licenciado e fica delicado em casa, salão ou buffet.", cost: lowBudget ? "Baixo" : "Médio", difficulty: "Baixa" }],
    ["Heróis", { name: "Heróis do Dia a Dia", whyFits: "Traz aventura sem precisar usar marcas oficiais, com missões e brincadeiras para as crianças.", cost: "Médio", difficulty: "Média" }],
    ["Dinossauros", { name: "Expedição Dino", whyFits: "É lúdico, visualmente forte e funciona muito bem com quiz, caça aos ovos e mini missões.", cost: "Médio", difficulty: "Baixa" }],
    ["Carros", { name: "Corrida Divertida", whyFits: "Boa para crianças cheias de energia, com pista simbólica, boxes e brincadeiras de movimento.", cost: "Médio", difficulty: "Média" }],
    ["Games", { name: "Level Up da Alegria", whyFits: "Transforma a festa em fases, desafios e ranking, sem precisar usar personagens específicos.", cost: "Médio", difficulty: "Média" }],
    ["Natureza", { name: "Piquenique no Jardim", whyFits: "É acolhedor, bonito, econômico e ótimo para casa, condomínio ou festa ao ar livre.", cost: "Baixo", difficulty: "Baixa" }],
    ["Faz de conta", { name: "Mundo do Faz de Conta", whyFits: "Abre espaço para fantasia, teatrinho, histórias e uma experiência digital bem afetiva.", cost: "Médio", difficulty: "Média" }],
    ["Dança", { name: "Baile dos Pequenos", whyFits: "Cria uma energia alegre, com playlist, mural de recados e desafios leves para os convidados.", cost: "Baixo", difficulty: "Baixa" }],
    ["Desenhos", { name: noLicense ? "Desenho Favorito, Sem Marca Oficial" : "Universo do Desenho Favorito", whyFits: "Permite aproveitar cores, humor e elementos que a criança ama, cuidando da parte de licenciamento.", cost: lowBudget ? "Médio" : "Alto", difficulty: "Média" }],
    ["Comidinhas", { name: "Mini Chef", whyFits: "Fica fofo, interativo e muito possível no Brasil, com avental, receitinhas e lembrancinhas simples.", cost: "Médio", difficulty: "Média" }],
    ["Brincadeiras", { name: "Parque de Brincar", whyFits: "Prioriza interação, missões e atividades simples. Ótimo quando o tema ainda está aberto.", cost: "Baixo", difficulty: "Baixa" }]
  ];

  const selected = pool
    .filter(([interest]) => interests.includes(interest))
    .map(([, theme]) => ({ ...theme }));

  const defaults = [
    { name: "Piquenique no Jardim", whyFits: "É fácil de adaptar, acolhedor e funciona em quase qualquer local.", cost: "Baixo", difficulty: "Baixa" },
    { name: "Jardim Encantado", whyFits: "Tem visual delicado, muitas possibilidades de cores e boa execução no Brasil.", cost: "Médio", difficulty: "Baixa" },
    { name: "Parque de Brincar", whyFits: "Ajuda quando a prioridade é divertir as crianças sem complicar a decoração.", cost: "Baixo", difficulty: "Baixa" },
    { name: "Mini Festival", whyFits: "Boa escolha para festa média ou grande, com música, fotos e interação.", cost: "Médio", difficulty: "Média" }
  ];

  const themes = uniqueByName([...selected, ...defaults]).slice(0, 5);
  return themes.map(theme => ({
    ...theme,
    whyFits: adaptReason(theme.whyFits, answers, style),
    cost: budget === "Alto" && theme.cost !== "Baixo" ? theme.cost : theme.cost,
    difficulty: simplePlace && theme.difficulty === "Média" ? "Média com versão simples" : theme.difficulty
  }));
}

function generatePersonalizedThemes(baseTheme, userDescription, quizAnswers) {
  const base = normalizeTheme(baseTheme);
  const age = quizAnswers.age || "idade informada";
  const place = quizAnswers.place || "local a definir";
  const easy = ["Casa", "Condomínio", "Escola"].includes(place);
  return [
    {
      name: `${base.name} Afetivo`,
      concept: `Uma festa ${base.name.toLowerCase()} com detalhes sobre a personalidade da criança: ${userDescription}.`,
      palette: ["rosa claro", "creme", "verde suave"],
      decorIdea: easy ? "Mesa compacta, painel simples, objetos afetivos e cantinho de fotos." : "Painel principal, mesa temática e cantinhos de interação pelo salão.",
      guestInteraction: "Mural de recados, quiz sobre a criança e missão leve para tirar fotos.",
      partyFavor: "Tag personalizada com uma lembrancinha útil e barata.",
      costLevel: quizAnswers.budget || "Médio",
      difficultyLevel: easy ? "Baixa" : "Média",
      viabilityNote: `Adequado para ${age} e ${place}.`
    },
    {
      name: `${base.name} Brincante`,
      concept: "A decoração vira uma brincadeira guiada, com pequenos desafios para crianças e adultos.",
      palette: ["pink suave", "amarelo manteiga", "azul claro"],
      decorIdea: "Estações simples: fotos, recados, desafios e mesa do bolo.",
      guestInteraction: "Missões da festa e ranking leve no site.",
      partyFavor: "Cartão de missão com adesivos.",
      costLevel: quizAnswers.budget === "Baixo" ? "Baixo" : "Médio",
      difficultyLevel: "Média",
      viabilityNote: "Boa para gerar conteúdo no dia da festa."
    },
    {
      name: `${base.name} Doce e Clean`,
      concept: "Uma versão mais limpa, delicada e fácil de executar, priorizando fotos bonitas e conforto dos pais.",
      palette: ["branco", "rosa chá", "dourado suave"],
      decorIdea: "Poucos elementos bem escolhidos, flores, balões pontuais e identidade visual forte.",
      guestInteraction: "Cápsula do tempo e álbum pós-festa.",
      partyFavor: "Mini envelope com mensagem da família.",
      costLevel: quizAnswers.budget || "Médio",
      difficultyLevel: "Baixa",
      viabilityNote: "Boa para famílias que querem beleza sem excesso."
    }
  ];
}

function generateExperiencePreview(confirmedTheme, quizAnswers, aiPersonalization, selectedModules = []) {
  const themeName = confirmedTheme.themeName || confirmedTheme.name || "Tema da festa";
  const experienceName = confirmedTheme.experienceName || `A festa ${themeName}`;
  const place = confirmedTheme.place || quizAnswers.place || "local a definir";
  const budget = confirmedTheme.budget || quizAnswers.budget || "Ainda não sei";
  const refined = aiPersonalization || {};
  const simple = ["Casa", "Condomínio", "Escola"].includes(place);
  const modules = selectedModuleDetails(selectedModules.length ? selectedModules : recommendedModuleIds(confirmedTheme, quizAnswers));
  const sections = uniqueList([
    "Página inicial com contagem regressiva",
    ...modules.map(module => module.section),
    "Localização",
    "Agradecimento pós-festa"
  ]);
  const interactions = uniqueList([
    refined.guestInteraction || "Interação leve para convidados no dia da festa",
    ...modules.map(module => module.interaction)
  ]);
  const evaluationCount = modules.filter(module => module.plan === "evaluation").length;

  return {
    experienceName,
    conceptSummary: refined.concept || `Uma experiência digital clean para transformar o tema ${themeName} em convite, interação no dia e memória pós-festa.`,
    palette: paletteForTheme(themeName, refined.palette),
    visualStyle: refined.decorIdea || `Visual acolhedor, moderno e fácil de adaptar ao tema ${themeName}.`,
    sections,
    interactions,
    activities: [
      modules.some(module => module.id === "quiz") ? "Perguntas divertidas sobre a criança" : "Atividade leve alinhada ao tema",
      modules.some(module => module.id === "gallery") ? "Pedido de fotos afetivas dos convidados" : "Momento de registro para a família",
      modules.some(module => module.id === "missions") ? "Missões da festa para gerar memórias" : "Interação simples sem depender de estrutura extra"
    ],
    invitationSuggestion: `Convite digital com o nome da experiência, data, horário, local, RSVP e um texto curto no clima de ${themeName}.`,
    complexity: evaluationCount ? "Média, com itens para avaliação" : (budget === "Baixo" || simple ? "Baixa a média" : "Média"),
    viabilityNotes: simple
      ? "Priorizar componentes simples, pouco peso visual e interações que funcionem bem no celular. Itens Plus seguem para avaliação."
      : "Validar volume de convidados, itens Plus, moderação de fotos e prazo de produção."
  };
}

function generateDevelopmentBriefing(confirmedTheme, quizAnswers, aiPersonalization, experiencePreview, selectedModules = []) {
  const modules = selectedModuleDetails(selectedModules.length ? selectedModules : recommendedModuleIds(confirmedTheme, quizAnswers));
  const includedModules = modules.filter(module => module.plan === "included");
  const evaluationModules = modules.filter(module => module.plan === "evaluation");
  const preview = experiencePreview || generateExperiencePreview(confirmedTheme, quizAnswers, aiPersonalization, selectedModules);
  const subject = `Solicitação de avaliação - experiência de festa: ${confirmedTheme.themeName}`;
  const body = [
    `Tema escolhido: ${confirmedTheme.themeName}`,
    `Nome da experiência: ${confirmedTheme.experienceName}`,
    `Idade da criança: ${confirmedTheme.age}`,
    `Local da festa: ${confirmedTheme.place}`,
    `Tamanho estimado: ${quizAnswers.size || "Ainda não sei"}`,
    `Estilo desejado: ${confirmedTheme.style}`,
    `Orçamento estimado: ${confirmedTheme.budget}`,
    "",
    "Resumo do conceito:",
    preview.conceptSummary,
    "",
    "Features recomendadas no plano contratado:",
    ...(includedModules.length ? includedModules.map(module => `- ${module.name}: ${module.description}`) : ["- Nenhum selecionado."]),
    "",
    "Itens Plus para avaliação do time:",
    ...(evaluationModules.length ? evaluationModules.map(module => `- ${module.name}: ${module.description}`) : ["- Nenhum item Plus selecionado."]),
    "",
    "Ideias de interação:",
    ...preview.interactions.map(item => `- ${item}`),
    "",
    "Seções sugeridas do site:",
    ...preview.sections.map(item => `- ${item}`),
    "",
    "Pontos obrigatórios:",
    "- Experiência mobile-first",
    "- Linguagem acolhedora e prática",
    "- Não prometer criação automática",
    "- Fotos e mensagens precisam de aprovação dos pais",
    "",
    "Transparência comercial:",
    "- O responsável selecionou as features acima no assistente.",
    "- Features recomendadas podem seguir como parte do plano contratado.",
    "- Itens Plus precisam de confirmação de viabilidade, prazo e complexidade.",
    "",
    "Pontos de atenção para viabilidade:",
    preview.viabilityNotes,
    confirmedTheme.notes ? `Observações da família: ${confirmedTheme.notes}` : "Observações da família: nenhuma por enquanto.",
    "",
    "Dúvidas para o time de desenvolvimento:",
    "- O prazo permite criar uma prévia visual?",
    "- Qual nível de personalização cabe no orçamento?",
    "- Alguma funcionalidade precisa ser simplificada?",
    "",
    "Pedido:",
    "Avaliar viabilidade, prazo e complexidade para criar a prévia ou experiência personalizada."
  ].join("\n");
  return { subject, body };
}

function selectedModuleDetails(ids = state.selectedModules) {
  const wanted = new Set(ids);
  return featureModules.filter(module => wanted.has(module.id));
}

function recommendedModuleIds(confirmation = currentConfirmation(), answers = state.answers) {
  const ids = ["invite", "rsvp", "gallery", "messages", "capsule", "album"];
  const interests = answers.interests || [];
  const place = confirmation.place || answers.place || "";
  const budget = confirmation.budget || answers.budget || "";

  if (interests.some(item => ["Música", "Dança", "Games", "Brincadeiras", "Futebol"].includes(item))) ids.push("quiz");
  if (!["Casa", "Condomínio", "Escola"].includes(place) && budget !== "Baixo") ids.push("screen");
  if (interests.some(item => ["Brincadeiras", "Games", "Faz de conta"].includes(item)) && budget !== "Baixo") ids.push("missions");
  if (place === "Buffet") ids.push("menu");
  if (budget === "Alto") ids.push("story");
  return uniqueList(ids);
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
}

function buildConfirmation(theme, personalization) {
  const refined = personalization || {};
  const themeName = refined.name || theme.name || "Tema da festa";
  return {
    themeName,
    experienceName: refined.name ? `Experiência ${refined.name}` : `Experiência ${themeName}`,
    age: state.answers.age || "",
    place: state.answers.place || "",
    style: state.answers.style || "",
    budget: state.answers.budget || "",
    notes: refined.viabilityNote || ""
  };
}

function currentConfirmation() {
  const base = buildConfirmation(state.selectedTheme || {}, state.aiPersonalization);
  return { ...base, ...state.confirmation };
}

function getAnswer(id) {
  const question = questions.find(item => item.id === id);
  if (question?.type === "multi") return Array.isArray(state.answers[id]) ? state.answers[id] : [];
  return state.answers[id] || "";
}

function normalizeTheme(theme) {
  return {
    name: theme?.name || theme?.themeName || "Tema da festa",
    whyFits: theme?.whyFits || theme?.concept || "",
    cost: theme?.cost || theme?.costLevel || "Médio",
    difficulty: theme?.difficulty || theme?.difficultyLevel || "Média"
  };
}

function adaptReason(reason, answers, style) {
  const place = answers.place && answers.place !== "Ainda não sei" ? ` em ${answers.place.toLowerCase()}` : "";
  return `${reason} O estilo ${style.toLowerCase()} pode funcionar bem${place}.`;
}

function uniqueByName(items) {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

function paletteForTheme(themeName, names = []) {
  const base = [
    { name: "Rosa claro", hex: "#ffd7e9" },
    { name: "Creme", hex: "#fff4d8" },
    { name: "Verde suave", hex: "#dff4e8" }
  ];
  if (!Array.isArray(names) || !names.length) return base;
  const hexes = ["#ffd7e9", "#fff4d8", "#dff4e8", "#dce8ff", "#f3e6ff"];
  return names.slice(0, 5).map((name, index) => ({ name, hex: hexes[index] || "#fff" }));
}

function setDeepValue(target, path, value) {
  const parts = path.split(".");
  let ref = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    ref[parts[i]] = ref[parts[i]] || {};
    ref = ref[parts[i]];
  }
  ref[parts[parts.length - 1]] = value;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 5200);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
