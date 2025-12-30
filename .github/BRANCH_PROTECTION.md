# GitHub Branch Protection Seadistus

## Kuidas seadistada branch protection reeglid (Rulesets)

1. Mine GitHub repostooriumisse: https://github.com/vaikmarko/klaariks
2. Mine **Settings** → **Rules** → **Rulesets**
3. Kliki **New ruleset** nuppu

## `main` haru ruleset

### Põhiseaded:
- **Ruleset Name:** `main-branch-protection`
- **Enforcement status:** `Active`
- **Target branches:** 
  - Kliki "Add target" → vali "Branch name" → sisesta `main`

### Reeglid (Rules):
1. **Restrict deletions** - ✅ Luba
2. **Restrict force pushes** - ✅ Luba
3. **Require pull request before merging:**
   - ✅ Luba
   - **Required approvals:** `1`
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require conversation resolution before merging
4. **Require status checks to pass before merging:**
   - ✅ Luba
   - **Required status checks:** `lint-and-build`
   - ✅ Require branches to be up to date before merging
5. **Require linear history** - ✅ Luba (valikuline, kuid soovitatav)

### Bypass list:
- Jäta tühjaks (ei luba ühelgi rollil/meeskonnal bypass'ida)

## `develop` haru ruleset

### Põhiseaded:
- **Ruleset Name:** `develop-branch-protection`
- **Enforcement status:** `Active`
- **Target branches:**
  - Kliki "Add target" → vali "Branch name" → sisesta `develop`

### Reeglid (Rules):
1. **Restrict deletions** - ✅ Luba
2. **Restrict force pushes** - ✅ Luba
3. **Require pull request before merging:**
   - ✅ Luba
   - **Required approvals:** `1`
4. **Require status checks to pass before merging:**
   - ✅ Luba
   - **Required status checks:** `lint-and-build`
   - ✅ Require branches to be up to date before merging

### Bypass list:
- Võib lisada meeskonna või administraatoreid, kui vaja (valikuline)

## Mõju

Need reeglid tagavad, et:
- Kõik muudatused läbivad code review
- Kood kompileerub ja lintimine läbib enne merge'imist
- `main` haru on alati stabiilne ja tootmisvalmis
- Keelatud on force push ja branch kustutamine

