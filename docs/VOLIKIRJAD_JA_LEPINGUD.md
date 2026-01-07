# Volikirjad ja Lepingud - Detailne Ülevaade

## 🎯 Kokkuvõte: Mida Allkirjastada ja Kuhu Esitada

### MVP Faasis (minimaalne)

| # | Dokument | Allkiri | Kuhu | Millal |
|---|----------|---------|------|--------|
| 1 | Kasutustingimused | Checkbox | KLAARIKS süsteem | Registreerimisel |
| 2 | Privaatsuspoliitika | Checkbox | KLAARIKS süsteem | Registreerimisel |
| 3 | Andmetöötluse nõusolek | Checkbox | KLAARIKS süsteem | Registreerimisel |

### Täisversioonis (Faas 2+)

| # | Dokument | Allkiri | Kuhu | Millal |
|---|----------|---------|------|--------|
| 1 | Teenuse leping | DigiDoc | KLAARIKS | Registreerimisel |
| 2 | Volikiri EMTA-le | DigiDoc | e-MTA või KLAARIKS | Maksuinfo jaoks |
| 3 | Pangaühenduse nõusolek | Panga süsteem | Pank | Andmete importimisel |
| 4 | Raamatupidaja volikiri | DigiDoc | KLAARIKS | Valikuline |

---

## 📋 1. Kasutustingimused (Terms of Service)

### Sisu

```markdown
KLAARIKS KASUTUSTINGIMUSED

1. TEENUSE KIRJELDUS
   - KLAARIKS on finantsülevaate platvorm
   - Pakume: arvestust, ülevaateid, simulatsioone
   - EI paku: juriidilist ega maksunõustamist

2. KASUTAJA KOHUSTUSED
   - Esitada õiged andmed
   - Hoida ligipääsuandmeid turvaliselt
   - Mitte jagada kontot kolmandatele isikutele

3. TEENUSEPAKKUJA KOHUSTUSED
   - Andmete turvaline säilitamine
   - Teenuse kättesaadavus (99%)
   - Teavitamine muudatustest

4. VASTUTUSE PIIRAMINE
   - KLAARIKS ei vastuta maksunõustamise eest
   - Kasutaja vastutab oma otsuste eest
   - Maksimaalne kahju: teenustasu tagastamine

5. LÕPETAMINE
   - Kasutaja võib igal ajal lõpetada
   - Andmete eksport 30 päeva jooksul
   - Andmete kustutamine GDPR alusel

6. VAIDLUSTE LAHENDAMINE
   - Eesti seadused
   - Harju Maakohus
```

### Implementatsioon

```typescript
// components/TermsConsent.tsx
interface ConsentState {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}
```

---

## 📋 2. Privaatsuspoliitika (Privacy Policy)

### GDPR Nõuded

```markdown
PRIVAATSUSPOLIITIKA

1. VASTUTAV TÖÖTLEJA
   KLAARIKS OÜ
   Registrikood: XXXXXXXX
   E-post: privacy@klaariks.ee

2. TÖÖDELDAVAD ANDMED
   - Isikuandmed: nimi, isikukood, e-post
   - Ettevõtte andmed: registrikood, finantsandmed
   - Pangaandmed: kontoväljavõtted (kui ühendatud)
   - Kasutusandmed: logid, sessioonid

3. TÖÖTLEMISE EESMÄRK
   - Teenuse osutamine
   - Klienditugi
   - Teenuse arendamine (anonümiseeritult)

4. ANDMETE SÄILITAMINE
   - Aktiivsed andmed: teenuse kehtivuse ajal
   - Finantsandmed: 7 aastat (seadusest)
   - Logid: 1 aasta

5. KASUTAJA ÕIGUSED
   - Juurdepääs oma andmetele
   - Andmete parandamine
   - Andmete kustutamine (õigus olla unustatud)
   - Andmete ülekandmine
   - Töötlemise piiramine
   - Vastuväite esitamine

6. KONTAKT
   E-post: privacy@klaariks.ee
   Vastame 30 päeva jooksul
```

---

## 📋 3. EMTA Volikiri

### Variant A: e-MTA kaudu (soovituslik)

**Protsess kasutaja jaoks:**

1. Logi sisse [e-MTA portaali](https://www.emta.ee/e-mta)
2. Mine: **Seaded** → **Volituste haldamine**
3. Kliki: **Lisa uus volitus**
4. Sisesta volitatava andmed:
   - Registrikood: KLAARIKS OÜ reg.kood
   - Nimi: KLAARIKS OÜ
5. Vali volituse tüüp:
   - ☑️ Vaatamise õigus
   - ☑️ Esitamise õigus (kui soovitud)
6. Määra kehtivusaeg
7. Kinnita ID-kaardi/Mobiil-ID-ga

**KLAARIKS-i jaoks nähtav:**
- Pärast volituse andmist näeme X-tee kaudu maksuandmeid

### Variant B: Digitaalne Volikiri

```markdown
VOLIKIRI
MAKSU- JA TOLLIAMETILE

Volitaja:
[ETTEVÕTTE NIMI]
Registrikood: [XXXXXXXX]
Aadress: [AADRESS]
Esindaja: [NIMI], isikukood [XXXXXXXXXXX]

Volitab käesolevaga:

KLAARIKS OÜ
Registrikood: [XXXXXXXX]
Aadress: [AADRESS]

järgmiste toimingute teostamiseks Maksu- ja Tolliametis:

1. Maksudeklaratsioonide ja -aruannete pärimine ja vaatamine
2. Maksukonto seisu ja ajaloo pärimine
3. Maksuteadete ja otsuste kättesaamine
4. [Valikuline: Deklaratsioonide esitamine volitaja nimel]

Käesolev volitus kehtib alates [KUUPÄEV] kuni [KUUPÄEV] / 
on tähtajatu ja kehtib kuni tagasivõtmiseni.

Volitaja kinnitan, et olen [ETTEVÕTTE NIMI] seaduslik esindaja
ja mul on õigus volitusi anda.

[KUUPÄEV]

________________________
[Volitaja nimi]
[Digitaalallkiri]
```

### Implementatsioon KLAARIKS-is

```typescript
// services/emtaService.ts

interface EmtaVoikiriRequest {
  companyRegCode: string;
  companyName: string;
  representativeName: string;
  representativeIdCode: string;
  permissions: ('view' | 'submit')[];
  validFrom: Date;
  validUntil?: Date; // undefined = tähtajatu
}

async function generateEmtaVoikiri(request: EmtaVoikiriRequest): Promise<Blob> {
  // Genereerib PDF volikirja DigiDoc allkirjastamiseks
}

async function checkEmtaPermissions(companyRegCode: string): Promise<{
  hasAccess: boolean;
  permissions: string[];
  validUntil?: Date;
}> {
  // Kontrollib X-tee kaudu, kas meil on ligipääs
}
```

---

## 📋 4. Pangaühenduse Nõusolek (PSD2)

### Open Banking Consent Flow

```
┌──────────────────────────────────────────────────────────┐
│  1. KASUTAJA ALGATAB                                     │
│     └── Klikib "Ühenda pangakonto"                       │
│                                                          │
│  2. PANGA VALIK                                          │
│     └── LHV / Swedbank / SEB / Coop                      │
│                                                          │
│  3. REDIRECT PANGA LEHELE                                │
│     └── Panga autentimisleht                             │
│                                                          │
│  4. KASUTAJA AUTENDIB                                    │
│     └── Smart-ID / Mobiil-ID / PIN-kalkulaator           │
│                                                          │
│  5. CONSENT KINNITAMINE                                  │
│     └── "Luban KLAARIKS-il lugeda minu kontoseisu        │
│          ja tehingute ajalugu järgmiseks 90 päevaks"     │
│                                                          │
│  6. REDIRECT TAGASI KLAARIKS-I                           │
│     └── Saame: authorization_code                        │
│                                                          │
│  7. TOKEN VAHETUS                                        │
│     └── code → access_token + refresh_token              │
│                                                          │
│  8. ANDMETE PÄRIMINE                                     │
│     └── Kontod, tehingud, saldod                         │
└──────────────────────────────────────────────────────────┘
```

### MVP Alternatiiv (ilma PSD2-ta)

```typescript
// Kasutaja laeb üles pangaväljavõtte
interface ManualBankImport {
  type: 'csv' | 'pdf' | 'xml';
  bank: 'lhv' | 'swedbank' | 'seb' | 'coop';
  file: File;
  consent: {
    confirmed: boolean; // "Kinnitan, et need on minu andmed"
    timestamp: Date;
  };
}
```

---

## 📋 5. Teenuse Leping (Faas 2)

### Struktuur

```markdown
KLAARIKS TEENUSE LEPING

POOLED:
1. KLAARIKS OÜ (teenusepakkuja)
2. [Kliendi ettevõte] (klient)

TEENUSE KIRJELDUS:
- Finantsülevaadete platvorm
- Pangaintegratsioon
- AI-põhine analüüs
- Maksukalkulatsioonid

HIND:
- Baaspakett: XX €/kuu
- Pro pakett: XX €/kuu
- Arveldusperiood: kuine

VASTUTUS:
- Teenusepakkuja vastutab andmeturbe eest
- Klient vastutab sisestatud andmete õigsuse eest
- Maksimaalne kahju: 12 kuu teenustasu

KONFIDENTSIAALSUS:
- Ärisaladuste hoidmine
- Andmete mitte-avalikustamine

KEHTIVUS:
- Algab allkirjastamisest
- Tähtajatu, 1 kuu etteteatamisega lõpetatav

ALLKIRJAD:
[Digitaalallkirjad mõlemalt poolelt]
```

---

## 🔧 Tehniline Implementatsioon

### Consent Management System

```typescript
// types/consent.ts

interface ConsentRecord {
  id: string;
  userId: string;
  companyId: string;
  consentType: 
    | 'terms_of_service'
    | 'privacy_policy'
    | 'data_processing'
    | 'emta_authorization'
    | 'bank_connection'
    | 'accountant_access';
  version: string;
  status: 'active' | 'withdrawn' | 'expired';
  grantedAt: Date;
  withdrawnAt?: Date;
  expiresAt?: Date;
  metadata: {
    ipAddress: string;
    userAgent: string;
    method: 'checkbox' | 'digidoc' | 'bank_redirect';
  };
}

// Audit trail
interface ConsentAuditLog {
  consentId: string;
  action: 'granted' | 'withdrawn' | 'renewed' | 'viewed';
  timestamp: Date;
  actor: string;
  details: string;
}
```

### UI Komponendid

```typescript
// components/consent/ConsentCheckbox.tsx
interface ConsentCheckboxProps {
  consentType: string;
  label: string;
  documentUrl: string; // Link täistekstile
  required: boolean;
  onChange: (accepted: boolean) => void;
}

// components/consent/ConsentModal.tsx
interface ConsentModalProps {
  title: string;
  content: string; // Markdown
  onAccept: () => void;
  onDecline: () => void;
}

// components/consent/ConsentHistory.tsx
// Näitab kasutajale tema antud nõusolekuid
// Võimaldab tagasi võtta
```

---

## ✅ Checklist MVP-ks

### Dokumendid
- [ ] Kasutustingimused (EST)
- [ ] Privaatsuspoliitika (EST)
- [ ] Andmetöötluse nõusolek tekst

### Kood
- [ ] Consent management süsteem
- [ ] Checkbox komponendid
- [ ] Consent salvestamine DB-sse
- [ ] Consent ajalugu vaade

### Juriidiline
- [ ] Jurist vaatab üle kasutustingimused
- [ ] GDPR vastavuse kontroll
- [ ] Andmekaitse Inspektsioon (kui vajalik)

---

*Viimati uuendatud: Jaanuar 2026*
