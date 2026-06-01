# Festa Viva Concierge

Assistente mobile-first para pais e maes escolherem ou refinarem o tema da festa infantil e enviarem um briefing estruturado para avaliacao do time de desenvolvimento.

Fluxo:

1. Tela inicial minimalista com CTA para comecar.
2. Questionario guiado por chips: idade, local, tamanho, estilo, interesses, restricoes e orcamento.
3. Geracao de 3 a 5 sugestoes de tema com custo e dificuldade estimados.
4. Refinamento com IA opcional, em conversa livre curta.
5. Confirmacao editavel do tema final.
6. Escolha transparente de modulos: incluidos no plano contratado vs avaliados pelo time.
7. Previa conceitual da experiencia: visual, secoes, interacoes, atividades e pontos de atencao.
8. Briefing para avaliacao com copia, edicao e envio por email.

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
