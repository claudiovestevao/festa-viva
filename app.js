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
    options: ["Até 30 pessoas", "31 a 50 pessoas", "51 a 80 pessoas", "Mais de 80 pessoas", "Ainda não sei"]
  },
  {
    id: "eventDate",
    prompt: "Qual é a data da festa?",
    type: "date",
    placeholder: "Escolha a data do evento"
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
  { id: "invite", name: "Convite digital", tier: "standard", description: "Convite com tema da festa, data, horário, local e botão de confirmação.", section: "Convite digital", interaction: "Confirmação de presença direto pelo convite" },
  { id: "rsvp", name: "Convidados + RSVP", tier: "standard", description: "Organize adultos e crianças, acompanhe confirmações e evite surpresas no dia.", section: "Convidados e confirmação de presença", interaction: "Contagem por família para os pais" },
  { id: "story", name: "História da criança", tier: "standard", description: "Uma página especial contando a personalidade, os gostos e os momentos marcantes da criança.", section: "História da criança", interaction: "Conteúdo afetivo para família e convidados" },
  { id: "gallery", name: "Fotos com aprovação", tier: "standard", description: "Os pais escolhem quais fotos entram na retrospectiva ou página da festa.", section: "Fotos com aprovação", interaction: "Envio de fotos com aprovação dos pais" },
  { id: "messages", name: "Mural de recados", tier: "recommended", description: "Mensagens carinhosas dos convidados para guardar como lembrança.", section: "Mural de recados", interaction: "Recados afetivos para a família" },
  { id: "quiz", name: "Quiz da criança", tier: "recommended", description: "Perguntas rápidas e divertidas para os convidados brincarem durante a festa.", section: "Quiz da criança", interaction: "Brincadeira rápida para convidados" },
  { id: "missions", name: "Missões da festa", tier: "recommended", description: "Desafios simples para aproximar convidados e criar fotos e memórias.", section: "Missões da festa", interaction: "Missões leves para criar memórias" },
  { id: "menu", name: "Cardápio", tier: "recommended", description: "Cardápio infantil, buffet ou opções da festa em uma página fácil de consultar.", section: "Cardápio", interaction: "Consulta rápida do cardápio" },
  { id: "album", name: "Álbum de memórias", tier: "recommended", description: "Uma página para reunir os melhores registros depois da comemoração.", section: "Álbum de memórias", interaction: "Agradecimento e melhores registros pós-festa" },
  { id: "giftGuide", name: "Ideias de presentes", tier: "recommended", description: "Sugestões por idade, tamanho, preferências e fase da criança.", section: "Ideias de presentes", interaction: "Convidados consultam sugestões antes de comprar presente" },
  { id: "capsule", name: "Cápsula do tempo", tier: "recommended", description: "Mensagens para a criança ler no futuro.", section: "Cápsula do tempo", interaction: "Mensagem afetiva para o futuro" },
  { id: "screen", name: "Modo telão", tier: "sophisticated", description: "Fotos, mensagens, quiz e ranking para exibir durante a festa.", section: "Modo telão", interaction: "Telão com fotos, mensagens e quiz" },
  { id: "retrospective", name: "Retrospectiva personalizada", tier: "sophisticated", description: "Uma retrospectiva afetiva com fotos, frases e momentos importantes da criança.", section: "Retrospectiva personalizada", interaction: "Retrospectiva afetiva para a família" },
  { id: "partyFlow", name: "Roteiro da festa", tier: "sophisticated", description: "Sugestão de ordem dos momentos: chegada, parabéns, brincadeiras, fotos e encerramento.", section: "Roteiro da festa", interaction: "Roteiro simples para orientar a comemoração" },
  { id: "decorAI", name: "Sugestão de decoração por IA", tier: "sophisticated", description: "Ideias de cores, mesa, lembrancinhas e detalhes alinhados ao tema escolhido.", section: "Sugestão de decoração por IA", interaction: "Inspirações práticas para decoração" },
  { id: "partyFavors", name: "Lembrancinhas personalizadas", tier: "sophisticated", description: "Ideias de lembrancinhas criativas, úteis e alinhadas ao tema da festa.", section: "Lembrancinhas personalizadas", interaction: "Sugestões de lembrancinhas para convidados" },
  { id: "messaging", name: "Lembretes para convidados", tier: "sophisticated", description: "Envio de lembretes e informações importantes por canais oficiais.", section: "Lembretes para convidados", interaction: "Lembretes por canais oficiais" },
  { id: "customGame", name: "Jogo personalizado", tier: "sophisticated", description: "Uma brincadeira digital simples criada com base no tema da festa.", section: "Jogo personalizado", interaction: "Mini jogo temático" },
  { id: "timeline", name: "Linha do tempo da criança", tier: "sophisticated", description: "Momentos marcantes da criança organizados de forma visual e afetiva.", section: "Linha do tempo da criança", interaction: "Linha do tempo afetiva" }
];

const initialState = {
  screen: "home",
  questionIndex: 0,
  answers: {},
  suggestions: [],
  selectedTheme: null,
  refinementAnswers: {},
  refinedThemes: [],
  aiPersonalization: null,
  confirmation: {},
  preview: null,
  briefing: null,
  briefingEditable: false,
  selectedModules: [],
  giftGuide: { clothingSize: "", shoeSize: "", likes: "", avoids: "", notes: "" },
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
        <h1>Planeje a festa digital sem dor de cabeça</h1>
        <p class="lead">O assistente ajuda a escolher tema, montar convite, organizar convidados, fotos, recados e memórias para o grande dia.</p>
        <div class="home-options">
          <button class="route-card planner featured" data-action="start">
            <span class="route-eyebrow">Assistente</span>
            <strong>Planejar minha festa</strong>
            <small>Responda perguntas rápidas, receba uma recomendação de tema e gere um briefing para avaliação.</small>
          </button>
          <div class="demo-area">
            <p class="micro"><strong>Demos de sites personalizados</strong></p>
            <div class="demo-grid">
              <a class="route-card luiza" href="/festa-luiza/">
                <span class="route-eyebrow">Demo</span>
                <strong>Festa da Luiza</strong>
                <small>Convite, segurança, galeria e memórias da festa.</small>
              </a>
              <a class="route-card luma" href="/festa-luma/">
                <span class="route-eyebrow">Demo</span>
                <strong>Festa da Luma</strong>
                <small>Tema Minnie com RSVP, quiz, mural e cápsula.</small>
              </a>
              <a class="route-card leonidas" href="/festa-leonidas/">
                <span class="route-eyebrow">Demo nova</span>
                <strong>Festa do Leonidas</strong>
                <small>Futebol, 5 anos e uma festa inspirada no tricolor.</small>
              </a>
            </div>
          </div>
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
  if (question.type === "date") {
    return `
      <section class="question-card">
        <h2>${escapeHtml(question.prompt)}</h2>
        <p class="micro">Se ainda não souber, pode seguir sem preencher e ajustar depois.</p>
        <input class="input date-input" type="date" data-bind="answers.${question.id}" value="${escapeAttr(getAnswer(question.id))}" aria-label="${escapeAttr(question.placeholder || question.prompt)}">
        <div class="cta-row">
          <button class="button primary" data-action="next-question">Continuar</button>
          <button class="button ghost" data-action="back-question">Voltar</button>
        </div>
      </section>
    `;
  }
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
  const refinement = state.refinementAnswers || {};
  const canAskAi = refinement.energy && refinement.priority;
  return StepShell(`
    <div class="assistant-layout">
      <aside class="assistant-card">
        <p><strong>Base escolhida:</strong> ${escapeHtml(theme.name || "Tema")}</p>
        <p class="micro">Responda rapidinho para a IA entender o clima da festa antes de recomendar um caminho final.</p>
      </aside>
      <section class="question-card">
        <h2>Refinar com IA</h2>
        <p class="lead">Como você imagina a dinâmica da festa?</p>
        <div class="chips compact">
          ${["Mais brincadeiras", "Mais fotos e memórias", "Mais quiz e desafios", "Mais encanto visual"].map(option => RefinementChoice("energy", option, refinement.energy)).join("")}
        </div>
        <p class="lead small">O que não pode faltar?</p>
        <div class="chips compact">
          ${["Futebol", "Música", "Dança", "Fotos", "Lembrancinha", "Telão", "Comidinhas"].map(option => RefinementChoice("priority", option, refinement.priority)).join("")}
        </div>
        <p class="lead small">Algum detalhe importante?</p>
        <textarea class="textarea compact-area" data-bind="refinementAnswers.detail" placeholder="Ex: ele é tímido, ama jogar bola com os primos e gosta do São Paulo...">${escapeHtml(refinement.detail || "")}</textarea>
        <p class="lead small">Jeitinho ou história que vale aparecer no site?</p>
        <textarea class="textarea compact-area" data-bind="refinementAnswers.personalityStory" placeholder="Opcional. Ex: ela inventa coreografias, ele chama todo chute de golaço, tem uma frase engraçada...">${escapeHtml(refinement.personalityStory || "")}</textarea>
        <p class="lead small">Alguma pista de presente?</p>
        <textarea class="textarea compact-area" data-bind="refinementAnswers.giftHints" placeholder="Opcional. Ex: tamanho 4, calçado 27, ama massinha e carrinhos, evitar pelúcia...">${escapeHtml(refinement.giftHints || "")}</textarea>
        <div class="cta-row">
          <button class="button primary" data-action="generate-refinement" ${state.loading || !canAskAi ? "disabled" : ""}>Ver recomendação da IA</button>
          <button class="button secondary" data-action="choose-selected">Usar tema base</button>
          <button class="button ghost" data-action="back-to-suggestions">Voltar</button>
        </div>
        ${state.loading === "refine" ? AgentThinkingLoader() : ""}
        ${state.error ? `<p class="micro">${escapeHtml(state.error)}</p>` : ""}
      </section>
    </div>
    ${state.refinedThemes.length ? `
      <div class="section-title">
        <h2>Recomendação final da IA</h2>
        <p class="micro">Uma direção única para seguir com clareza.</p>
      </div>
      <div class="cards">
        ${state.refinedThemes.map((theme, index) => RefinedThemeCard(theme, index)).join("")}
      </div>
    ` : ""}
  `, "Refinamento", 100);
}

function RefinementChoice(field, option, current) {
  return `<button class="chip ${current === option ? "active" : ""}" data-action="refinement-choice" data-field="${field}" data-value="${escapeAttr(option)}">${escapeHtml(option)}</button>`;
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
      <button class="button primary full" data-action="choose-refined" data-index="${index}">Usar esta recomendação</button>
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
        ${inputField("Data da festa", "confirmation.eventDate", c.eventDate)}
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
  const standard = featureModules.filter(module => module.tier === "standard");
  const recommendedItems = featureModules.filter(module => module.tier === "recommended");
  const sophisticated = featureModules.filter(module => module.tier === "sophisticated");
  return StepShell(`
    <div class="section-title">
      <h2>Monte a experiência da festa</h2>
      <p class="lead">Escolha o que faz sentido para a festa da sua família. Alguns itens já vêm incluídos para facilitar o planejamento, e outros podem deixar a comemoração mais divertida, memorável ou especial.</p>
    </div>
    <div class="module-columns three">
      <section class="module-section">
        <h3>Essencial</h3>
        <p class="micro">Já vem incluído para sua festa começar organizada.</p>
        <div class="module-grid">
          ${standard.map(module => FeatureModuleCard(module)).join("")}
        </div>
      </section>
      <section class="module-section">
        <h3>Mais escolhido</h3>
        <p class="micro">Itens que costumam deixar a festa mais divertida e completa.</p>
        <div class="module-grid">
          ${recommendedItems.map(module => FeatureModuleCard(module)).join("")}
        </div>
      </section>
      <section class="module-section">
        <h3>Experiências especiais</h3>
        <p class="micro">Ideias para transformar a festa em uma lembrança ainda mais marcante.</p>
        <div class="module-grid">
          ${sophisticated.map(module => FeatureModuleCard(module)).join("")}
        </div>
      </section>
    </div>
    ${state.selectedModules.includes("giftGuide") ? GiftGuidePanel() : ""}
    <p class="micro final-note">Você poderá ajustar tudo na próxima etapa antes de enviar para criação da festa personalizada.</p>
    <div class="cta-row">
      <button class="button primary" data-action="continue-to-preview" ${state.selectedModules.length ? "" : "disabled"}>Gerar prévia</button>
      <button class="button secondary" data-action="back-to-confirm">Voltar ao tema</button>
    </div>
  `, "Experiência", 100);
}

function GiftGuidePanel() {
  const guide = state.giftGuide || {};
  return `
    <section class="panel gift-panel">
      <div class="module-note">
        <strong>Ideias de presentes para convidados</strong>
        <p>Preencha só o que já souber. Isso pode virar uma área simples no site para evitar presente repetido, tamanho errado ou brinquedo que não combina.</p>
      </div>
      <div class="form-grid two gift-fields">
        ${inputField("Tamanho de roupa", "giftGuide.clothingSize", guide.clothingSize)}
        ${inputField("Número do calçado", "giftGuide.shoeSize", guide.shoeSize)}
      </div>
      <div class="form-grid two gift-fields">
        ${textareaField("Brinquedos, temas ou presentes que a criança pode gostar", "giftGuide.likes", guide.likes, "Ex: futebol, blocos de montar, livros com animais, massinha...")}
        ${textareaField("O que prefere evitar", "giftGuide.avoids", guide.avoids, "Ex: brinquedo com peças pequenas, eletrônico barulhento, pelúcia...")}
      </div>
      ${textareaField("Observação para os convidados", "giftGuide.notes", guide.notes, "Ex: presente é opcional; o mais importante é vir brincar com a gente.")}
    </section>
  `;
}

function FeatureModuleCard(module) {
  const active = state.selectedModules.includes(module.id);
  const locked = module.tier === "standard";
  const label = module.tier === "standard" ? "Incluído" : module.tier === "recommended" ? "Mais escolhido" : "Experiência especial";
  return `
    <button class="module-card ${active ? "active" : ""} ${locked ? "locked" : ""}" data-action="toggle-module" data-module="${module.id}" aria-pressed="${active ? "true" : "false"}">
      <span class="module-badge ${module.tier}">${label}</span>
      <strong>${escapeHtml(module.name)}</strong>
      <small>${escapeHtml(module.description)}</small>
    </button>
  `;
}

function ModuleSummary(modules) {
  if (!modules.length) {
    return `<p class="micro">Escolha pelo menos um item para montar a experiência da festa.</p>`;
  }
  const standard = modules.filter(module => module.tier === "standard");
  const recommended = modules.filter(module => module.tier === "recommended");
  const sophisticated = modules.filter(module => module.tier === "sophisticated");
  return `
    <div class="module-summary">
      <div>
        <span class="module-badge standard">Incluído</span>
        <p>${standard.length ? standard.map(module => module.name).join(", ") : "Nenhum selecionado."}</p>
      </div>
      <div>
        <span class="module-badge recommended">Mais escolhido</span>
        <p>${recommended.length ? recommended.map(module => module.name).join(", ") : "Nenhum selecionado."}</p>
      </div>
      <div>
        <span class="module-badge sophisticated">Experiência especial</span>
        <p>${sophisticated.length ? sophisticated.map(module => module.name).join(", ") : "Nenhum selecionado."}</p>
      </div>
    </div>
  `;
}

function ExperiencePreview() {
  const preview = normalizePreview(state.preview || generateExperiencePreview(currentConfirmation(), state.answers, state.aiPersonalization, state.selectedModules));
  return StepShell(`
    <div class="section-title">
      <h2>Prévia da experiência</h2>
      <p class="lead">Uma visão simples do que será avaliado. Você pode ajustar qualquer item antes do briefing.</p>
    </div>
    <section class="preview-editor">
      <div class="preview-hero compact">
        <label class="edit-field hero-field">
          <span><b>Nome da experiência</b><i aria-hidden="true">✎</i></span>
          <input class="ghost-input" data-bind="preview.experienceName" value="${escapeAttr(preview.experienceName)}">
        </label>
        <label class="edit-field hero-field">
          <span><b>Resumo do conceito</b><i aria-hidden="true">✎</i></span>
          <textarea class="ghost-area" data-bind="preview.conceptSummary">${escapeHtml(preview.conceptSummary)}</textarea>
        </label>
      </div>
      <div class="preview-edit-grid">
        ${PreviewEditField("Paleta de cores", "preview.paletteText", preview.paletteText)}
        ${PreviewEditArea("Estilo visual", "preview.visualStyle", preview.visualStyle)}
        ${PreviewEditArea("Seções do site", "preview.sectionsText", preview.sectionsText)}
        ${PreviewEditArea("Interações para convidados", "preview.interactionsText", preview.interactionsText)}
        ${PreviewEditArea("Convite digital", "preview.invitationSuggestion", preview.invitationSuggestion)}
        ${PreviewEditArea("Atividades no dia", "preview.activitiesText", preview.activitiesText)}
        ${PreviewEditField("Grau de complexidade", "preview.complexity", preview.complexity)}
        ${PreviewEditArea("Pontos de atenção", "preview.viabilityNotes", preview.viabilityNotes)}
      </div>
    </section>
    <div class="cta-row">
      <button class="button primary" data-action="generate-briefing">Gerar briefing</button>
      <button class="button secondary" data-action="back-to-features">Voltar à experiência</button>
    </div>
  `, "Prévia", 100);
}

function PreviewEditField(label, bind, value) {
  return `
    <label class="edit-field">
      <span><b>${escapeHtml(label)}</b><i aria-hidden="true">✎</i></span>
      <input class="input" data-bind="${escapeAttr(bind)}" value="${escapeAttr(value || "")}">
    </label>
  `;
}

function PreviewEditArea(label, bind, value) {
  return `
    <label class="edit-field">
      <span><b>${escapeHtml(label)}</b><i aria-hidden="true">✎</i></span>
      <textarea class="textarea short" data-bind="${escapeAttr(bind)}">${escapeHtml(value || "")}</textarea>
    </label>
  `;
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
    { key: "features", label: "Experiência" },
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

function textareaField(label, bind, value, placeholder = "") {
  return `
    <label>
      ${escapeHtml(label)}
      <textarea class="textarea short" data-bind="${escapeAttr(bind)}" placeholder="${escapeAttr(placeholder)}">${escapeHtml(value || "")}</textarea>
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
  if (action === "refine-theme") return setState({ screen: "refine", selectedTheme: state.suggestions[index], refinedThemes: [], refinementAnswers: {}, error: "" });
  if (action === "refinement-choice") return setState({
    refinementAnswers: { ...(state.refinementAnswers || {}), [target.dataset.field]: value },
    refinedThemes: [],
    error: ""
  });
  if (action === "generate-refinement") return refineWithAI();
  if (action === "choose-selected") return chooseTheme(state.selectedTheme);
  if (action === "choose-refined") return chooseTheme(state.refinedThemes[index], state.refinedThemes[index]);
  if (action === "refine-current") return setState({ screen: "refine", selectedTheme: state.selectedTheme || currentConfirmation(), refinedThemes: [], refinementAnswers: {}, error: "" });
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
  if (bind.startsWith("giftGuide.")) {
    state.preview = null;
    state.briefing = null;
  }
  if (bind.startsWith("refinementAnswers.")) {
    state.refinedThemes = [];
    state.error = "";
    state.preview = null;
    state.briefing = null;
  }
  if (bind.startsWith("preview.")) {
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
  const refinement = state.refinementAnswers || {};
  if (!refinement.energy || !refinement.priority) {
    showToast("Responda as duas perguntas rápidas para a IA recomendar melhor.");
    return;
  }
  setState({ loading: "refine", error: "" });
  const userDescription = [
    `Dinâmica esperada: ${refinement.energy}.`,
    `Não pode faltar: ${refinement.priority}.`,
    refinement.detail ? `Detalhe da família: ${refinement.detail}.` : "",
    refinement.personalityStory ? `Jeito ou história da criança: ${refinement.personalityStory}.` : "",
    refinement.giftHints ? `Pistas de presente: ${refinement.giftHints}.` : ""
  ].filter(Boolean).join(" ");
  try {
    const response = await api("/refine", {
      baseTheme: state.selectedTheme,
      userDescription,
      quizAnswers: state.answers
    }, { timeoutMs: 7000 });
    setState({ loading: "", refinedThemes: (response.themes || []).slice(0, 1) });
  } catch (error) {
    const refinedThemes = generatePersonalizedThemes(state.selectedTheme, userDescription, state.answers);
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
  const module = featureModules.find(item => item.id === moduleId);
  if (!module) return;
  if (module.tier === "standard") {
    showToast("Esse item já vem incluído para sua festa começar organizada.");
    return;
  }
  const selectedModules = state.selectedModules.includes(moduleId)
    ? state.selectedModules.filter(id => id !== moduleId)
    : [...state.selectedModules, moduleId];
  setState({ selectedModules, preview: null, briefing: null });
}

function selectRecommendedModules() {
  setState({
    selectedModules: essentialModuleIds(),
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
      refinementAnswers: state.refinementAnswers,
      giftGuide: state.giftGuide,
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

  const themes = uniqueByName([...selected, ...defaults]).slice(0, 3);
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
  const sophisticatedCount = modules.filter(module => module.tier === "sophisticated").length;
  const activities = [
    modules.some(module => module.id === "quiz") ? "Perguntas divertidas sobre a criança" : "Atividade leve alinhada ao tema",
    modules.some(module => module.id === "gallery") ? "Pedido de fotos afetivas dos convidados" : "Momento de registro para a família",
    modules.some(module => module.id === "missions") ? "Missões da festa para gerar memórias" : "Interação simples sem depender de estrutura extra"
  ];
  const palette = paletteForTheme(themeName, refined.palette);

  return {
    experienceName,
    conceptSummary: refined.concept || `Uma experiência digital clean para transformar o tema ${themeName} em convite, interação no dia e memória pós-festa.`,
    palette,
    paletteText: palette.map(color => color.name).join(", "),
    visualStyle: refined.decorIdea || `Visual acolhedor, moderno e fácil de adaptar ao tema ${themeName}.`,
    sections,
    sectionsText: sections.join("\n"),
    interactions,
    interactionsText: interactions.join("\n"),
    activities,
    activitiesText: activities.join("\n"),
    invitationSuggestion: `Convite digital com o nome da experiência, data, horário, local, RSVP e um texto curto no clima de ${themeName}.`,
    modulesText: modules.map(module => module.name).join("\n"),
    complexity: sophisticatedCount ? "Média, com experiências especiais para avaliação" : (budget === "Baixo" || simple ? "Baixa a média" : "Média"),
    viabilityNotes: simple
      ? "Priorizar uma experiência leve, bonita no celular e fácil de usar. Experiências especiais seguem para avaliação."
      : "Validar volume de convidados, experiências especiais, aprovação de fotos e prazo de produção."
  };
}

function normalizePreview(preview) {
  const paletteText = preview.paletteText || (preview.palette || []).map(color => color.name).join(", ");
  const sectionsText = preview.sectionsText || (preview.sections || []).join("\n");
  const interactionsText = preview.interactionsText || (preview.interactions || []).join("\n");
  const activitiesText = preview.activitiesText || (preview.activities || []).join("\n");
  return {
    ...preview,
    paletteText,
    sectionsText,
    interactionsText,
    activitiesText
  };
}

function previewList(preview, key) {
  const text = preview[`${key}Text`];
  if (typeof text === "string" && text.trim()) {
    return text.split(/\n|;/).map(item => item.trim()).filter(Boolean);
  }
  return Array.isArray(preview[key]) ? preview[key] : [];
}

function generateDevelopmentBriefing(confirmedTheme, quizAnswers, aiPersonalization, experiencePreview, selectedModules = []) {
  const modules = selectedModuleDetails(selectedModules.length ? selectedModules : recommendedModuleIds(confirmedTheme, quizAnswers));
  const standardModules = modules.filter(module => module.tier === "standard");
  const recommendedModules = modules.filter(module => module.tier === "recommended");
  const sophisticatedModules = modules.filter(module => module.tier === "sophisticated");
  const refinement = state.refinementAnswers || {};
  const giftGuide = state.giftGuide || {};
  const preview = normalizePreview(experiencePreview || generateExperiencePreview(confirmedTheme, quizAnswers, aiPersonalization, selectedModules));
  const interactions = previewList(preview, "interactions");
  const sections = previewList(preview, "sections");
  const wantsGiftGuide = modules.some(module => module.id === "giftGuide") || giftGuideHasContent(giftGuide) || Boolean(refinement.giftHints);
  const subject = `Solicitação de avaliação - experiência de festa: ${confirmedTheme.themeName}`;
  const body = [
    `Tema escolhido: ${confirmedTheme.themeName}`,
    `Nome da experiência: ${confirmedTheme.experienceName}`,
    `Idade da criança: ${confirmedTheme.age}`,
    `Data da festa: ${confirmedTheme.eventDate || quizAnswers.eventDate || "Ainda não sei"}`,
    `Local da festa: ${confirmedTheme.place}`,
    `Tamanho estimado: ${quizAnswers.size || "Ainda não sei"}`,
    `Estilo desejado: ${confirmedTheme.style}`,
    `Orçamento estimado: ${confirmedTheme.budget}`,
    "",
    "Resumo do conceito:",
    preview.conceptSummary,
    "",
    "Detalhes afetivos para personalização:",
    `- Dinâmica esperada: ${refinement.energy || "Não informado"}`,
    `- O que não pode faltar: ${refinement.priority || "Não informado"}`,
    `- Detalhe geral da família: ${refinement.detail || "Não informado"}`,
    `- Jeitinho ou história engraçada: ${refinement.personalityStory || "Não informado"}`,
    `- Pistas de presente citadas no chat: ${refinement.giftHints || "Não informado"}`,
    "",
    "Essencial incluído:",
    ...(standardModules.length ? standardModules.map(module => `- ${module.name}: ${module.description}`) : ["- Nenhum item essencial selecionado."]),
    "",
    "Mais escolhido selecionado:",
    ...(recommendedModules.length ? recommendedModules.map(module => `- ${module.name}: ${module.description}`) : ["- Nenhum item de mais escolhido selecionado."]),
    "",
    "Experiências especiais para avaliação do time:",
    ...(sophisticatedModules.length ? sophisticatedModules.map(module => `- ${module.name}: ${module.description}`) : ["- Nenhuma experiência especial selecionada."]),
    "",
    ...(wantsGiftGuide ? [
      "Guia de presentes:",
      `- Tamanho de roupa: ${giftGuide.clothingSize || "Não informado"}`,
      `- Número do calçado: ${giftGuide.shoeSize || "Não informado"}`,
      `- Brinquedos/temas que pode gostar: ${giftGuide.likes || "Não informado"}`,
      `- O que prefere evitar: ${giftGuide.avoids || "Não informado"}`,
      `- Observação para convidados: ${giftGuide.notes || "Não informado"}`,
      ""
    ] : []),
    "Ideias de interação:",
    ...interactions.map(item => `- ${item}`),
    "",
    "Seções sugeridas do site:",
    ...sections.map(item => `- ${item}`),
    "",
    "Pontos obrigatórios:",
    "- Experiência mobile-first",
    "- Linguagem acolhedora e prática",
    "- Não prometer criação automática",
    "- Fotos e mensagens precisam de aprovação dos pais",
    "",
    "Transparência comercial:",
    "- O responsável selecionou os itens acima no assistente.",
    "- Itens essenciais e mais escolhidos podem seguir conforme o plano contratado.",
    "- Experiências especiais precisam de confirmação de viabilidade, prazo e complexidade.",
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
  return essentialModuleIds();
}

function essentialModuleIds() {
  return featureModules.filter(module => module.tier === "standard").map(module => module.id);
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
}

function giftGuideHasContent(giftGuide = {}) {
  return ["clothingSize", "shoeSize", "likes", "avoids", "notes"].some(key => String(giftGuide[key] || "").trim());
}

function buildConfirmation(theme, personalization) {
  const refined = personalization || {};
  const themeName = refined.name || theme.name || "Tema da festa";
  return {
    themeName,
    experienceName: refined.name ? `Experiência ${refined.name}` : `Experiência ${themeName}`,
    age: state.answers.age || "",
    eventDate: state.answers.eventDate || "",
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
