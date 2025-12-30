# GitHub Branch Protection Seadistus

## Kuidas seadistada branch protection reeglid

1. Mine GitHub repostooriumisse: https://github.com/vaikmarko/klaariks
2. Mine **Settings** → **Branches**
3. Lisa reeglid järgmistele harudele:

### `main` haru

- ✅ Require a pull request before merging
  - Require approvals: **1**
  - Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
  - Require branches to be up to date before merging
  - Status checks: **lint-and-build**
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings

### `develop` haru

- ✅ Require a pull request before merging
  - Require approvals: **1**
- ✅ Require status checks to pass before merging
  - Status checks: **lint-and-build**
- ❌ Do not allow bypassing (võib jätta lubatud arendajatele)

## Mõju

Need reeglid tagavad, et:
- Kõik muudatused läbivad code review
- Kood kompileerub ja lintimine läbib enne merge'imist
- `main` haru on alati stabiilne ja tootmisvalmis

