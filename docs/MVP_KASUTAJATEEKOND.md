# KLAARIKS MVP - Kasutajateekond ja Integratsioonid

## 🎯 MVP Eesmärk (1 kuu)

Saada üles töötav teenus, kus:
1. Kasutaja saab registreeruda oma ettevõttega
2. Ettevõtte andmed tulevad automaatselt Äriregistrist
3. Lihtne pangaühendus (alguses manuaalne CSV import)
4. Põhilised finantsvaated toimivad

---

## 📋 Kasutajateekonna Faasid

### FAAS 1: Registreerimine ja Ettevõtte Sidumine (MVP)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. KASUTAJA SISSELOGIMINE                                      │
│     ├── ID-kaart / Mobiil-ID / Smart-ID                         │
│     └── Saame: isikukood, nimi                                  │
│                                                                 │
│  2. ETTEVÕTTE VALIMINE                                          │
│     ├── Äriregister API päring isikukoodi järgi                 │
│     ├── Kuvatakse: ettevõtted kus isik on seotud                │
│     │   - Juhatuse liige                                        │
│     │   - Osanik                                                │
│     │   - Prokurist                                             │
│     └── Kasutaja valib ettevõtte                                │
│                                                                 │
│  3. ETTEVÕTTE ANDMETE KINNITUS                                  │
│     ├── Ärinimi                                                 │
│     ├── Registrikood                                            │
│     ├── KMKR number (kui käibemaksukohuslane)                   │
│     ├── Aadress                                                 │
│     └── Tegevusalad (EMTAK koodid)                              │
│                                                                 │
│  4. TEENUSE TINGIMUSED                                          │
│     ├── Kasutustingimuste aktsepteerimine (checkbox)            │
│     ├── Privaatsuspoliitika (checkbox)                          │
│     └── (Hiljem: DigiDoc allkiri)                               │
│                                                                 │
│  5. TERE TULEMAST!                                              │
│     └── Dashboard                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Äriregistri Integratsioon

### Andmete Pärimine

**Allikas:** Registrite ja Infosüsteemide Keskus (RIK)
**Teenus:** Äriregistri avalikud andmed / X-tee teenused

### Variant A: Avalik Otsing (MVP jaoks piisav)

```typescript
// Registrikoodi järgi otsimine
GET https://ariregister.rik.ee/est/company/{registrikood}/general

// Tagastab:
{
  "nimi": "Muaree OÜ",
  "registrikood": "12345678",
  "oiguslikkVorm": "Osaühing",
  "staatus": "Registrisse kantud",
  "registreerimisKp": "2020-01-15",
  "aadress": "Tallinn, Kesklinna linnaosa, Narva mnt 5",
  "kmkrNr": "EE123456789",
  "tegevusalad": [
    { "emtak": "62011", "nimetus": "Programmeerimine" }
  ]
}
```

### Variant B: Isikukoodi järgi seotud ettevõtted (X-tee)

```typescript
// X-tee päring - nõuab liitumislepingut
// Tagastab kõik ettevõtted, kus isik on:
// - Juhatuse liige
// - Osanik (osalus > 0%)
// - Prokurist
// - Likvideerija

interface SeotudEttevote {
  registrikood: string;
  nimi: string;
  roll: 'juhatuse_liige' | 'osanik' | 'prokurist' | 'likvideerija';
  alates: string;
  osalusProtsent?: number;
}
```

### MVP Lahendus (ilma X-teeta)

Kuna X-tee liitumine võtab aega (~2-4 nädalat), siis MVP jaoks:

1. **Kasutaja sisestab registrikoodi käsitsi**
2. **Valideerime avalikust registrist**
3. **Kasutaja kinnitab, et on seotud isik**
4. **Hilisemas faasis:** automaatne kontroll X-tee kaudu

```typescript
// MVP onboarding flow
const onboardingSteps = [
  'smart_id_login',      // Saame isikukoodi
  'enter_reg_code',      // Kasutaja sisestab
  'verify_company',      // Äriregistri päring
  'confirm_role',        // "Olen juhatuse liige / volitatud isik"
  'accept_terms',        // Tingimused
  'setup_complete'       // Valmis!
];
```

---

## 📝 Lepingud ja Allkirjad

### MVP Faas (Lihtsustatud)

| Dokument | Allkirjastamine | Märkused |
|----------|-----------------|----------|
| Kasutustingimused | Checkbox | "Nõustun tingimustega" |
| Privaatsuspoliitika | Checkbox | GDPR nõuded |
| Andmetöötluse nõusolek | Checkbox | Pangaandmete jaoks |

### Faas 2 (Täielik)

| Dokument | Allkirjastamine | Märkused |
|----------|-----------------|----------|
| Teenuse leping | DigiDoc | Juriidiliselt siduv |
| Volikiri EMTA-le | DigiDoc | Maksuandmete pärimiseks |
| Volikiri pangale | Panga süsteemis | Open Banking nõusolek |
| Andmetöötleja leping | DigiDoc | B2B klientidele |

---

## 🔐 Volikirjad ja Volitused

### EMTA (Maksu- ja Tolliamet)

**Mis on vaja:** Õigus pärida ja esitada andmeid ettevõtte nimel

**Protsess:**
1. Ettevõtte esindaja logib sisse e-MTA-sse
2. Minu Seaded → Volitused → Lisa volitus
3. Sisestab KLAARIKS OÜ registrikoodi
4. Valib õigused:
   - Deklaratsioonide vaatamine
   - Deklaratsioonide esitamine
   - Maksukonto info

**Alternatiiv:** Digitaalselt allkirjastatud volikiri
- Vorm: vabas vormis, peab sisaldama:
  - Volitaja andmed (ettevõte + esindaja)
  - Volitatu andmed (KLAARIKS OÜ)
  - Volituse ulatus
  - Kehtivusaeg
  - Allkirjad (DigiDoc)

```
VOLIKIRI

[Ettevõtte nimi], registrikood [XXXXXXXX], 
esindaja [Nimi], isikukood [XXXXXXXXXXX]

volitab

KLAARIKS OÜ, registrikood [XXXXXXXX]

järgmistes toimingutes:
- Maksudeklaratsioonide andmete pärimine
- Maksukonto seisu pärimine
- [Muud toimingud]

Volitus kehtib: [kuupäev] kuni [kuupäev] / tähtajatult

[Digitaalallkirjad]
```

### Pangad (Open Banking - PSD2)

**Eestis tegutsevad pangad ja nende lahendused:**

| Pank | Lahendus | Liitumisaeg | Märkused |
|------|----------|-------------|----------|
| **LHV** | LHV Connect API | ~2 nädalat | Lihtne liitumine |
| **Swedbank** | Open Banking API | ~4 nädalat | Sandbox olemas |
| **SEB** | SEB API | ~4 nädalat | Korporatiivne protsess |
| **Coop** | Coop API | ~4 nädalat | Väiksem kasutajaskond |

**MVP Lahendus (ilma PSD2 litsentsita):**

1. **Manuaalne eksport** - kasutaja laeb alla CSV/PDF
2. **KLAARIKS parsib** - automaatne töötlus
3. **Hiljem:** AISP litsents või partnerlus

**PSD2 Integratsioon (Faas 2):**

```typescript
// Kasutaja annab nõusoleku panga süsteemis
const consentFlow = {
  1: 'Redirect pangalehele',
  2: 'Kasutaja autendib (Smart-ID)',
  3: 'Kasutaja kinnitab ligipääsu',
  4: 'Pank tagastab access_token',
  5: 'KLAARIKS pärib andmeid (90 päeva)'
};

// Consent kehtib 90 päeva, siis uuendamine
```

### Raamatupidamisteenused (valikuline)

Kui klient soovib, et KLAARIKS edastaks andmeid raamatupidajale:

**Vajalik:**
- Kliendi nõusolek (checkbox või DigiDoc)
- Raamatupidaja e-posti kinnitus
- Andmeedastuse leping

---

## 🛠️ MVP Tehniline Implementatsioon

### Onboarding Komponendi Uuendamine

```typescript
// types.ts - lisa uued tüübid
export interface OnboardingState {
  step: 'login' | 'company' | 'verify' | 'terms' | 'bank' | 'complete';
  user: {
    idCode: string;
    name: string;
    authMethod: 'smart_id' | 'mobile_id' | 'id_card';
  } | null;
  company: CompanyProfile | null;
  consents: {
    terms: boolean;
    privacy: boolean;
    dataProcessing: boolean;
  };
}

export interface CompanyProfile {
  name: string;
  regCode: string;
  legalForm: string;
  status: string;
  vatNumber?: string;
  address: string;
  activities: Array<{
    emtak: string;
    name: string;
  }>;
}
```

### Äriregistri Service

```typescript
// services/businessRegistryService.ts

const ARIREGISTER_BASE = 'https://ariregister.rik.ee';

export interface CompanySearchResult {
  found: boolean;
  company?: {
    name: string;
    regCode: string;
    legalForm: string;
    status: string;
    vatNumber?: string;
    address: string;
    registrationDate: string;
    activities: Array<{ emtak: string; name: string }>;
  };
  error?: string;
}

export async function searchCompanyByRegCode(
  regCode: string
): Promise<CompanySearchResult> {
  // MVP: Simuleeritud vastus
  // TODO: Integreeri päris API-ga
  
  // Valideeri registrikoodi formaat (8 numbrit)
  if (!/^\d{8}$/.test(regCode)) {
    return {
      found: false,
      error: 'Registrikood peab olema 8-kohaline number'
    };
  }

  // Päris implementatsioon:
  // const response = await fetch(`${ARIREGISTER_BASE}/est/company/${regCode}/general`);
  // const data = await response.json();
  
  return {
    found: true,
    company: {
      name: 'Demo Ettevõte OÜ',
      regCode,
      legalForm: 'Osaühing',
      status: 'Registrisse kantud',
      vatNumber: `EE${regCode}`,
      address: 'Tallinn, Kesklinna linnaosa',
      registrationDate: '2020-01-15',
      activities: [
        { emtak: '62011', name: 'Programmeerimine' }
      ]
    }
  };
}
```

---

## 📅 MVP Ajakava (4 nädalat)

### Nädal 1: Põhistruktuur
- [ ] Autentimise UI (Smart-ID mock)
- [ ] Äriregistri päring (simuleeritud)
- [ ] Onboarding flow

### Nädal 2: Andmete Import
- [ ] CSV/PDF parsija pangaväljavõtetele
- [ ] Andmete valideerimine
- [ ] Põhilised vaated

### Nädal 3: Dashboard ja Ülevaated
- [ ] Rahavoo graafikud
- [ ] Kulude kategoriseerimine
- [ ] AI assistendi baas

### Nädal 4: Testimine ja Polish
- [ ] End-to-end testimine
- [ ] UI/UX parandused
- [ ] Dokumentatsioon
- [ ] Demo-ready versioon

---

## 🔮 Järgmised Faasid

### Faas 2 (2-3 kuud)
- [ ] X-tee liitumine (Äriregister)
- [ ] PSD2 pangaintegratsioon
- [ ] DigiDoc allkirjastamine
- [ ] EMTA API integratsioon

### Faas 3 (3-6 kuud)
- [ ] Automaatne raamatupidamine
- [ ] Maksudeklaratsioonide genereerimine
- [ ] Arvete e-saatmine
- [ ] Mobiilirakendus

---

## ❓ Avatud Küsimused

1. **X-tee liitumine** - Kas alustame protsessi paralleelselt?
2. **PSD2 litsents** - Oma litsents vs partnerlus (nt Nordigen)?
3. **Autentimine** - Oma lahendus vs SK ID Solutions teenus?
4. **Hosting** - Eesti serverid (andmekaitse)?

---

## 📚 Kasulikud Lingid

- [Äriregistri API dokumentatsioon](https://ariregister.rik.ee/api)
- [e-MTA arendajale](https://www.emta.ee/arendajale)
- [SK ID Solutions](https://www.skidsolutions.eu/)
- [LHV Connect](https://partners.lhv.ee/)
- [Swedbank Open Banking](https://developer.swedbank.com/)
- [X-tee liitumine](https://www.ria.ee/riigi-infosusteem/x-tee)

---

*Viimati uuendatud: Jaanuar 2026*
