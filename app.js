const API = "/festa-viva/api";
const STORAGE_KEY = "festaVivaThemeFlowV2";

const questions = [
  {
    id: "childName",
    prompt: "Qual é o nome da criança?",
    type: "text",
    placeholder: "Ex: Luiza"
  },
  {
    id: "planningStage",
    prompt: "Em que momento você está no planejamento da festa?",
    type: "single",
    options: ["Estou começando do zero.", "Já tenho buffet ou espaço contratado.", "Já tenho tema definido.", "Só preciso resolver alguns detalhes.", "Estou apenas buscando ideias."]
  },
  {
    id: "age",
    prompt: "Quantos anos ela vai fazer?",
    type: "single",
    options: ["1 ano", "2 anos", "3 anos", "4 anos", "5 anos", "6 anos", "7 anos", "8 anos", "9 anos", "10 anos", "Mais de 10 anos"]
  },
  {
    id: "cityRegion",
    prompt: "Em qual cidade ou região será a festa?",
    type: "text",
    placeholder: "Ex: São Paulo - Zona Sul",
    help: "Não precisa informar endereço completo."
  },
  {
    id: "eventDate",
    prompt: "Qual será a data da festa?",
    type: "date",
    placeholder: "Escolha a data do evento",
    help: "A data ajuda a IA a pensar no convite, nos lembretes e no prazo de organização."
  },
  {
    id: "eventTime",
    prompt: "Qual será o horário previsto?",
    type: "single",
    options: ["Manhã", "Almoço", "Tarde", "Fim de tarde", "Noite", "Ainda não sei"]
  },
  {
    id: "place",
    prompt: "Onde será a festa?",
    type: "single",
    options: ["Casa", "Salão do condomínio", "Buffet infantil", "Escola", "Restaurante", "Espaço de eventos", "Ainda não sei"]
  },
  {
    id: "size",
    prompt: "Quantas pessoas você imagina convidar?",
    type: "single",
    options: ["Festa pequena — até 30 pessoas", "Festa média — de 31 a 50 pessoas", "Festa grande — de 51 a 100 pessoas", "Super festa — acima de 100 pessoas", "Ainda não sei"],
    help: "Pode ser uma estimativa. A IA usa isso para sugerir algo proporcional."
  },
  {
    id: "themeInterest",
    prompt: "A criança já tem algum tema, personagem ou interesse favorito?",
    type: "hybrid",
    placeholder: "Ex: futebol, dinossauros, princesas, São Paulo FC, unicórnios...",
    options: ["Já tenho um tema", "Quero ajuda da IA", "Ainda não sei"]
  },
  {
    id: "agentHelpToday",
    prompt: "O que você quer que o Agente Festeiro te ajude a resolver hoje?",
    type: "multi",
    max: 4,
    options: ["Escolher ou refinar o tema.", "Organizar a festa inteira.", "Criar convite ou site da festa.", "Resolver lembrancinhas.", "Pensar em decoração.", "Encontrar bolo ou doces.", "Buscar recreação ou atrações.", "Montar um checklist.", "Outro."]
  }
];

const investmentOptions = ["Quero algo econômico", "Quero algo equilibrado", "Quero algo completo", "Quero algo mais sofisticado", "Prefiro não informar agora"];

const featureModules = [
  { id: "invite", name: "Convite da festa", tier: "standard", description: "Convite com tema da festa, data, horário, local e botão de confirmação.", section: "Convite da festa", interaction: "Confirmação de presença direto pelo convite" },
  { id: "rsvp", name: "Convidados + RSVP", tier: "standard", description: "Organize adultos e crianças, acompanhe confirmações e evite surpresas no dia.", section: "Convidados e confirmação de presença", interaction: "Contagem por família para os pais" },
  { id: "story", name: "História da criança", tier: "recommended", description: "Uma página especial contando a personalidade, os gostos e os momentos marcantes da criança.", section: "História da criança", interaction: "Conteúdo afetivo para família e convidados" },
  { id: "gallery", name: "Fotos com aprovação", tier: "recommended", description: "Os pais escolhem quais fotos entram na retrospectiva ou página da festa.", section: "Fotos com aprovação", interaction: "Envio de fotos com aprovação dos pais" },
  { id: "messages", name: "Mural de recados", tier: "recommended", description: "Mensagens carinhosas dos convidados para guardar como lembrança.", section: "Mural de recados", interaction: "Recados afetivos para a família" },
  { id: "menu", name: "Cardápio", tier: "recommended", description: "Cardápio infantil, buffet ou opções da festa em uma página fácil de consultar.", section: "Cardápio", interaction: "Consulta rápida do cardápio" },
  { id: "album", name: "Álbum de memórias", tier: "recommended", description: "Uma página para reunir os melhores registros depois da comemoração.", section: "Álbum de memórias", interaction: "Agradecimento e melhores registros pós-festa" },
  { id: "giftGuide", name: "Ideias de presentes", tier: "recommended", description: "Sugestões por idade, tamanho, preferências e fase da criança.", section: "Ideias de presentes", interaction: "Convidados consultam sugestões antes de comprar presente" },
  { id: "quiz", name: "Quiz da criança", tier: "sophisticated", description: "Perguntas rápidas e divertidas para os convidados brincarem durante a festa.", section: "Quiz da criança", interaction: "Brincadeira rápida para convidados" },
  { id: "missions", name: "Missões da festa", tier: "sophisticated", description: "Desafios simples para aproximar convidados e criar fotos e memórias.", section: "Missões da festa", interaction: "Missões leves para criar memórias" },
  { id: "retrospective", name: "Retrospectiva personalizada", tier: "sophisticated", description: "Uma retrospectiva afetiva com fotos, frases e momentos importantes da criança.", section: "Retrospectiva personalizada", interaction: "Retrospectiva afetiva para a família" },
  { id: "partyFlow", name: "Roteiro da festa", tier: "sophisticated", description: "Sugestão de ordem dos momentos: chegada, parabéns, brincadeiras, fotos e encerramento.", section: "Roteiro da festa", interaction: "Roteiro simples para orientar a comemoração" },
  { id: "partyFavors", name: "Lembrancinhas personalizadas", tier: "sophisticated", description: "Ideias de lembrancinhas criativas, úteis e alinhadas ao tema da festa.", section: "Lembrancinhas personalizadas", interaction: "Sugestões de lembrancinhas para convidados" },
  { id: "messaging", name: "Lembretes para convidados", tier: "sophisticated", description: "Envio de lembretes e informações importantes por canais oficiais.", section: "Lembretes para convidados", interaction: "Lembretes por canais oficiais" },
  { id: "timeline", name: "Linha do tempo da criança", tier: "sophisticated", description: "Momentos marcantes da criança organizados de forma visual e afetiva.", section: "Linha do tempo da criança", interaction: "Linha do tempo afetiva" }
];

const initialState = {
  screen: "home",
  questionIndex: 0,
  answers: {},
  suggestions: [],
  selectedTheme: null,
  selectedPath: null,
  refinementAnswers: {},
  refinementQuestions: [],
  aiPersonalization: null,
  finalRecommendation: null,
  confirmation: {},
  preview: null,
  briefing: null,
  briefingEditable: false,
  selectedModules: [],
  giftGuide: { clothingSize: "", shoeSize: "", likes: "", avoids: "", notes: "" },
  contact: { name: "", email: "", phone: "", buffetCode: "" },
  submissionResult: null,
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
    budget: InvestmentQuestionStep,
    suggestions: ThemeSuggestionsStep,
    path: PathRefinementChoiceStep,
    refine: AIPersonalizationPanel,
    confirm: FinalRecommendationStep,
    features: FeatureSelectionStep,
    preview: ExperiencePreview,
    briefing: DevelopmentBriefingPreview,
    success: SubmissionSuccessPage
  }[state.screen]();
}

function MinimalHome() {
  return `
    <section class="home screen">
      <div class="home-card">
        <div class="brand"><span class="brand-mark"></span> Agente Festeiro</div>
        <h1>Prepare uma festa especial com menos correria</h1>
        <p class="lead">O Agente Festeiro ajuda famílias a planejar melhor a comemoração, organizar informações para convidados e criar memórias inesquecíveis usando as facilidades do mundo digital.</p>
        <div class="home-options">
          <button class="route-card planner featured" data-action="start">
            <span class="route-eyebrow">Assistente</span>
            <strong>Começar planejamento</strong>
            <small>Conte uma vez os detalhes da festa e receba caminhos, checklist, convite, RSVP e ideias de experiências para encantar convidados.</small>
          </button>
          <div class="demo-area">
            <p class="micro"><strong>Demos de experiências personalizadas</strong></p>
            <div class="demo-grid">
              <a class="route-card luiza" href="/festa-luiza/">
                <span class="route-eyebrow">Restrito</span>
                <strong>Festa da Luiza</strong>
                <small>Site real com acesso protegido por senha, galeria e memórias da festa.</small>
              </a>
              <a class="route-card leonidas" href="/festa-leonidas/">
                <span class="route-eyebrow">Demo</span>
                <strong>Festa do Leonidas</strong>
                <small>Exemplo aberto de experiência no dia da festa, com futebol, fotos, recados e brincadeiras.</small>
              </a>
            </div>
          </div>
        </div>
        <p class="micro">Menos repetição de informações com fornecedores, mais clareza para convidados e mais cuidado com as memórias da família.</p>
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
        <p><strong>Dados rápidos da festa</strong></p>
        <p class="micro">Poucas respostas já ajudam a IA a pensar no convite, na organização e no que pode dar menos trabalho para a família.</p>
        ${AnswerStrip()}
      </aside>
      ${ChatQuestion(question)}
    </div>
  `, `Pergunta ${state.questionIndex + 1} de ${questions.length}`, progress);
}

function ChatQuestion(question) {
  if (question.type === "text") {
    return `
      <section class="question-card">
        <h2>${escapeHtml(question.prompt)}</h2>
        <input class="input" data-bind="answers.${question.id}" value="${escapeAttr(getAnswer(question.id))}" placeholder="${escapeAttr(question.placeholder || "")}">
        <div class="cta-row">
          <button class="button primary" data-action="next-question">Continuar</button>
          <button class="button ghost" data-action="back-question" ${state.questionIndex === 0 ? "disabled" : ""}>Voltar</button>
        </div>
      </section>
    `;
  }
  if (question.type === "date") {
    return `
      <section class="question-card">
        <h2>${escapeHtml(question.prompt)}</h2>
        ${question.help ? `<p class="micro">${escapeHtml(question.help)}</p>` : ""}
        <input class="input date-input" type="date" data-bind="answers.${question.id}" value="${escapeAttr(getAnswer(question.id))}" aria-label="${escapeAttr(question.placeholder || question.prompt)}">
        <div class="cta-row">
          <button class="button primary" data-action="next-question">Continuar</button>
          <button class="button ghost" data-action="back-question">Voltar</button>
        </div>
      </section>
    `;
  }
  if (question.type === "hybrid") {
    return `
      <section class="question-card">
        <h2>${escapeHtml(question.prompt)}</h2>
        <input class="input" data-bind="answers.${question.id}" value="${escapeAttr(getAnswer(question.id))}" placeholder="${escapeAttr(question.placeholder || "")}">
        <div class="chips compact">
          ${question.options.map(option => OptionChip({ ...question, id: `${question.id}Mode`, type: "single" }, option)).join("")}
        </div>
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
      ${question.help ? `<p class="micro">${escapeHtml(question.help)}</p>` : ""}
      <div class="chips">
        ${question.options.map(option => OptionChip(question, option)).join("")}
      </div>
      ${question.type === "multi" ? `
        ${question.max ? `<p class="micro">Escolha até ${question.max} itens.</p>` : ""}
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

function InvestmentQuestionStep() {
  return StepShell(`
    <div class="assistant-layout">
      <aside class="assistant-card">
        <p><strong>Pergunta opcional</strong></p>
        <p class="micro">Isso ajuda a IA a sugerir algo mais realista, mas você pode seguir sem informar.</p>
      </aside>
      <section class="question-card">
        <h2>Quer informar uma faixa de investimento para a IA sugerir algo mais realista?</h2>
        <div class="chips">
          ${investmentOptions.map(option => `<button class="chip ${state.answers.investmentLevel === option ? "active" : ""}" data-action="set-investment" data-value="${escapeAttr(option)}">${escapeHtml(option)}</button>`).join("")}
        </div>
        <div class="cta-row">
          <button class="button secondary" data-action="skip-investment">Prefiro seguir sem isso</button>
          <button class="button ghost" data-action="back-to-quiz">Voltar</button>
        </div>
      </section>
    </div>
  `, "Opcional", 100);
}

function OptionChip(question, option) {
  const answer = getAnswer(question.id);
  const active = Array.isArray(answer) ? answer.includes(option) : answer === option;
  return `<button class="chip ${active ? "active" : ""}" data-action="answer" data-question="${question.id}" data-value="${escapeAttr(option)}">${escapeHtml(option)}</button>`;
}

function ThemeSuggestionsStep() {
  return StepShell(`
    <div class="section-title">
      <h2>Escolha o caminho da festa</h2>
      <p class="lead">A IA usou suas respostas para sugerir caminhos possíveis. Escolha o que mais combina com sua família.</p>
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
      <div class="card-actions">
        <button class="button primary" data-action="choose-theme" data-index="${index}">Escolher caminho</button>
      </div>
    </article>
  `;
}

function PathRefinementChoiceStep() {
  const theme = state.selectedTheme || {};
  return StepShell(`
    <div class="assistant-layout">
      <aside class="assistant-card">
        <p><strong>Caminho escolhido:</strong> ${escapeHtml(theme.name || "Festa personalizada")}</p>
        <p class="micro">${escapeHtml(theme.whyFits || "Um caminho possível para sua família avançar com mais clareza.")}</p>
      </aside>
      <section class="question-card">
        <h2>Quer deixar com o jeitinho da sua família?</h2>
        <p class="lead">A IA pode fazer 2 ou 3 perguntas rápidas e trazer dicas personalizadas para deixar a festa ainda mais surpreendente, prática e possível de executar.</p>
        <div class="cta-row">
          <button class="button primary" data-action="start-path-refine">Sim, refinar com IA</button>
          <button class="button secondary" data-action="skip-path-refine">Seguir com este caminho</button>
          <button class="button ghost" data-action="back-to-suggestions">Escolher outro caminho</button>
        </div>
      </section>
    </div>
  `, "Caminho", 100);
}

function AIPersonalizationPanel() {
  const theme = state.selectedTheme || {};
  const refinement = state.refinementAnswers || {};
  const aiQuestions = refinementQuestions();
  const canAskAi = aiQuestions.every(question => refinement[question.id]);
  return StepShell(`
    <div class="assistant-layout">
      <aside class="assistant-card">
        <p><strong>Caminho escolhido:</strong> ${escapeHtml(theme.name || "Festa personalizada")}</p>
        <p class="micro">Responda 2 ou 3 perguntas rápidas para a IA recomendar o melhor conceito de festa, com execução e alertas práticos.</p>
      </aside>
      <section class="question-card">
        <h2>Refinar com IA</h2>
        ${aiQuestions.map(question => `
          <div class="refine-question">
            <p class="lead small">${escapeHtml(question.prompt)}</p>
            <div class="chips compact">
              ${question.options.map(option => RefinementChoice(question.id, option, refinement[question.id])).join("")}
            </div>
          </div>
        `).join("")}
        <div class="cta-row">
          <button class="button primary" data-action="generate-refinement" ${state.loading || !canAskAi ? "disabled" : ""}>Ver recomendação da IA</button>
          <button class="button ghost" data-action="back-to-suggestions">Voltar</button>
        </div>
        ${state.loading === "refine" ? AgentThinkingLoader() : ""}
        ${state.error ? `<p class="micro">${escapeHtml(state.error)}</p>` : ""}
      </section>
    </div>
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

function FinalRecommendationStep() {
  const recommendation = state.finalRecommendation || generateFinalRecommendation(state.selectedTheme, state.answers, state.refinementAnswers, refinementQuestions());
  const childName = state.answers.childName || "criança";
  return StepShell(`
    <div class="section-title">
      <h2>Recomendação da IA</h2>
      <p class="lead">Para a festa de ${escapeHtml(childName)}, a melhor escolha é:</p>
    </div>
    <section class="recommendation-card">
      <div class="recommendation-hero">
        <span class="route-eyebrow">Conceito recomendado</span>
        <h1>${escapeHtml(recommendation.conceptName)}</h1>
      </div>
      <div class="recommendation-grid">
        <div>
          <h3>Por que combina</h3>
          <p>${escapeHtml(recommendation.whyFits)}</p>
        </div>
        <div>
          <h3>Como executar sem dor de cabeça</h3>
          <p>${escapeHtml(recommendation.executionPlan)}</p>
        </div>
      </div>
      <div class="recommendation-grid">
        <div>
          <h3>O que priorizar</h3>
          <ul class="mini-list">
            ${recommendation.priorities.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h3>O que evitar</h3>
          <ul class="mini-list">
            ${recommendation.avoid.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
      </div>
      <div class="cta-row">
        <button class="button primary" data-action="confirm-theme">Montar experiência da festa</button>
        <button class="button secondary" data-action="refine-current">Refinar mais</button>
        <button class="button ghost" data-action="back-to-suggestions">Escolher outro caminho</button>
      </div>
    </section>
  `, "Recomendação", 100);
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
      <h2>Sua festa está quase pronta</h2>
      <p class="lead">Revise os principais detalhes. Você pode ajustar qualquer item antes de enviar para criação da experiência personalizada.</p>
    </div>
    <section class="preview-editor">
      <div class="preview-hero compact">
        <label class="edit-field hero-field">
          <span><b>Tema/conceito</b><i aria-hidden="true">✎</i></span>
          <input class="ghost-input" data-bind="preview.themeConcept" value="${escapeAttr(preview.themeConcept)}">
        </label>
        <label class="edit-field hero-field">
          <span><b>Texto do convite</b><i aria-hidden="true">✎</i></span>
          <textarea class="ghost-area" data-bind="preview.invitationText">${escapeHtml(preview.invitationText)}</textarea>
        </label>
      </div>
      <div class="preview-edit-grid">
        ${PreviewEditField("Nome da criança", "preview.childName", preview.childName)}
        ${PreviewEditField("Data", "preview.eventDate", preview.eventDate)}
        ${PreviewEditField("Horário", "preview.eventTime", preview.eventTime)}
        ${PreviewEditField("Local", "preview.place", preview.place)}
        ${PreviewEditArea("História da criança", "preview.childStory", preview.childStory)}
        ${PreviewEditField("Cores da festa", "preview.colorsText", preview.colorsText)}
        ${PreviewEditArea("Itens escolhidos", "preview.selectedItemsText", preview.selectedItemsText)}
        ${PreviewEditArea("Mensagem para convidados", "preview.guestMessage", preview.guestMessage)}
        ${PreviewEditArea("Roteiro sugerido", "preview.suggestedFlow", preview.suggestedFlow)}
      </div>
    </section>
    <div class="cta-row">
      <button class="button primary" data-action="generate-briefing">Quero criar minha festa personalizada</button>
      <button class="button secondary" data-action="back-to-features">Voltar e ajustar</button>
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

function SubmissionSuccessPage() {
  const checklist = state.submissionResult?.checklist || generatePersonalizedChecklist();
  return StepShell(`
    <section class="success-hero">
      <span class="route-eyebrow">Pedido recebido</span>
      <h2>Obrigado por preencher tudo com carinho.</h2>
      <p class="lead">Recebemos as informações da festa e retornaremos em até 48 horas com a avaliação da experiência personalizada.</p>
      <p class="micro">Enquanto isso, preparei um checklist com base nas suas respostas para ajudar sua família a seguir sem perder o fio.</p>
      ${state.submissionResult?.id ? `<p class="micro"><strong>ID do pedido:</strong> ${escapeHtml(state.submissionResult.id)}</p>` : ""}
    </section>
    <section class="panel checklist-panel">
      <div class="section-title compact">
        <h2>Checklist personalizado</h2>
        <p class="micro">Use como guia rápido. Ele considera o momento do planejamento, local, cidade/região, tema, itens escolhidos e o que você pediu ajuda para resolver.</p>
      </div>
      ${ChecklistView(checklist)}
      <div class="cta-row">
        <button class="button primary" data-action="download-checklist">Baixar checklist em PDF</button>
        <button class="button secondary" data-action="reset">Planejar outra festa</button>
      </div>
    </section>
  `, "Checklist", 100);
}

function ChecklistView(checklist) {
  return `
    <div class="checklist-print" id="checklist-print">
      <h1>${escapeHtml(checklist.title)}</h1>
      <p>${escapeHtml(checklist.subtitle)}</p>
      ${checklist.sections.map(section => `
        <section class="checklist-section">
          <h2>${escapeHtml(section.title)}</h2>
          <ul>
            ${section.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>
      `).join("")}
    </div>
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
    { key: "budget", label: "Preferência" },
    { key: "suggestions", label: "Caminho" },
    { key: "refine", label: "IA" },
    { key: "features", label: "Experiência" },
    { key: "preview", label: "Prévia" },
    { key: "briefing", label: "Envio" }
  ];
  const activeKey = state.screen === "confirm" ? "refine" : state.screen === "success" ? "briefing" : state.screen === "path" ? "suggestions" : state.screen;
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
  if (action === "set-investment") return setInvestment(value);
  if (action === "skip-investment") return setInvestment("Prefiro não informar agora");
  if (action === "back-to-quiz") return setState({ screen: "quiz", questionIndex: Math.max(0, questions.length - 1) });
  if (action === "back-to-suggestions") return setState({ screen: "suggestions", loading: "", error: "" });
  if (action === "choose-theme") return choosePath(state.suggestions[index]);
  if (action === "start-path-refine") return startRefinement(state.selectedPath || state.selectedTheme);
  if (action === "skip-path-refine") return usePathWithoutRefinement();
  if (action === "refinement-choice") return setState({
    refinementAnswers: { ...(state.refinementAnswers || {}), [target.dataset.field]: value },
    finalRecommendation: null,
    aiPersonalization: null,
    preview: null,
    briefing: null,
    error: ""
  });
  if (action === "generate-refinement") return refineWithAI();
  if (action === "refine-current") return startRefinement(state.selectedPath || state.selectedTheme || currentConfirmation());
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
  if (action === "download-checklist") return downloadChecklistPdf();
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
  const syntheticSingle = questionId.endsWith("Mode");
  if (!question && !syntheticSingle) return;
  if (question?.type === "multi") {
    const current = getAnswer(questionId);
    let next = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
    if (value === "Ainda não sei") next = current.includes(value) ? [] : [value];
    if (value !== "Ainda não sei") next = next.filter(item => item !== "Ainda não sei");
    if (question.max && next.length > question.max) {
      showToast(`Escolha no máximo ${question.max} itens para manter a recomendação objetiva.`);
      return;
    }
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
  return setState({ screen: "budget" });
}

function setInvestment(value) {
  const answers = { ...state.answers, investmentLevel: value };
  const suggestions = generateThemeRecommendations(answers);
  setState({ screen: "suggestions", answers, suggestions });
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

function choosePath(path) {
  const selected = normalizeTheme(path);
  setState({
    screen: "path",
    selectedTheme: selected,
    selectedPath: path,
    refinementAnswers: {},
    refinementQuestions: [],
    finalRecommendation: null,
    aiPersonalization: null,
    confirmation: {},
    preview: null,
    briefing: null,
    error: ""
  });
}

function startRefinement(path) {
  const selected = normalizeTheme(path);
  const refinementQuestions = selectRefinementQuestions(state.answers, path || selected);
  setState({
    screen: "refine",
    selectedTheme: selected,
    selectedPath: path,
    refinementAnswers: {},
    refinementQuestions,
    finalRecommendation: null,
    aiPersonalization: null,
    error: ""
  });
}

function usePathWithoutRefinement() {
  const finalRecommendation = generateFinalRecommendation(state.selectedTheme, state.answers, {}, []);
  const confirmation = buildConfirmation(state.selectedTheme, finalRecommendation);
  setState({
    screen: "confirm",
    finalRecommendation,
    aiPersonalization: finalRecommendation,
    confirmation,
    preview: null,
    briefing: null,
    error: ""
  });
}

async function refineWithAI() {
  const refinement = state.refinementAnswers || {};
  const askedQuestions = refinementQuestions();
  const missing = askedQuestions.filter(question => !refinement[question.id]);
  if (missing.length) {
    showToast("Responda as perguntas rápidas para a IA recomendar melhor.");
    return;
  }
  setState({ loading: "refine", error: "" });
  const refinementSummary = askedQuestions
    .map(question => `${question.prompt}: ${refinement[question.id]}`)
    .join("\n");
  try {
    const response = await api("/refine", {
      baseTheme: state.selectedTheme,
      selectedPath: state.selectedPath,
      refinementAnswers: refinement,
      refinementQuestions: askedQuestions,
      userDescription: refinementSummary,
      quizAnswers: state.answers
    }, { timeoutMs: 7000 });
    const finalRecommendation = normalizeFinalRecommendation(response.recommendation || response.themes?.[0], state.selectedTheme, state.answers, refinement, askedQuestions);
    const confirmation = buildConfirmation(state.selectedTheme, finalRecommendation);
    setState({
      screen: "confirm",
      loading: "",
      finalRecommendation,
      aiPersonalization: finalRecommendation,
      confirmation,
      preview: null,
      briefing: null,
      error: ""
    });
  } catch (error) {
    const finalRecommendation = generateFinalRecommendation(state.selectedTheme, state.answers, refinement, askedQuestions);
    const confirmation = buildConfirmation(state.selectedTheme, finalRecommendation);
    setState({
      screen: "confirm",
      loading: "",
      finalRecommendation,
      aiPersonalization: finalRecommendation,
      confirmation,
      preview: null,
      briefing: null,
      error: ""
    });
    showToast("Mostrei uma versão rápida porque a IA demorou. Dá para seguir normalmente.");
  }
}

function confirmTheme() {
  const finalRecommendation = state.finalRecommendation || generateFinalRecommendation(state.selectedTheme, state.answers, state.refinementAnswers, refinementQuestions());
  const confirmation = { ...buildConfirmation(state.selectedTheme || {}, finalRecommendation), ...state.confirmation };
  const selectedModules = state.selectedModules.length ? state.selectedModules : recommendedModuleIds(confirmation, state.answers);
  setState({
    screen: "features",
    finalRecommendation,
    aiPersonalization: finalRecommendation,
    confirmation,
    selectedModules,
    preview: null,
    briefing: null
  });
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
  const checklist = generatePersonalizedChecklist();
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
      selectedPath: state.selectedPath,
      refinementQuestions: state.refinementQuestions,
      refinementAnswers: state.refinementAnswers,
      finalRecommendation: state.finalRecommendation,
      giftGuide: state.giftGuide,
      featureModules: selectedModuleDetails(),
      developmentBriefing: briefing,
      checklist
    });
    setState({ screen: "success", loading: "", submissionResult: { id: response.id, emailed: response.emailed, checklist } });
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
  return [
    {
      name: "Festa prática e charmosa",
      path: "practical",
      whyFits: "Para quem quer uma comemoração bonita, simples de organizar e sem exageros.",
      cost: "Equilibrado",
      difficulty: "Baixa"
    },
    {
      name: "Festa divertida para as crianças",
      path: "fun",
      whyFits: "Para quem quer brincadeiras, energia, interação e participação dos convidados.",
      cost: "Médio",
      difficulty: "Média"
    },
    {
      name: "Festa memorável e personalizada",
      path: "emotional",
      whyFits: "Para quem quer emoção, história da criança, fotos, retrospectiva e detalhes afetivos.",
      cost: "Médio a alto",
      difficulty: "Média"
    }
  ];
}

function refinementQuestions() {
  if (Array.isArray(state.refinementQuestions) && state.refinementQuestions.length) return state.refinementQuestions;
  return selectRefinementQuestions(state.answers, state.selectedPath || state.selectedTheme || {});
}

function selectRefinementQuestions(answers = {}, selectedPath = {}) {
  const pathKey = selectedPath.path || selectedPath.name || "";
  const themeMode = answers.themeInterestMode || "";
  const themeText = String(answers.themeInterest || "").trim();
  const place = answers.place || "";
  const planningStage = answers.planningStage || "";
  const helpToday = answerText(answers.agentHelpToday || answers.mainHelp);
  const style = selectedPath.name || selectedPath.whyFits || "";
  const investment = answers.investmentLevel || "";
  const bank = {
    likesToday: {
      id: "likesToday",
      prompt: "Do que a criança mais gosta hoje?",
      options: ["Animais", "Esportes", "Princesas/fantasia", "Super-heróis", "Música/dança", "Carros", "Natureza", "Desenhos/personagens", "Brincadeiras ao ar livre", "Ainda não sei"]
    },
    themeDirection: {
      id: "themeDirection",
      prompt: "Você prefere um tema mais clássico ou mais personalizado?",
      options: ["Clássico e fácil de executar", "Criativo e diferente", "Personalizado com a história da criança", "Quero a opção mais prática"]
    },
    partyVibe: {
      id: "partyVibe",
      prompt: "A festa deve ter mais cara de quê?",
      options: ["Fofa e delicada", "Colorida e divertida", "Esportiva e animada", "Elegante e organizada", "Afetiva e familiar", "Surpreendente"]
    },
    avoidOrg: {
      id: "avoidOrg",
      prompt: "O que você mais quer evitar na organização?",
      options: ["Esquecer algum detalhe", "Perder tempo pesquisando ideias", "Gastar mais do que deveria", "Ficar cobrando confirmação", "Não saber por onde começar"]
    },
    helpLevel: {
      id: "helpLevel",
      prompt: "Qual nível de ajuda você quer da IA?",
      options: ["Quero uma sugestão pronta", "Quero sugestão mas podendo ajustar", "Quero decidir quase tudo e só preciso de organização"]
    },
    scope: {
      id: "scope",
      prompt: "A festa precisa ser mais simples ou mais completa?",
      options: ["Simples e bonita", "Equilibrada e bem organizada", "Completa mas sem exageros", "Ainda não sei"]
    },
    memoryGoal: {
      id: "memoryGoal",
      prompt: "Que lembrança você mais gostaria de guardar dessa festa?",
      options: ["Fotos bonitas da criança", "Mensagens da família e amigos", "História dessa fase", "Momento emocionante no parabéns", "Retrospectiva para rever no futuro"]
    },
    childPersonality: {
      id: "childPersonality",
      prompt: "O que melhor descreve a criança hoje?",
      options: ["Carinhosa", "Agitada e brincalhona", "Curiosa", "Engraçada", "Tímida", "Criativa", "Cheia de energia", "Doce e observadora"]
    },
    familyMoment: {
      id: "familyMoment",
      prompt: "Você quer algum momento especial para a família?",
      options: ["Homenagem curta", "Retrospectiva", "Mensagens dos convidados", "Não precisa", "Ainda não sei"]
    },
    budgetPriority: {
      id: "budgetPriority",
      prompt: "Qual é sua prioridade para controlar melhor o investimento?",
      options: ["Economizar na decoração", "Economizar nas lembrancinhas", "Economizar nas atrações", "Evitar desperdício de comida", "Fazer algo bonito sem exagero"]
    },
    economicEssential: {
      id: "economicEssential",
      prompt: "O que é indispensável mesmo em uma festa mais econômica?",
      options: ["Convite bonito", "Bolo e parabéns", "Fotos e lembranças", "Brincadeiras", "Decoração temática", "Organização dos convidados"]
    },
    spaceGuidance: {
      id: "spaceGuidance",
      prompt: "O espaço da festa precisa de alguma orientação especial para os convidados?",
      options: ["Portaria ou identificação", "Estacionamento", "Horário de chegada", "Regras do condomínio", "Não precisa", "Ainda não sei"]
    },
    recreation: {
      id: "recreation",
      prompt: "Você pretende ter recreação ou brincadeiras guiadas?",
      options: ["Sim, com recreador", "Sim, algo simples feito pela família", "Não, será mais livre", "Ainda não sei"]
    },
    venueComplement: {
      id: "venueComplement",
      prompt: "O que você quer complementar na experiência do local?",
      options: ["Convite e confirmação", "História da criança", "Fotos e retrospectiva", "Mural de recados", "Roteiro da festa", "Experiência no telão"]
    },
    kidMix: {
      id: "kidMix",
      prompt: "A festa terá muitas crianças?",
      options: ["Sim, a maioria será criança", "Terá crianças e adultos em equilíbrio", "Mais adultos e família", "Ainda não sei"]
    },
    focusFunMemory: {
      id: "focusFunMemory",
      prompt: "Você quer uma festa mais focada em diversão ou em memória?",
      options: ["Mais diversão", "Mais memória e emoção", "Equilíbrio entre os dois", "Quero a recomendação da IA"]
    }
  };
  const picked = [];
  const add = (...ids) => ids.forEach(id => {
    if (picked.length < 3 && bank[id] && !picked.some(question => question.id === id)) picked.push(bank[id]);
  });
  const needsThemeHelp = !themeText || ["Quero ajuda da IA", "Ainda não sei"].includes(themeMode);
  const practical = pathKey === "practical" || /organizar|tempo|dinheiro|confirmação|convite|checklist|detalhes/i.test(`${helpToday} ${planningStage}`);
  const emotional = pathKey === "emotional" || /emocionante|prévia bonita|memória|site|história/i.test(helpToday) || /memorável/i.test(style);
  const fun = pathKey === "fun" || /brincadeiras|recreação|atrações|bolo|doces/i.test(helpToday) || /divertida/i.test(style);
  const budgetConcern = /econômico|tempo e dinheiro|lembrancinhas|decoração/i.test(`${investment} ${helpToday}`);
  const homeLike = ["Casa", "Salão do condomínio", "Escola"].includes(place);
  const venueLike = ["Buffet infantil", "Restaurante", "Espaço de eventos"].includes(place);

  if (needsThemeHelp) add("likesToday", "themeDirection", "partyVibe");
  if (/tema definido/i.test(planningStage)) add("partyVibe", "venueComplement", "focusFunMemory");
  if (/buscando ideias/i.test(planningStage)) add("likesToday", "themeDirection", "partyVibe");
  if (/detalhes/i.test(planningStage)) add("avoidOrg", "venueComplement", "helpLevel");
  if (practical) add("avoidOrg", "helpLevel", "scope");
  if (emotional) add("memoryGoal", "childPersonality", "familyMoment");
  if (budgetConcern) add("budgetPriority", "economicEssential", "scope");
  if (homeLike) add("spaceGuidance", "recreation", "avoidOrg");
  if (venueLike) add("venueComplement", "kidMix", "focusFunMemory");
  if (fun) add("recreation", "kidMix", "focusFunMemory");
  add("childPersonality", "focusFunMemory", "helpLevel");
  return picked.slice(0, 3);
}

function normalizeFinalRecommendation(input, baseTheme, quizAnswers, refinementAnswers, askedQuestions) {
  if (!input || typeof input !== "object") {
    return generateFinalRecommendation(baseTheme, quizAnswers, refinementAnswers, askedQuestions);
  }
  const fallback = generateFinalRecommendation(baseTheme, quizAnswers, refinementAnswers, askedQuestions);
  return {
    conceptName: input.conceptName || input.name || fallback.conceptName,
    whyFits: input.whyFits || input.concept || fallback.whyFits,
    executionPlan: input.executionPlan || input.decorIdea || fallback.executionPlan,
    priorities: arrayOrText(input.priorities, fallback.priorities).slice(0, 5),
    avoid: arrayOrText(input.avoid, fallback.avoid).slice(0, 2),
    palette: arrayOrText(input.palette, fallback.palette).slice(0, 5),
    decorIdea: input.decorIdea || fallback.decorIdea,
    guestInteraction: input.guestInteraction || fallback.guestInteraction,
    partyFavor: input.partyFavor || fallback.partyFavor,
    costLevel: input.costLevel || fallback.costLevel,
    difficultyLevel: input.difficultyLevel || fallback.difficultyLevel,
    viabilityNote: input.viabilityNote || fallback.viabilityNote
  };
}

function generateFinalRecommendation(baseTheme, quizAnswers = {}, refinementAnswers = {}, askedQuestions = []) {
  const base = normalizeTheme(baseTheme);
  const childName = quizAnswers.childName || "criança";
  const age = quizAnswers.age || "idade informada";
  const place = quizAnswers.place || "local a definir";
  const cityRegion = quizAnswers.cityRegion || "região a definir";
  const size = quizAnswers.size || "tamanho a definir";
  const planningStage = quizAnswers.planningStage || "momento do planejamento a definir";
  const helpToday = answerText(quizAnswers.agentHelpToday || quizAnswers.mainHelp) || "organizar melhor a festa";
  const style = base.name || "estilo a definir";
  const mainHelp = helpToday;
  const investment = quizAnswers.investmentLevel || "sem faixa de investimento informada";
  const themeText = String(quizAnswers.themeInterest || "").trim();
  const quickAnswers = Object.values(refinementAnswers).join(" ").toLowerCase();
  const topic = (themeText || refinementAnswers.likesToday || base.name || "festa personalizada").trim();
  const isFootball = /futebol|bola|são paulo|sao paulo|tricolor|esporte/i.test(`${topic} ${quickAnswers}`);
  const isEmotional = /memória|emoc|retrospectiva|história|mensagens|afetiva|personalizada|site/i.test(`${style} ${mainHelp} ${quickAnswers} ${base.name}`);
  const isPractical = /prática|organizar|tempo|dinheiro|simples|econômico/i.test(`${base.name} ${mainHelp} ${investment} ${quickAnswers}`);
  const conceptName = isFootball
    ? "Pequeno Craque Tricolor"
    : isEmotional
      ? `Memórias da ${childName}`
      : isPractical
        ? `Festa Charmosa da ${childName}`
        : `${base.name} da ${childName}`;
  const simplePlace = ["Casa", "Salão do condomínio", "Escola"].includes(place);
  const priorities = uniqueList([
    "Convite com RSVP",
    isFootball || /brincadeiras|divertida/i.test(`${style} ${mainHelp}`) ? "Brincadeira principal da festa" : "Roteiro simples do parabéns",
    /decoração/i.test(mainHelp) ? "Direção de decoração fácil de executar" : isEmotional ? "Fotos e álbum de memórias" : "Decoração simples no tema",
    /bolo|doces/i.test(mainHelp) ? "Referências para bolo e doces" : isEmotional ? "Mural de recados" : "Organização dos convidados",
    /lembrancinhas/i.test(mainHelp) ? "Lembrancinhas alinhadas ao tema" : /retrospectiva|site/i.test(`${quickAnswers} ${mainHelp}`) ? "Retrospectiva personalizada" : "História da criança"
  ]).slice(0, 5);
  const avoid = [
    simplePlace ? "Evitar atividades demais se o espaço for pequeno." : "Evitar excesso de atrações competindo com o que o local já oferece.",
    /econômico/i.test(investment) ? "Evitar decoração complexa se a ideia é controlar o investimento." : "Evitar detalhes difíceis de produzir se o prazo estiver curto."
  ];
  const executionPlan = isFootball
    ? "Usar clima de mini estádio, convite em formato de ingresso, chute ao gol, medalhas simbólicas e parabéns com energia de final."
    : simplePlace
      ? "Montar uma mesa bonita, convite com confirmação, uma brincadeira central, fotos guiadas e parabéns com roteiro curto."
      : "Aproveitar a estrutura do local com convite, RSVP, história da criança, interação leve no dia e registros para o pós-festa.";
  return {
    conceptName,
    whyFits: `${childName} vai fazer ${age}. Considerando ${place} em ${cityRegion}, ${size}, o momento "${planningStage}" e o que a família quer resolver hoje, esse conceito equilibra beleza, organização e execução possível.`,
    executionPlan,
    priorities,
    avoid,
    palette: isFootball ? ["vermelho", "branco", "preto", "verde gramado"] : paletteForTheme(topic).map(color => color.name.toLowerCase()),
    decorIdea: simplePlace ? "Mesa compacta, painel leve, cantinho de fotos e poucos elementos bem escolhidos." : "Mesa temática, pontos de interação e identidade visual aplicada nos momentos principais.",
    guestInteraction: isFootball ? "Missões de craque, quiz rápido e fotos de torcida." : "Quiz curto, mural de recados e pedido de fotos para lembrança.",
    partyFavor: isFootball ? "Medalha simbólica ou tag de campeão." : "Lembrancinha útil com tag personalizada no tema.",
    costLevel: investment.replace("Quero algo ", "") || "Equilibrado",
    difficultyLevel: simplePlace ? "Baixa a média" : "Média",
    viabilityNote: `Adequado para ${place}. O time deve avaliar prazo, itens especiais e volume de convidados.`
  };
}

function generateExperiencePreview(confirmedTheme, quizAnswers, aiPersonalization, selectedModules = []) {
  const themeName = confirmedTheme.themeName || confirmedTheme.name || "Tema da festa";
  const experienceName = confirmedTheme.experienceName || `Festa ${themeName}`;
  const childName = confirmedTheme.childName || quizAnswers.childName || "";
  const place = confirmedTheme.place || quizAnswers.place || "local a definir";
  const cityRegion = confirmedTheme.cityRegion || quizAnswers.cityRegion || "";
  const refined = aiPersonalization || {};
  const simple = ["Casa", "Salão do condomínio", "Escola"].includes(place);
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
  const priorities = Array.isArray(refined.priorities) ? refined.priorities : [];
  const selectedItemsText = modules.map(module => module.name).join("\n");
  const invitationText = `Você está convidado para celebrar ${childName || "essa fase especial"} em uma festa com clima de ${themeName}. Confirme sua presença e venha viver esse momento com a família.`;

  return {
    experienceName,
    childName,
    eventDate: confirmedTheme.eventDate || quizAnswers.eventDate || "Ainda não sei",
    eventTime: confirmedTheme.eventTime || quizAnswers.eventTime || "Ainda não sei",
    place: cityRegion ? `${place} - ${cityRegion}` : place,
    themeConcept: refined.conceptName || themeName,
    invitationText,
    childStory: confirmedTheme.childStory || `Uma página curta para contar o jeitinho de ${childName || "a criança"}, seus gostos atuais e uma história dessa fase.`,
    colorsText: palette.map(color => color.name).join(", "),
    selectedItemsText,
    guestMessage: "Confirme sua presença, envie uma foto especial e deixe um recado carinhoso para a família.",
    suggestedFlow: [
      "Chegada e acolhimento dos convidados",
      "Fotos e brincadeira principal",
      "Parabéns com momento especial da família",
      "Agradecimento e álbum de memórias depois da festa"
    ].join("\n"),
    conceptSummary: refined.whyFits || refined.concept || `Uma experiência de festa para transformar o tema ${themeName} em convite, organização no dia e memória pós-festa.`,
    palette,
    paletteText: palette.map(color => color.name).join(", "),
    visualStyle: refined.decorIdea || `Visual acolhedor, moderno e fácil de adaptar ao tema ${themeName}.`,
    sections,
    sectionsText: sections.join("\n"),
    interactions,
    interactionsText: interactions.join("\n"),
    activities,
    activitiesText: activities.join("\n"),
    invitationSuggestion: invitationText,
    modulesText: selectedItemsText,
    prioritiesText: priorities.join("\n"),
    complexity: sophisticatedCount ? "Média, com experiências especiais para avaliação" : (simple ? "Baixa a média" : "Média"),
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
  const colorsText = preview.colorsText || paletteText;
  const selectedItemsText = preview.selectedItemsText || preview.modulesText || "";
  const themeConcept = preview.themeConcept || preview.experienceName || "Tema da festa";
  const invitationText = preview.invitationText || preview.invitationSuggestion || "";
  return {
    ...preview,
    paletteText,
    sectionsText,
    interactionsText,
    activitiesText,
    colorsText,
    selectedItemsText,
    themeConcept,
    invitationText
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
  const askedQuestions = refinementQuestions();
  const finalRecommendation = state.finalRecommendation || normalizeFinalRecommendation(aiPersonalization, state.selectedTheme, quizAnswers, refinement, askedQuestions);
  const giftGuide = state.giftGuide || {};
  const preview = normalizePreview(experiencePreview || generateExperiencePreview(confirmedTheme, quizAnswers, aiPersonalization, selectedModules));
  const interactions = previewList(preview, "interactions");
  const sections = previewList(preview, "sections");
  const wantsGiftGuide = modules.some(module => module.id === "giftGuide") || giftGuideHasContent(giftGuide);
  const subject = `Solicitação de avaliação - experiência de festa: ${confirmedTheme.themeName}`;
  const body = [
    "Dados rápidos da festa:",
    `- Nome da criança: ${confirmedTheme.childName || quizAnswers.childName || "Não informado"}`,
    `- Idade: ${confirmedTheme.age || quizAnswers.age || "Não informado"}`,
    `- Data: ${confirmedTheme.eventDate || quizAnswers.eventDate || "Ainda não sei"}`,
    `- Horário: ${confirmedTheme.eventTime || quizAnswers.eventTime || "Ainda não sei"}`,
    `- Local: ${confirmedTheme.place || quizAnswers.place || "Ainda não sei"}`,
    `- Cidade/região: ${confirmedTheme.cityRegion || quizAnswers.cityRegion || "Não informado"}`,
    `- Tamanho estimado: ${quizAnswers.size || "Ainda não sei"}`,
    "",
    "Preferência da família:",
    `- Momento do planejamento: ${quizAnswers.planningStage || "Não informado"}`,
    `- Tema ou interesse: ${quizAnswers.themeInterest || quizAnswers.themeInterestMode || "Ainda não sei"}`,
    `- Caminho/estilo escolhido: ${confirmedTheme.style || state.selectedPath?.name || "Ainda não sei"}`,
    `- O que quer resolver hoje: ${answerText(quizAnswers.agentHelpToday || quizAnswers.mainHelp) || "Não informado"}`,
    `- Faixa de investimento: ${quizAnswers.investmentLevel || "Não informada"}`,
    `- Caminho escolhido: ${state.selectedPath?.name || confirmedTheme.selectedPathName || "Não informado"}`,
    "",
    "Perguntas rápidas feitas pela IA:",
    ...(askedQuestions.length ? askedQuestions.map(question => `- ${question.prompt} ${refinement[question.id] || "Não informado"}`) : ["- Nenhuma pergunta adicional registrada."]),
    "",
    "Recomendação final da IA:",
    `- Conceito: ${finalRecommendation.conceptName}`,
    `- Por que combina: ${finalRecommendation.whyFits}`,
    `- Como executar sem dor de cabeça: ${finalRecommendation.executionPlan}`,
    "",
    "O que priorizar:",
    ...(finalRecommendation.priorities || []).map(item => `- ${item}`),
    "",
    "O que evitar:",
    ...(finalRecommendation.avoid || []).map(item => `- ${item}`),
    "",
    `Tema escolhido: ${confirmedTheme.themeName}`,
    `Nome da experiência: ${confirmedTheme.experienceName}`,
    "",
    "Prévia editável:",
    `- Tema/conceito: ${preview.themeConcept}`,
    `- Texto do convite: ${preview.invitationText}`,
    `- História da criança: ${preview.childStory}`,
    `- Cores da festa: ${preview.colorsText}`,
    `- Mensagem para convidados: ${preview.guestMessage}`,
    `- Roteiro sugerido: ${String(preview.suggestedFlow || "").replace(/\n/g, " / ")}`,
    "",
    "Resumo da experiência:",
    preview.conceptSummary,
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
    `Observações adicionais dos pais: ${confirmedTheme.notes || "Nenhuma por enquanto."}`,
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

function generatePersonalizedChecklist() {
  const answers = state.answers || {};
  const confirmation = currentConfirmation();
  const modules = selectedModuleDetails();
  const finalRecommendation = state.finalRecommendation || generateFinalRecommendation(state.selectedTheme, answers, state.refinementAnswers, refinementQuestions());
  const helpToday = answerText(answers.agentHelpToday);
  const stage = answers.planningStage || "momento a definir";
  const place = answers.place || "local a definir";
  const cityRegion = answers.cityRegion || "região a definir";
  const theme = finalRecommendation.conceptName || confirmation.themeName || answers.themeInterest || "tema a definir";
  const sections = [
    {
      title: "Próximos passos essenciais",
      items: uniqueList([
        stageChecklistItem(stage, theme),
        answers.eventDate ? `Bloquear na agenda a data ${answers.eventDate} e revisar prazos a partir dela.` : "Definir a data para organizar convite, fornecedores e lembretes.",
        `Confirmar o formato da festa em ${place}${cityRegion ? ` (${cityRegion})` : ""}.`,
        `Validar o conceito "${theme}" com a família antes de comprar itens de decoração.`,
        "Separar fotos da criança e 2 ou 3 histórias dessa fase para personalizar o site."
      ])
    },
    {
      title: "Convite, convidados e site",
      items: uniqueList([
        "Reunir data, horário, local e cidade/região para o convite digital.",
        "Montar uma lista inicial de convidados por família.",
        modules.some(module => module.id === "rsvp") ? "Acompanhar confirmações pelo RSVP para evitar surpresa no buffet ou na comida." : "",
        modules.some(module => module.id === "story") ? "Escrever um texto curto sobre o jeitinho da criança para a página especial." : "",
        modules.some(module => module.id === "gallery") ? "Definir quem poderá aprovar fotos antes de aparecerem no site." : ""
      ])
    },
    {
      title: "Para resolver hoje",
      items: helpChecklistItems(helpToday, modules, finalRecommendation)
    },
    {
      title: "Com o local da festa",
      items: venueChecklistItems(place)
    },
    {
      title: "No dia da festa",
      items: uniqueList([
        "Ter uma pessoa responsável por acompanhar confirmações e recados.",
        modules.some(module => module.id === "quiz") ? "Separar 5 perguntas simples para o quiz da criança." : "",
        modules.some(module => module.id === "messages") ? "Lembrar convidados de deixarem recados carinhosos no mural." : "",
        modules.some(module => module.id === "screen") ? "Testar o modo telão com antecedência no equipamento do local." : "",
        "Reservar um momento curto para fotos da família antes do parabéns."
      ])
    }
  ].map(section => ({ ...section, items: section.items.filter(Boolean).slice(0, 8) }));

  return {
    title: `Checklist da festa de ${answers.childName || "sua criança"}`,
    subtitle: `Baseado no planejamento em ${cityRegion}, no momento "${stage}" e no conceito "${theme}".`,
    sections
  };
}

function stageChecklistItem(stage, theme) {
  if (/zero/i.test(stage)) return "Começar definindo data, local, tamanho da festa e um conceito simples para guiar decisões.";
  if (/buffet|espaço/i.test(stage)) return "Pedir ao buffet ou espaço regras de horário, entrada, telão, decoração e envio de informações aos convidados.";
  if (/tema definido/i.test(stage)) return `Transformar o tema "${theme}" em convite, cores, mesa, lembrancinhas e uma brincadeira principal.`;
  if (/detalhes/i.test(stage)) return "Revisar o que falta: convidados, RSVP, lembrancinhas, roteiro do parabéns e fotos.";
  if (/ideias/i.test(stage)) return "Guardar 3 referências de tema e escolher a opção mais fácil de executar no seu local.";
  return "Confirmar as decisões principais antes de avançar para compras e produção.";
}

function helpChecklistItems(helpToday, modules, recommendation) {
  const text = helpToday || "";
  const items = [];
  if (/tema/i.test(text)) items.push(`Refinar o conceito "${recommendation.conceptName}" em cores, convite e decoração.`);
  if (/festa inteira|organizar/i.test(text)) items.push("Criar um cronograma simples: convite, RSVP, fornecedores, compras, montagem e pós-festa.");
  if (/convite|site/i.test(text)) items.push("Separar texto do convite, fotos, história da criança e informações do local.");
  if (/lembrancinhas/i.test(text)) items.push("Escolher lembrancinha útil, fácil de comprar e alinhada ao tema.");
  if (/decoração/i.test(text)) items.push("Priorizar poucos elementos fortes: mesa, painel, cores e cantinho de fotos.");
  if (/bolo|doces/i.test(text)) items.push("Definir referência visual do bolo e quantidade de doces conforme convidados confirmados.");
  if (/recreação|atrações/i.test(text)) items.push("Escolher uma brincadeira principal compatível com idade, espaço e horário.");
  if (/checklist/i.test(text)) items.push("Usar este checklist como base e revisar semanalmente até a festa.");
  modules.filter(module => module.tier !== "standard").slice(0, 4).forEach(module => items.push(`Planejar "${module.name}" com antecedência para caber no prazo.`));
  return uniqueList(items.length ? items : recommendation.priorities || []);
}

function venueChecklistItems(place) {
  if (["Casa", "Salão do condomínio", "Escola"].includes(place)) {
    return [
      "Confirmar regras de entrada, horário, som, limpeza e uso de áreas comuns.",
      "Preparar orientação simples para chegada, portaria ou estacionamento.",
      "Evitar atividades demais se o espaço for pequeno.",
      "Definir onde ficarão bolo, fotos, presentes e crianças brincando."
    ];
  }
  if (["Buffet infantil", "Restaurante", "Espaço de eventos"].includes(place)) {
    return [
      "Alinhar com o local horários de chegada, parabéns, fotos e encerramento.",
      "Confirmar se pode usar telão, música, decoração extra e QR codes.",
      "Verificar quantidade de crianças e adultos para dimensionar comida e equipe.",
      "Combinar quem orienta convidados no dia da festa."
    ];
  }
  return [
    "Confirmar regras básicas do espaço antes de fechar convite e atrações.",
    "Definir orientação de chegada para convidados.",
    "Revisar infraestrutura: banheiro, energia, sombra/cobertura e som."
  ];
}

function downloadChecklistPdf() {
  const checklist = state.submissionResult?.checklist || generatePersonalizedChecklist();
  const html = `
    <!doctype html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(checklist.title)}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #241820; margin: 32px; line-height: 1.45; }
        h1 { color: #b91868; margin-bottom: 6px; }
        h2 { color: #241820; margin-top: 22px; border-bottom: 1px solid #ead8e3; padding-bottom: 6px; }
        li { margin: 7px 0; }
        .note { color: #735d6b; }
        @page { margin: 18mm; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(checklist.title)}</h1>
      <p class="note">${escapeHtml(checklist.subtitle)}</p>
      ${checklist.sections.map(section => `
        <h2>${escapeHtml(section.title)}</h2>
        <ul>${section.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      `).join("")}
      <script>window.onload = () => window.print();</script>
    </body>
    </html>
  `;
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    showToast("Não consegui abrir a janela de PDF. Permita pop-ups para baixar o checklist.");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
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

function answerText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value || "";
}

function arrayOrText(value, fallback = []) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value.split(/\n|;/).map(item => item.trim()).filter(Boolean);
  }
  return Array.isArray(fallback) ? fallback : [fallback].filter(Boolean);
}

function giftGuideHasContent(giftGuide = {}) {
  return ["clothingSize", "shoeSize", "likes", "avoids", "notes"].some(key => String(giftGuide[key] || "").trim());
}

function buildConfirmation(theme, personalization) {
  const refined = personalization || {};
  const themeName = refined.conceptName || refined.name || theme.name || "Tema da festa";
  return {
    childName: state.answers.childName || "",
    themeName,
    experienceName: refined.conceptName ? `Experiência ${refined.conceptName}` : `Experiência ${themeName}`,
    age: state.answers.age || "",
    eventDate: state.answers.eventDate || "",
    eventTime: state.answers.eventTime || "",
    place: state.answers.place || "",
    cityRegion: state.answers.cityRegion || "",
    size: state.answers.size || "",
    planningStage: state.answers.planningStage || "",
    themeInterest: state.answers.themeInterest || state.answers.themeInterestMode || "",
    style: state.selectedPath?.name || state.answers.style || "",
    mainHelp: answerText(state.answers.agentHelpToday || state.answers.mainHelp),
    agentHelpToday: answerText(state.answers.agentHelpToday),
    mustHave: Array.isArray(state.answers.mustHave) ? state.answers.mustHave.join(", ") : "",
    budget: state.answers.investmentLevel || "",
    investmentLevel: state.answers.investmentLevel || "",
    selectedPathName: state.selectedPath?.name || theme.name || "",
    recommendation: refined,
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
    path: theme?.path || "",
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
