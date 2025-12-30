# Koostöö juhised

> **Git töövoog:** Detailne samm-sammuline juhis on [GIT_WORKFLOW.md](GIT_WORKFLOW.md) failis.

## Commit sõnumite formaat

Kasutame **Conventional Commits** formaati:

- `feat:` - uus funktsioon
- `fix:` - vea parandus
- `docs:` - dokumentatsiooni muudatused
- `style:` - koodi vormindus (ei mõjuta funktsionaalsust)
- `refactor:` - koodi refaktoreerimine
- `test:` - testide lisamine või muutmine
- `chore:` - muud muudatused (nt build, config)

Näide:
```
feat: add expense tracking component
fix: resolve date formatting issue in dashboard
docs: update README with setup instructions
```

## Koodi standardid

### TypeScript
- Kasuta tüüpe kõikjal
- Välti `any` tüüpi
- Järgi projektis olevaid nimetamise konventsioone

### React komponendid
- Kasuta funktsionaalseid komponente
- Järgi komponentide struktuuri projektis
- Nime failid PascalCase'iga (nt `UserProfile.tsx`)

### Failide struktuur
- Komponendid: `components/`
- Teenused: `services/`
- Tüübid: `types.ts`
- Konstantid: `constants.ts`

> **Keskkonna seadistamine:** Vaata [README.md](README.md) faili "Arenduskeskkonna seadistamine" sektsiooni.

## Enne PR-i saatmist

- [ ] Kood kompileerub ilma vigadeta (`npm run build`)
- [ ] Kood on vormindatud (`npm run format`)
- [ ] Lintimine läbib (`npm run lint`)
- [ ] Oled testinud muudatused kohalikult
- [ ] Commit sõnumid järgivad konventsiooni

