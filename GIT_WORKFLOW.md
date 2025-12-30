# Git töövoog

## Põhimõtted

- `main` - tootmisvalmis kood, siia ei push'ita otse
- `develop` - arendusharu, kõik uued funktsioonid ühendatakse siia
- `feature/*` - uute funktsioonide harud
- `fix/*` - vigade parandamise harud

## Töövoog uue funktsiooni jaoks

### 1. Alusta uut funktsiooni

```bash
# Võta viimased muudatused develop'st
git checkout develop
git pull origin develop

# Loo uus haru
git checkout -b feature/sinu-funktsiooni-nimi
```

### 2. Tee muudatused ja commit'i

```bash
# Tee oma muudatused failides...

# Vaata, mis muutus
git status

# Lisa muudetud failid
git add .

# Tee commit
git commit -m "feat: lisa uus funktsioon"
```

**Commit sõnumite formaat:**
- `feat:` - uus funktsioon
- `fix:` - vea parandus
- `docs:` - dokumentatsiooni muudatused
- `style:` - koodi vormindus
- `refactor:` - koodi refaktoreerimine
- `chore:` - muud muudatused (nt build, config)

### 3. Push'i GitHubi

```bash
git push origin feature/sinu-funktsiooni-nimi
```

### 4. Loo Pull Request

1. Mine GitHubi: https://github.com/vaikmarko/klaariks
2. Kliki "Pull requests" → "New pull request"
3. Vali: `develop` ← `feature/sinu-funktsiooni-nimi`
4. Lisa kirjeldus, mida muudeti
5. Oota kinnitust (vähemalt 1 arendaja peab üle vaatama)

### 5. Pärast merge'imist

```bash
# Kui PR on merge'itud, kustuta kohalik haru
git checkout develop
git pull origin develop
git branch -d feature/sinu-funktsiooni-nimi
```

## Töövoog vea parandamiseks

Sama töövoog, aga haru nimi algab `fix/`:

```bash
git checkout develop
git pull origin develop
git checkout -b fix/vea-kirjeldus
# ... tee parandused ...
git add .
git commit -m "fix: paranda vea kirjeldus"
git push origin fix/vea-kirjeldus
# Loo PR develop'st
```

## Tootmisele viimine (develop → main)

Kui `develop` on valmis tootmiseks:

```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

Või loo PR GitHubis: `main` ← `develop`

## Olulised reeglid

✅ **Alati alusta develop'st** - võta viimased muudatused enne uue haru loomist  
✅ **Tee väikeseid commite** - iga commit peaks olema loogiline üksus  
✅ **Kasuta selgeid commit sõnumeid** - järgi `feat:`, `fix:` formaati  
✅ **Oota code review'i** - ära merge'i PR'i ilma kinnitusteta  
✅ **Ära push'i otse main'i või develop'i** - kasuta alati PR'i

## Abi

Kui midagi läheb valesti:

```bash
# Vaata, kus sa oled
git status

# Vaata, mis harud on olemas
git branch

# Vaata commit ajalugu
git log --oneline

# Tõmba viimased muudatused
git pull origin develop
```

