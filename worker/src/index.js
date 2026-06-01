const PREFIX = "/festa-viva";
const SESSION_TTL = 60 * 60 * 24 * 14;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return json({}, 204);
    if (url.pathname.startsWith(`${PREFIX}/api/`)) return handleApi(request, env, url);
    return proxyStatic(request, env, url);
  }
};

async function handleApi(request, env, url) {
  try {
    const path = url.pathname.slice(`${PREFIX}/api`.length);
    if (request.method === "POST" && path === "/chat") {
      return json(await chat(request, env));
    }
    if (request.method === "POST" && path === "/refine") {
      return json(await refine(request, env));
    }
    if (request.method === "POST" && path === "/submit") {
      return json(await submit(request, env));
    }
    return json({ ok: false, error: "Rota nao encontrada." }, 404);
  } catch (error) {
    return json({ ok: false, error: error.message || "Erro inesperado." }, error.status || 500);
  }
}

async function proxyStatic(request, env, url) {
  const upstream = new URL(env.UPSTREAM_ORIGIN || "https://claudiovestevao.github.io");
  upstream.pathname = url.pathname;
  upstream.search = url.search;
  const response = await fetch(upstream.toString(), { method: request.method, headers: request.headers });
  if (response.status !== 404) {
    const headers = new Headers(response.headers);
    headers.set("x-robots-tag", "noindex, nofollow, noarchive");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
  const fallback = new URL(env.UPSTREAM_ORIGIN || "https://claudiovestevao.github.io");
  fallback.pathname = `${PREFIX}/`;
  return fetch(fallback.toString(), { headers: request.headers });
}

async function chat(request, env) {
  if (!env.OPENAI_API_KEY) throw error("OPENAI_API_KEY nao configurada.", 500);
  const input = await readJson(request);
  const sessionId = input.sessionId || id();
  const messages = normalizeMessages(input.messages);
  const currentBrief = input.brief || {};

  const result = await callOpenAI(env, messages, currentBrief);
  const session = {
    sessionId,
    messages: messages.slice(-24),
    brief: result.brief,
    preview: result.preview,
    updatedAt: Date.now()
  };
  await env.FESTA_VIVA_KV.put(`session:${sessionId}`, JSON.stringify(session), { expirationTtl: SESSION_TTL });
  return { ok: true, sessionId, ...result };
}

async function submit(request, env) {
  const input = await readJson(request);
  const submission = {
    id: id(),
    kind: input.kind === "production" ? "production" : "quote",
    buffetCode: text(input.buffetCode, "", 80),
    contact: {
      name: text(input.contact?.name, "", 100),
      email: normalizeEmail(input.contact?.email),
      phone: normalizePhone(input.contact?.phone)
    },
    brief: input.brief || {},
    preview: input.preview || {},
    quizAnswers: input.quizAnswers || {},
    developmentBriefing: {
      subject: text(input.developmentBriefing?.subject, "", 220),
      body: longText(input.developmentBriefing?.body, "", 8000)
    },
    notes: text(input.notes, "", 1000),
    createdAt: Date.now()
  };
  await env.FESTA_VIVA_KV.put(`submission:${submission.id}`, JSON.stringify(submission));

  let emailed = false;
  if (env.RESEND_API_KEY && env.RESEND_FROM_EMAIL) {
    await sendBriefingEmail(env, submission);
    emailed = true;
  }

  return { ok: true, id: submission.id, emailed };
}

async function refine(request, env) {
  if (!env.OPENAI_API_KEY) throw error("OPENAI_API_KEY nao configurada.", 500);
  const input = await readJson(request);
  const themes = await callOpenAIThemeRefine(env, {
    baseTheme: input.baseTheme || {},
    userDescription: text(input.userDescription, "", 1200),
    quizAnswers: input.quizAnswers || {}
  });
  return { ok: true, themes };
}

async function callOpenAI(env, messages, currentBrief) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-5.4-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: systemPrompt() }] },
        { role: "user", content: [{ type: "input_text", text: JSON.stringify({ currentBrief, conversation: messages }, null, 2) }] }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "party_concierge_response",
          strict: true,
          schema: responseSchema()
        }
      },
      max_output_tokens: 1800
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw error(`Falha na OpenAI: ${detail}`, 502);
  }

  const payload = await response.json();
  const text = extractOutputText(payload);
  return JSON.parse(text);
}

async function callOpenAIThemeRefine(env, input) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: themeRefinePrompt() }] },
        { role: "user", content: [{ type: "input_text", text: JSON.stringify(input, null, 2) }] }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "theme_refinement_response",
          strict: true,
          schema: themeRefineSchema()
        }
      },
      max_output_tokens: 1600
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw error(`Falha na OpenAI: ${detail}`, 502);
  }

  const payload = await response.json();
  const parsed = JSON.parse(extractOutputText(payload));
  return parsed.themes || [];
}

function systemPrompt() {
  return `Voce e o Agente Festeiro, um concierge de autosservico para maes e pais criarem sites e convites digitais de festas infantis.

Objetivo:
- Conversar em portugues do Brasil, com tom acolhedor, pratico e encantador.
- Fazer uma pergunta curta por vez, aceitando respostas como "nao sei".
- Quando a pessoa nao souber, sugerir opcoes com base nos interesses da crianca.
- Coletar dados suficientes para o dev montar um site personalizado em ate 48h.
- Se o buffet ja pagou, tratar como "enviar para producao"; se nao, tratar como "solicitar orcamento".

Produto:
- Convite visual personalizado.
- RSVP por familia com adultos, criancas pagantes, menores de 5 e bebes.
- Upload de fotos com aprovacao dos pais.
- Quiz, mural, capsula do tempo, galeria, modo telao e album pos-festa.
- Pais/admins podem gerenciar aprovacoes.

Regras:
- Nunca prometa que o site fica pronto automaticamente. O correto e: "envio para producao em ate 48h".
- Nao use nomes de personagens protegidos como se fossem licenciados. Use "inspirado no tema" quando apropriado.
- Sempre mantenha privacidade como vantagem: fotos e mensagens so aparecem depois da aprovacao.
- Gere uma resposta JSON estrita no schema pedido.
- Atualize o briefing a cada resposta.
- O preview deve ficar cada vez mais especifico conforme a conversa evolui.`;
}

function themeRefinePrompt() {
  return `Voce e um consultor de festas infantis no Brasil.

Tarefa:
- Gerar no maximo 3 temas refinados a partir do tema base, respostas do questionario e uma frase sobre a crianca.
- Ser pratico, acolhedor e objetivo.
- Priorizar ideias possiveis de executar no Brasil.
- Adaptar a idade e ao local.
- Se o orcamento for baixo, evitar ideias caras.
- Se for em escola, casa ou condominio, sugerir execucao simples.
- Nao assumir genero.
- Nao pedir nome completo nem dados sensiveis.
- Evitar depender de personagem licenciado; quando necessario, sugerir uma direcao inspirada, nao oficial.
- Nao sugerir ideias mirabolantes.

Responda somente no JSON do schema.`;
}

function responseSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["reply", "quickReplies", "stage", "completeness", "readyForQuote", "readyForProduction", "missing", "brief", "preview"],
    properties: {
      reply: { type: "string" },
      quickReplies: { type: "array", items: { type: "string" }, maxItems: 5 },
      stage: { type: "string" },
      completeness: { type: "number" },
      readyForQuote: { type: "boolean" },
      readyForProduction: { type: "boolean" },
      missing: { type: "array", items: { type: "string" } },
      brief: {
        type: "object",
        additionalProperties: false,
        required: ["childName", "age", "partyDate", "partyTime", "venue", "city", "theme", "colors", "tone", "interests", "features", "admins", "guestPlan", "buffet", "privacy", "urgency", "notes"],
        properties: {
          childName: { type: "string" },
          age: { type: "string" },
          partyDate: { type: "string" },
          partyTime: { type: "string" },
          venue: { type: "string" },
          city: { type: "string" },
          theme: { type: "string" },
          colors: { type: "array", items: { type: "string" } },
          tone: { type: "string" },
          interests: { type: "array", items: { type: "string" } },
          features: { type: "array", items: { type: "string" } },
          admins: { type: "array", items: { type: "string" } },
          guestPlan: { type: "string" },
          buffet: { type: "string" },
          privacy: { type: "string" },
          urgency: { type: "string" },
          notes: { type: "string" }
        }
      },
      preview: {
        type: "object",
        additionalProperties: false,
        required: ["siteTitle", "subtitle", "inviteText", "whatsappMessage", "visualDirection", "suggestedSections", "quizQuestions", "capsulePrompt", "productionSummary"],
        properties: {
          siteTitle: { type: "string" },
          subtitle: { type: "string" },
          inviteText: { type: "string" },
          whatsappMessage: { type: "string" },
          visualDirection: { type: "string" },
          suggestedSections: { type: "array", items: { type: "string" } },
          quizQuestions: { type: "array", items: { type: "string" } },
          capsulePrompt: { type: "string" },
          productionSummary: { type: "string" }
        }
      }
    }
  };
}

function themeRefineSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["themes"],
    properties: {
      themes: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "concept", "palette", "decorIdea", "guestInteraction", "partyFavor", "costLevel", "difficultyLevel", "viabilityNote"],
          properties: {
            name: { type: "string" },
            concept: { type: "string" },
            palette: { type: "array", items: { type: "string" }, maxItems: 5 },
            decorIdea: { type: "string" },
            guestInteraction: { type: "string" },
            partyFavor: { type: "string" },
            costLevel: { type: "string" },
            difficultyLevel: { type: "string" },
            viabilityNote: { type: "string" }
          }
        }
      }
    }
  };
}

async function sendBriefingEmail(env, submission) {
  const fromName = env.RESEND_FROM_NAME || "Agente Festeiro";
  const from = `${fromName} <${env.RESEND_FROM_EMAIL}>`;
  const to = env.BRIEFING_TO_EMAIL || "contato@claudiocode.dev";
  const subject = submission.developmentBriefing?.subject || (submission.kind === "production"
    ? `Producao 48h: ${submission.brief.childName || "nova festa"}`
    : `Orcamento: ${submission.brief.childName || "nova festa"}`);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html: emailHtml(submission),
      text: JSON.stringify(submission, null, 2)
    })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw error(`Briefing salvo, mas email falhou: ${detail}`, 502);
  }
}

function emailHtml(submission) {
  const brief = submission.brief || {};
  const preview = submission.preview || {};
  const developmentBriefing = submission.developmentBriefing || {};
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#24151c">
    <h1>${submission.kind === "production" ? "Enviar para producao" : "Solicitar orcamento"}</h1>
    <p><b>ID:</b> ${submission.id}</p>
    <p><b>Contato:</b> ${escapeHtml(submission.contact.name)} | ${escapeHtml(submission.contact.email)} | ${escapeHtml(submission.contact.phone)}</p>
    <p><b>Buffet/codigo:</b> ${escapeHtml(submission.buffetCode || brief.buffet)}</p>
    <h2>Briefing para avaliacao</h2><pre style="white-space:pre-wrap;background:#171018;color:#fff;padding:16px;border-radius:8px">${escapeHtml(developmentBriefing.body)}</pre>
    <h2>Resumo</h2><p>${escapeHtml(preview.productionSummary || preview.conceptSummary)}</p>
    <h2>Briefing</h2><pre style="white-space:pre-wrap;background:#fff4f8;padding:16px;border-radius:8px">${escapeHtml(JSON.stringify(brief, null, 2))}</pre>
    <h2>Preview</h2><pre style="white-space:pre-wrap;background:#f6f7ff;padding:16px;border-radius:8px">${escapeHtml(JSON.stringify(preview, null, 2))}</pre>
  </body></html>`;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages.slice(-30).map(message => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: text(message.content, "", 1600)
  })).filter(message => message.content);
}

function extractOutputText(payload) {
  if (payload.output_text) return payload.output_text;
  const parts = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.text) parts.push(content.text);
    }
  }
  return parts.join("\n");
}

async function readJson(request) {
  try { return await request.json(); } catch { return {}; }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type"
    }
  });
}

function text(value, fallback = "", max = 200) {
  return String(value ?? fallback ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

function longText(value, fallback = "", max = 4000) {
  return String(value ?? fallback ?? "").trim().slice(0, max);
}

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email.slice(0, 180) : "";
}

function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return withCountry.length >= 12 && withCountry.length <= 13 ? withCountry : "";
}

function id() {
  return `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
}

function error(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}
