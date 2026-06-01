# Festa Viva Concierge

Chatbot de autosservico para pais/maes criarem um briefing de festa infantil.

Fluxo:

1. Mae/pai conversa com o agente.
2. Agente coleta dados, aceita "nao sei" e sugere caminhos.
3. Preview do convite, mensagem de WhatsApp, quiz, capsula e features aparecem ao vivo.
4. Cliente solicita orcamento ou envia para producao em ate 48h.
5. Dev recebe briefing estruturado por email e o registro fica no Cloudflare KV.

## Rotas

- App: `https://claudiocode.dev/festa-viva/`
- API chat: `POST /festa-viva/api/chat`
- API envio: `POST /festa-viva/api/submit`

## Secrets

```powershell
npx.cmd wrangler secret put OPENAI_API_KEY
npx.cmd wrangler secret put RESEND_API_KEY
npx.cmd wrangler secret put RESEND_FROM_EMAIL
```

