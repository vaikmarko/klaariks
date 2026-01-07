# Volikirjad ja Lepingud — v0 vs Tulevased Faasid

> Põhineb PRD v0-l

---

## 🎯 Kokkuvõte

### v0 — Mida on vaja?

| Dokument | Vajalik v0? | Meetod |
|----------|-------------|--------|
| Kasutustingimused | ✅ Jah | Checkbox |
| Privaatsuspoliitika | ✅ Jah | Checkbox |
| Andmetöötluse nõusolek | ✅ Jah | Checkbox |
| EMTA volikiri | ❌ Ei | — |
| Panga volikiri/consent | ❌ Ei | — |
| DigiDoc leping | ❌ Ei | — |

### Miks nii lihtne?

PRD ütleb selgelt:
- **v0 ei esita midagi e-MTA-sse** → EMTA volikirja pole vaja
- **v0 kasutab manuaalset importi** → Panga consent'i pole vaja
- **v0 on validation MVP** → Checkbox piisab juriidiliseks kaitseks

---

## 📋 v0 Nõusolekud (Detail)

### 1. Kasutustingimused (Terms of Service)

```markdown
KLAARIKS KASUTUSTINGIMUSED

1. TEENUSE KIRJELDUS
   KLAARIKS on AI-toega raamatupidamise abivahend Eesti 
   mikroettevõtetele. Teenus aitab:
   - Dokumente üles laadida ja töödelda
   - Tehinguid kategoriseerida
   - Ülevaadet saada finantsseisust
   
   KLAARIKS EI OLE litsentseeritud raamatupidamisteenus 
   ega maksunõustaja.

2. KASUTAJA KOHUSTUSED
   - Esitada tõeseid andmeid
   - Hoida ligipääsuandmeid turvaliselt
   - Mitte kasutada teenust ebaseaduslikult
   - Kinnitada ekstraktitud andmete õigsust

3. AI KASUTAMINE
   - Süsteem kasutab AI-d andmete ekstraktimiseks
   - AI soovitused EI OLE automaatsed otsused
   - Kasutaja vastutab kõigi kinnituste eest
   - Madala kindlusega tulemused nõuavad ülevaatust

4. ANDMED JA PRIVAATSUS
   - Viide privaatsuspoliitikale
   - Andmete säilitamine vastavalt seadusele
   - Kasutaja õigus andmeid eksportida

5. VASTUTUSE PIIRAMINE
   - KLAARIKS ei vastuta raamatupidamisvigade eest
   - Kasutaja vastutab oma otsuste eest
   - Maksimaalne kahju: teenustasu tagastamine

6. LÕPETAMINE
   - Kasutaja võib igal ajal lõpetada
   - Andmete eksport 30 päeva jooksul
   - Andmete kustutamine GDPR alusel

7. MUUDATUSED
   - Teavitame muudatustest ette
   - Jätkuv kasutamine = nõustumine

8. KOHALDATAV ÕIGUS
   - Eesti Vabariigi seadused
   - Harju Maakohus
```

### 2. Privaatsuspoliitika (Privacy Policy)

```markdown
KLAARIKS PRIVAATSUSPOLIITIKA

1. VASTUTAV TÖÖTLEJA
   [KLAARIKS OÜ]
   Registrikood: [...]
   E-post: privacy@klaariks.ee

2. KOGUTAVAD ANDMED

   Isikuandmed:
   - Nimi, isikukood (autentimisest)
   - E-posti aadress
   - IP-aadress, seadme info

   Ettevõtte andmed:
   - Registrikood, ärinimi
   - KMKR staatus
   - Üleslaetud dokumendid
   - Pangaväljavõtted (kui imporditud)

   Kasutusandmed:
   - Logid, sessioonid
   - Tegevuste ajalugu

3. TÖÖTLEMISE EESMÄRK
   - Teenuse osutamine
   - AI mudeli treenimine (anonümiseeritult)
   - Klienditugi
   - Seadusjärgne säilitamine

4. TÖÖTLEMISE ALUS
   - Lepingu täitmine (Art 6(1)(b))
   - Seadusest tulenev kohustus (Art 6(1)(c))
   - Nõusolek (Art 6(1)(a)) - tagasivõetav

5. ANDMETE SÄILITAMINE
   - Aktiivsed andmed: lepingu kehtivuse ajal
   - Finantsandmed: 7 aastat (RPS)
   - Logid: 1 aasta
   - Pärast: turvaline kustutamine

6. ANDMETE JAGAMINE
   - Pilveplatvormid (AWS/GCP) - töötlejana
   - AI teenused - anonümiseeritult
   - Riigiasutused - seaduse alusel
   - EI MÜÜA kolmandatele osapooltele

7. KASUTAJA ÕIGUSED (GDPR)
   - Juurdepääs (Art 15)
   - Parandamine (Art 16)
   - Kustutamine (Art 17)
   - Ülekandmine (Art 20)
   - Vastuväide (Art 21)
   - Piiramine (Art 18)

8. TURVALISUS
   - Krüpteerimine (rest + transit)
   - Ligipääsukontroll
   - Regulaarsed auditid

9. KONTAKT
   E-post: privacy@klaariks.ee
   Vastame: 30 päeva

10. KAEBUSED
    Andmekaitse Inspektsioon
    www.aki.ee
```

### 3. Andmetöötluse Nõusolek

```markdown
ANDMETÖÖTLUSE NÕUSOLEK

Nõustun, et KLAARIKS töötleb minu ja minu ettevõtte andmeid 
järgmistel eesmärkidel:

☐ Üleslaetud dokumentide automaatne analüüs AI abil
☐ Pangaväljavõtete import ja töötlemine
☐ Tehingute kategoriseerimine ja soovituste andmine
☐ Andmete eksportimine raamatupidajale (kui valin)

Mõistan, et:
- Saan nõusoleku igal ajal tagasi võtta
- Tagasivõtmine ei mõjuta eelnevat töötlemist
- Mul on õigus oma andmetele ligi pääseda
- Mul on õigus nõuda andmete kustutamist

[Checkbox] Nõustun ülaltoodud tingimustega
```

---

## 🔮 Tulevased Faasid — Volikirjad

### v1: EMTA Integratsioon

**Millal vaja?** Kui hakkame e-MTA-st andmeid lugema/esitama.

**Protsess:**

```
┌─────────────────────────────────────────────────────────────┐
│  EMTA VOLIKIRI                                              │
│                                                             │
│  Variant A: e-MTA kaudu (soovituslik)                       │
│  ├── Kasutaja logib e-MTA-sse                               │
│  ├── Seaded → Volitused → Lisa volitus                      │
│  ├── Sisestab KLAARIKS reg.koodi                            │
│  └── Kinnitab Smart-ID-ga                                   │
│                                                             │
│  Variant B: Digitaalne volikiri                             │
│  ├── KLAARIKS genereerib PDF                                │
│  ├── Kasutaja allkirjastab DigiDoc-is                       │
│  └── KLAARIKS esitab EMTA-le                                │
│                                                             │
│  Õigused:                                                   │
│  ☐ Deklaratsioonide vaatamine                               │
│  ☐ Maksukonto seisu pärimine                                │
│  ☐ Deklaratsioonide esitamine (valikuline)                  │
└─────────────────────────────────────────────────────────────┘
```

**Volikirja Näidis:**

```
VOLIKIRI
MAKSU- JA TOLLIAMETILE

Volitaja:
[ETTEVÕTTE NIMI], registrikood [XXXXXXXX]
Esindaja: [NIMI], isikukood [XXXXXXXXXXX]

Volitab:
KLAARIKS OÜ, registrikood [XXXXXXXX]

Toimingud:
1. Maksudeklaratsioonide pärimine ja vaatamine
2. Maksukonto seisu pärimine
3. [Valikuline: esitamine]

Kehtivus: [kuupäev] kuni tagasivõtmiseni

[Digitaalallkiri]
```

---

### v1: Pangaühendus (PSD2)

**Millal vaja?** Kui läheme manuaalselt impordilt üle automaatsele.

**Protsess:**

```
┌─────────────────────────────────────────────────────────────┐
│  PSD2 CONSENT FLOW                                          │
│                                                             │
│  1. Kasutaja valib panga (LHV, Swedbank, SEB, Coop)         │
│  2. Redirect panga lehele                                   │
│  3. Autentimine (Smart-ID)                                  │
│  4. Consent kinnitamine:                                    │
│     "Luban KLAARIKS-il lugeda minu kontoseisu ja            │
│      tehingute ajalugu järgmiseks 90 päevaks"               │
│  5. Redirect tagasi KLAARIKS-i                              │
│  6. Token salvestamine                                      │
│  7. Andmete sünkroonimine                                   │
│                                                             │
│  ⚠️ Consent kehtib 90 päeva, siis uuendamine                │
│  ⚠️ Vajab AISP litsentsi või partnerlust                    │
└─────────────────────────────────────────────────────────────┘
```

**Alternatiiv: Partnerlus**
- Nordigen, Plaid, Tink - juba litsentseeritud
- Kiirem turule jõudmine
- Vähem regulatiivset koormat

---

### v1+: Raamatupidaja Leping

**Millal vaja?** Kui raamatupidajal on in-app ligipääs (mitte ainult export).

```
RAAMATUPIDAJA LIGIPÄÄSU LEPING

Pooled:
1. [Ettevõtte nimi] (klient)
2. [Raamatupidaja nimi/ettevõte]

Ligipääsu ulatus:
☐ Read-only vaatamine
☐ Kommenteerimine
☐ [Tulevikus: muutmine]

Konfidentsiaalsus:
- Andmeid ei jagata kolmandatele
- Ligipääs lõpeb lepingu lõppemisel

[Digitaalallkirjad]
```

---

## 📊 Kokkuvõte: Millal Mida Vaja

| Faas | Dokument | Meetod | Kuhu |
|------|----------|--------|------|
| **v0** | Kasutustingimused | Checkbox | KLAARIKS |
| **v0** | Privaatsuspoliitika | Checkbox | KLAARIKS |
| **v0** | Andmetöötluse nõusolek | Checkbox | KLAARIKS |
| **v1** | EMTA volikiri | e-MTA / DigiDoc | EMTA |
| **v1** | Pangaühenduse consent | Panga süsteem | Pank |
| **v1+** | Raamatupidaja leping | DigiDoc | KLAARIKS |
| **v1+** | Teenuse leping (B2B) | DigiDoc | KLAARIKS |

---

## ✅ v0 Implementatsiooni Checklist

### Dokumendid kirjutada
- [ ] Kasutustingimused (EST tekst)
- [ ] Privaatsuspoliitika (EST tekst)
- [ ] Andmetöötluse nõusolek (EST tekst)

### UI komponendid
- [ ] ConsentCheckbox komponent
- [ ] Tingimuste modaal (täistekst)
- [ ] Consent history vaade (seaded)

### Backend
- [ ] Consent salvestamine DB-sse
- [ ] Versioonihaldus (dokumendi versioon)
- [ ] Audit log (kes, millal nõustus)

### Juriidiline
- [ ] Jurist vaatab üle
- [ ] GDPR vastavuse kontroll

---

*Viimati uuendatud: Jaanuar 2026*
*Põhineb: PRD v0*
