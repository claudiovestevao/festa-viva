# Festa Viva Concierge

Assistente mobile-first para pais e maes planejarem uma festa especial com praticidade, escolherem ou refinarem o tema e enviarem os dados confirmados para criacao ou avaliacao do time.

## Tese do produto

O Agente Festeiro nao deve competir como "convite digital simples". Ele combina planejamento, informacoes para convidados e memorias da festa em uma experiencia modular.

Mitigacoes principais:

- Personalizacao manual demais: usar temas-base, blocos prontos, prompts reaproveitaveis e revisao humana focada.
- IA como enfeite: gerar entregaveis praticos como convite, checklist, mensagens, lembretes, roteiro, quiz e briefing.
- Preco baixo demais: manter plano de entrada e concentrar margem em planos completos, experiencias especiais e pacotes recorrentes para buffets.
- Concorrencia de convite digital: vender experiencia da festa antes, durante e depois, nao apenas um link com RSVP.
- Temas impossiveis ou genericos demais: sugerir no maximo 3 opcoes a partir de um catalogo fechado de temas infantis comuns e executaveis.

Fluxo:

1. Tela inicial minimalista com CTA para comecar.
2. Questionario guiado por chips: idade, local, tamanho, data, estilo, interesses, restricoes e orcamento.
3. Geracao de 3 sugestoes de tema com custo e dificuldade estimados.
4. Refinamento com IA opcional, com perguntas rapidas, pistas afetivas e uma recomendacao final.
5. Confirmacao editavel do tema final.
6. Escolha de pacote: Plano Essencial, Plano Mais Escolhido ou Plano Experiencias Especiais.
7. Previa conceitual editavel: conceito, visual, secoes, interacoes, atividades e pontos de atencao.
8. Confirmacao dos dados para ajustes finais com detalhes da crianca, guia de presentes, copia, edicao e envio por email.

## Rotas

- App: `https://claudiocode.dev/festa-viva/`
- API chat: `POST /festa-viva/api/chat`
- API refinamento: `POST /festa-viva/api/refine`
- API envio: `POST /festa-viva/api/submit`

## Componentes frontend

- `MinimalHome`
- `ChatThemeAssistant`
- `ChatQuestion`
- `OptionChip`
- `ThemeSuggestionCard`
- `AIPersonalizationPanel`
- `ThemeConfirmationStep`
- `FeatureSelectionStep`
- `ExperiencePreview`
- `DevelopmentBriefingPreview`
- `EmailReviewStep`

## Secrets

```powershell
npx.cmd wrangler secret put OPENAI_API_KEY
npx.cmd wrangler secret put RESEND_API_KEY
npx.cmd wrangler secret put RESEND_FROM_EMAIL
```
