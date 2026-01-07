# KLAARIKS v0 — Kasutajateekond

> Põhineb PRD v0-l: AI-assisted accounting for Estonian micro-businesses

---

## 🎯 v0 Eesmärk

**Validatsiooni MVP**, mis:
- Toob reaalset väärtust reaalsetele ettevõtetele
- Saab kasutada sisemiselt raamatupidamisbürooga
- Tõestab automatiseerimise + UX oletusi enne avalikku launchit
- On turvaline, selgitatav ja skaleeritav disainilt

**See EI OLE launch PRD. See on validation PRD.**

---

## 👤 Sihtgrupp (v0)

### Esmane kasutaja
- Väikeettevõtte omanik (1–3 inimest OÜ)
- **Ei ole** raamatupidaja
- Tahab selgust ja meelerahu, mitte raamatupidamisteooriat
- Teeb igapäevast arvestust kui juhendatud turvaliselt

### Teisene kasutaja
- Professionaalne raamatupidaja (valikuline)
- Kasutab ülevaatuseks, parandamiseks või aastaaruandeks
- Vajab puhtaid exporte ja jälgitavust
- **Ei opereeri** süsteemi igapäevaselt

---

## 🚫 Mida v0 EI TEE (lukus)

| Välja jäetud | Põhjus |
|--------------|--------|
| Igapäevane raamatupidaja nõue | Owner-first |
| e-MTA esitamine | v1+ |
| Laohaldus | Scope |
| Palgaarvestus | Scope |
| Projektid / objektid | Scope |
| Mitu ettevõtet kontol | v1+ |
| Avalik self-serve onboarding | v1+ |

---

## 📋 Kasutajateekond (v0)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  1. AUTENTIMINE                                                  │   │
│  │     ├── Smart-ID / Mobiil-ID / ID-kaart (eelistatud)            │   │
│  │     └── Alternatiiv: email magic link (avatud otsus)            │   │
│  │                                                                  │   │
│  │  Saame: isikukood, nimi, e-post                                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  2. ETTEVÕTTE LOOMINE / SIDUMINE                                │   │
│  │     ├── Äriregistri otsing (registrikoodi järgi)                │   │
│  │     ├── Valideerime: ettevõte eksisteerib                       │
│  │     ├── Kuvame: nimi, reg.kood, KMKR staatus, aadress           │   │
│  │     └── Kasutaja kinnitab: "See on minu ettevõte"               │   │
│  │                                                                  │   │
│  │  ⚠️ v0: 1 konto = 1 ettevõte (kõva reegel)                      │   │
│  │  ⚠️ v0: 1 esmane kasutaja = ettevõtte omanik                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  3. TINGIMUSTE NÕUSTUMINE                                       │   │
│  │     ├── Kasutustingimused ✓                                     │   │
│  │     ├── Privaatsuspoliitika ✓                                   │   │
│  │     └── Andmetöötluse nõusolek ✓                                │   │
│  │                                                                  │   │
│  │  v0: Checkbox-põhine (mitte DigiDoc)                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  4. DASHBOARD / ATTENTION SYSTEM                                │   │
│  │                                                                  │   │
│  │     Kolm olekut:                                                │   │
│  │     🟢 ALL GOOD      - Kõik töödeldud, probleeme pole           │   │
│  │     🟡 NEEDS ATTENTION - Puudub dokument, madal kindlus         │   │
│  │     🔴 BLOCKED       - Kriitiline ebakindlus, nõuab sisendit    │   │
│  │                                                                  │   │
│  │     Üks nimekiri:                                               │   │
│  │     • Puuduvad dokumendid                                       │   │
│  │     • Madala kindlusega arved                                   │   │
│  │     • Sobitamata maksed                                         │   │
│  │     • Eelseisvad KM kohustused (informatiivne)                  │   │
│  │                                                                  │   │
│  │     ❌ EI OLE dashboarde - ainult attention list                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  5. IGAPÄEVANE TÖÖ                                              │   │
│  │                                                                  │   │
│  │  A) Dokumentide üleslaadimine                                   │   │
│  │     ├── Ostuarved (PDF, pilt)                                   │   │
│  │     ├── Müügiarved (import, mitte loomine)                      │   │
│  │     └── Pangaväljavõtted (CSV, PDF, XML)                        │   │
│  │                                                                  │   │
│  │  B) AI ekstraktsioon (assisteeriv)                              │   │
│  │     ├── Tarnija, kuupäev, summa, KM                             │   │
│  │     ├── Kindlusaste: High / Medium / Low                        │   │
│  │     └── ⚠️ MITTE KUNAGI auto-commit vaikselt                    │   │
│  │                                                                  │   │
│  │  C) Kategoriseerimine                                           │   │
│  │     ├── Soovita konto (kontoplaan)                              │   │
│  │     ├── Soovita KM käsitlus                                     │   │
│  │     ├── Kiire override                                          │   │
│  │     └── Meelespea: õpib override'idest                          │   │
│  │                                                                  │   │
│  │  D) Panga sobitamine                                            │   │
│  │     ├── Sobita tehingud arvetega                                │   │
│  │     ├── Tuvasta puuduvad arved                                  │   │
│  │     └── Näita sobitamise põhjendust                             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  6. RAAMATUPIDAJA HANDOFF (valikuline)                          │   │
│  │                                                                  │   │
│  │  Kutsu raamatupidaja (email invite):                            │   │
│  │     └── Read-only ligipääs                                      │   │
│  │                                                                  │   │
│  │  Export ZIP arhiiv:                                             │   │
│  │     ├── Originaaldokumendid                                     │   │
│  │     ├── Pearaamatu eksport                                      │   │
│  │     ├── Päeviku eksport                                         │   │
│  │     └── KM kokkuvõtte eelvaade                                  │   │
│  │                                                                  │   │
│  │  v0: Info handoff, mitte in-app editing                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Äriregistri Integratsioon (v0)

### Nõue PRD-st:
> "Company creation should use Estonian business registry lookup (required for real customers)"

### Implementatsioon

```typescript
// services/businessRegistryService.ts

interface CompanyLookupResult {
  found: boolean;
  company?: {
    registryCode: string;      // Registrikood
    name: string;              // Ärinimi
    legalForm: string;         // Õiguslik vorm (OÜ, AS, FIE)
    status: string;            // Staatus
    vatRegistered: boolean;    // Käibemaksukohuslane
    vatNumber?: string;        // KMKR number
    address: string;           // Aadress
    registrationDate: string;  // Registreerimise kuupäev
  };
  error?: string;
}

// Avalik otsing registrikoodi järgi
async function lookupCompanyByRegCode(regCode: string): Promise<CompanyLookupResult>

// v0: Kasutaja sisestab registrikoodi
// v1+: Automaatne otsing isikukoodi järgi (X-tee)
```

### Äriregistri Andmed

| Väli | Kasutus | Allikas |
|------|---------|---------|
| `registry_code` | Ettevõtte identifitseerimine | Äriregister |
| `name` | Kuvamine | Äriregister |
| `vat_registered` | KM loogika | Äriregister |
| `vat_number` | KM deklaratsioonid | Äriregister |
| `address` | Dokumentatsioon | Äriregister |

### v0 Piirangud

- ❌ Ei kontrolli automaatselt, kas kasutaja on seotud ettevõttega
- ❌ Ei kasuta X-teed (nõuab liitumislepingut)
- ✅ Kasutaja kinnitab ise, et on volitatud isik
- ✅ Valideerime, et ettevõte eksisteerib

---

## 🔐 Lepingud ja Nõusolekud (v0)

### Mida allkirjastada v0-s?

| Dokument | Meetod | Kohustuslik |
|----------|--------|-------------|
| Kasutustingimused | Checkbox | ✅ Jah |
| Privaatsuspoliitika | Checkbox | ✅ Jah |
| Andmetöötluse nõusolek | Checkbox | ✅ Jah |

### Mida EI OLE vaja v0-s?

| Dokument | Põhjus |
|----------|--------|
| EMTA volikiri | Ei esita e-MTA-sse |
| Pangaühenduse leping | Manuaalne import |
| DigiDoc lepingud | Checkbox piisab validatsiooniks |

### Consent Data Model

```typescript
// Vastavalt PRD data modelile

interface ConsentRecord {
  id: string;
  userId: string;
  companyId: string;
  consentType: 'terms' | 'privacy' | 'data_processing';
  version: string;           // Dokumendi versioon
  grantedAt: Date;
  metadata: {
    ipAddress: string;
    userAgent: string;
  };
}
```

---

## 🛡️ UX Turvamudel (Owner-first)

### Mida omanik SAAB teha

✅ Üles laadida ja kustutada dokumente
✅ Kinnitada või parandada ekstraktitud arve andmeid
✅ Aktsepteerida või override'ida soovitatud kategooriaid ja KM käsitlusi
✅ Sobitada või lahti sobitada pangatehinguid
✅ Vaadata KM ja rahavoo eelvaateid
✅ Eksportida andmeid raamatupidaja handoff jaoks

### Mida omanik EI SAA teha

❌ Käsitsi postitada pearaamatu kandeid
❌ Otse muuta maksuarvutusi
❌ Sulgeda arvestusperioode
❌ Override'ida süsteemi hoiatusi ilma kinnituseta

### Kindluse Kommunikatsioon

```typescript
type ConfidenceLabel = 'high' | 'medium' | 'low';

// Low confidence ALATI käivitab küsimuse või ülevaatuse ülesande
// AI soovitab, MITTE KUNAGI otsustab vaikselt
```

---

## 📊 Dokumendi Olekud (v0)

```
pending → processing → review → accepted
                  ↓
               failed (retryable)
```

| Olek | Kirjeldus | Kasutaja tegevus |
|------|-----------|------------------|
| `pending` | Ootab töötlust | Oodake |
| `processing` | AI ekstraktib | Oodake |
| `review` | Vajab ülevaatust | Kontrolli ja kinnita |
| `accepted` | Kinnitatud | Valmis |
| `failed` | Ebaõnnestus | Proovi uuesti |

---

## 💾 Data Model (v0 minimaalne)

Vastavalt PRD-le:

```typescript
// 1. Identity & Access
interface User {
  id: string;
  email: string;
  name: string;
  authProvider: 'smart_id' | 'mobile_id' | 'email';
  createdAt: Date;
}

interface Company {
  id: string;
  registryCode: string;
  name: string;
  vatRegistered: boolean;
  createdAt: Date;
}

interface Membership {
  id: string;
  companyId: string;
  userId: string;
  role: 'owner' | 'accountant_readonly' | 'viewer';
  createdAt: Date;
}
// v0: enforce 1 owner membership per company in UI/business logic

// 2. Documents
interface Document {
  id: string;
  companyId: string;
  type: 'purchase_invoice' | 'sales_invoice' | 'receipt' | 'other';
  source: 'upload' | 'email_future' | 'integration_future';
  fileKey: string;
  status: 'pending' | 'processing' | 'review' | 'accepted' | 'failed';
  issuedAt?: Date;
  counterpartyName?: string;
  counterpartyRegCode?: string;
  currency: string;
  totalGross?: number;
  totalVat?: number;
  totalNet?: number;
  vatTreatment: 'standard' | 'reverse_charge' | 'exempt' | 'unknown';
  createdAt: Date;
  updatedAt: Date;
}

// 3. Bank Transactions
interface Transaction {
  id: string;
  companyId: string;
  bankSource: 'manual_import';
  postedAt: Date;
  amount: number;
  currency: string;
  description: string;
  counterparty: string;
  reference?: string;
  bankAccountIban?: string;
  createdAt: Date;
}

// 4. Matching
interface Match {
  id: string;
  companyId: string;
  documentId: string;
  transactionId: string;
  matchType: 'payment' | 'receipt';
  confidenceLabel: 'high' | 'medium' | 'low';
  status: 'suggested' | 'confirmed' | 'rejected';
  createdAt: Date;
}

// 5. AI Suggestions
interface Suggestion {
  id: string;
  companyId: string;
  subjectType: 'document' | 'transaction';
  subjectId: string;
  suggestionType: 'extraction_field' | 'account_category' | 'vat_treatment' | 'match';
  payloadJson: object;
  confidenceLabel: 'high' | 'medium' | 'low';
  status: 'pending' | 'accepted' | 'overridden';
  modelVersion: string;
  createdAt: Date;
}

// 6. Owner Overrides
interface OwnerOverride {
  id: string;
  companyId: string;
  subjectType: string;
  subjectId: string;
  field: string;
  oldValue: string;
  newValue: string;
  createdAt: Date;
}

// 7. Audit Events
interface AuditEvent {
  id: string;
  companyId: string;
  actorUserId?: string;  // null for system
  eventType: 'upload' | 'parse' | 'suggestion_created' | 'suggestion_accepted' | 
             'override_created' | 'match_confirmed' | 'export_created';
  subjectType: string;
  subjectId: string;
  payloadJson: object;
  createdAt: Date;
}
```

---

## ✅ v0 Checklist

### Onboarding
- [ ] Smart-ID/Mobiil-ID autentimine (või magic link alternatiiv)
- [ ] Äriregistri otsing registrikoodi järgi
- [ ] Ettevõtte andmete kinnitus
- [ ] Kasutustingimuste checkbox
- [ ] Privaatsuspoliitika checkbox
- [ ] Andmetöötluse nõusolek checkbox

### Core Features
- [ ] Dokumentide üleslaadimine (PDF, pilt)
- [ ] Pangaväljavõtete import (CSV, PDF, XML)
- [ ] AI ekstraktsioon kindlusastmega
- [ ] Kategoriseerimise soovitused
- [ ] Panga sobitamine
- [ ] Attention system (üks nimekiri)

### Outputs
- [ ] Pearaamatu eksport
- [ ] Päeviku eksport
- [ ] KM kokkuvõtte eelvaade
- [ ] ZIP handoff raamatupidajale

### Safety
- [ ] Kõik muudatused logitud (AuditEvent)
- [ ] Low confidence → alati küsimus
- [ ] Override'id salvestatud
- [ ] Eelmine soovitus alati nähtav

---

## 🔮 v0 vs v1

| Aspekt | v0 (Validation) | v1 (Public) |
|--------|-----------------|-------------|
| Onboarding | Manuaalne, kutsutud | Self-serve |
| Pangaühendus | CSV/PDF import | PSD2 integratsioon |
| Arved | Upload | + Email inbox |
| Raamatupidaja | Export-based | Read-only in-app |
| Autentimine | Smart-ID / magic link | + rohkem valikuid |
| Pricing | Pole | Enforced |

---

## ❓ Avatud Otsused (PRD-st)

1. **Autentimine**: Smart-ID vs email magic link vs password + 2FA
2. **Kontoplaan**: Lihtsad kategooriad vs täis kontoplaan
3. **KM käsitluse taksonoomia**: Eesti miinimum set v0 jaoks
4. **Arve vs pank lahknevus**: Reeglid ja eskaleerimine

---

*Viimati uuendatud: Jaanuar 2026*
*Põhineb: PRD v0 — AI-assisted accounting for Estonian micro-businesses*
