# Koostöö juhised

## Git töövoog

### Branching strateegia

Projektis kasutame **Git Flow** lähenemist:

- `main` - põhiharu, mis sisaldab ainult tootmisvalmis koodi
- `develop` - arendusharu, kus kõik uued funktsioonid ühendatakse
- `feature/*` - uute funktsioonide harud (nt `feature/user-authentication`)
- `fix/*` - vigade parandamise harud (nt `fix/login-bug`)
- `hotfix/*` - kiire parandus tootmisele (nt `hotfix/security-patch`)

### Töövoog

1. **Uue funktsiooni alustamine:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Muudatuste commit'imine:**
   - Tee väikeseid, loogilisi commite
   - Kasuta selgeid commit sõnumeid
   - Näide: `feat: add user authentication`
   - Näide: `fix: resolve login validation error`

3. **Muudatuste push'imine:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Pull Request'i loomine:**
   - Loo PR GitHubis `develop` haru suunas
   - Lisa kirjeldus, mida muudeti ja miks
   - Oota kinnitust enne merge'imist

5. **Code review:**
   - Vähemalt üks teine arendaja peab PR-i üle vaatama
   - Kui on märkused, paranda need enne merge'imist

### Commit sõnumite formaat

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

## Keskkonna seadistamine

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

## Enne PR-i saatmist

- [ ] Kood kompileerub ilma vigadeta (`npm run build`)
- [ ] Kood on vormindatud (`npm run format`)
- [ ] Lintimine läbib (`npm run lint`)
- [ ] Oled testinud muudatused kohalikult
- [ ] Commit sõnumid järgivad konventsiooni

