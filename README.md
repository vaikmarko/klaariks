<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Klaariks

AI-põhine finantshalduse rakendus.

View your app in AI Studio: https://ai.studio/apps/drive/14Gf8I86qUuYDmGKJQ8jOEtBCvzVpT-5t

## Arenduskeskkonna seadistamine

### Eeltingimused

- Node.js (versioon 18 või uuem)
- npm või yarn

### Paigaldamine

1. Klooni repostoorium:
   ```bash
   git clone https://github.com/vaikmarko/klaariks.git
   cd klaariks
   ```

2. Installi sõltuvused:
   ```bash
   npm install
   ```

3. Kopeeri keskkonna fail:
   ```bash
   cp .env.example .env.local
   ```

4. Lisa oma `GEMINI_API_KEY` `.env.local` faili

5. Käivita arendusserver:
   ```bash
   npm run dev
   ```

## Arendus

### Saadaolevad käsud

- `npm run dev` - käivitab arendusserveri
- `npm run build` - ehitab tootmisversiooni
- `npm run preview` - eelvaade tootmisversioonist
- `npm run lint` - kontrollib koodi kvaliteeti
- `npm run format` - vormindab koodi

### Projekti struktuur

```
klaariks/
├── components/      # React komponendid
├── services/        # API ja teenuste loogika
├── types.ts         # TypeScript tüübid
├── constants.ts     # Konstantid
└── ...
```

## Koostöö

Vaata [CONTRIBUTING.md](CONTRIBUTING.md) faili koostöö juhiste jaoks (Git töövoog, koodi standardid, commit formaat).
