# KLAARIKS — Disainijuhised (Design System)

> Versioon: 0.1 (esimene kirjapanek)
> Allikas: olemasolev koodibaas (`main` haru) — `index.html`, `components/*.tsx`
> Eesmärk: ühe dokumendina kõik disainivalikud, mida saab kasutada teises rakenduses, Figmas või uue mooduli ehitamisel.

---

## 1. Bränd ja toon

### 1.1. Nimi ja kirjapilt
- Bränd: **KLAARIKS**
- Logotüüp tekstina: alati **SUURTÄHTEDES**, `font-extrabold`, `tracking-tight`
- Tonaalsus: selge, rahulik, enesekindel. Mitte korporatiivne, mitte mängulik.
- Tagline'id, mida koodis kasutame:
  - "Asjad selgeks. Ettevõtte rahaasjad korras." (meta description)
  - "Selge. Läbipaistev. Korras." (metadata.json)
  - "Sinu ettevõtte rahaasjad" (onboarding)
  - "Sinu ettevõtte pulss. Selge ja klaar." (dashboard)

### 1.2. Hääletoon (tone of voice)
- **Keel:** eesti keel (`<html lang="et">`). Sina-vorm, mitte teie-vorm.
- **Lühike ja konkreetne.** Üks lause, üks mõte. Mitte "võiksite kaaluda", vaid "tee nii".
- **Selgitav, mitte hirmutav.** Riskidest räägime numbritega, mitte hüüumärkidega.
- **Positiivne kinnitus, kui kõik on korras.** Nt "Tubli töö!", "Kõik süsteemid töötavad".
- **Ei kasuta raamatupidamisžargooni** ilma seletuseta. "Sisendkäibemaks" → seletus juurde.
- **AI räägib esimeses isikus** ("Kuna ostsid eelmisel kuul…", "Sinu vaba raha arvestades on turvaline…").

### 1.3. Sõnastik (võtmesõnad UI-s)
| Mõiste UI-s | Tähendus |
|---|---|
| Finantsstaap | Dashboard |
| Vaba raha | Pangakonto saldo, mis pole maksudeks broneeritud |
| Müük | Müügiarved (Invoicing) |
| Ost | Kuludokumendid (Expenses) |
| Palgasimulaator | Net→bruto kalkulaator + lepingu allkirjastamine |
| Rahastus | Krediidivõimekuse moodul (Beta) |
| Autopiloodil | Süsteem teeb ise, sa ei pea sekkuma |
| Ettevõtte tervis | 0–100 skoor maksevõime + kuluhaldus + maksukoormus |

---

## 2. Tüpograafia

### 2.1. Font
- **Perekond:** `Inter`, fallback: `system-ui`, `sans-serif`
- **Allikas:** Google Fonts (`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap`)
- **Tähekaalud kasutuses:** 300, 400, 500, 600, 700, 800

### 2.2. Skaala (Tailwind klassid)
| Roll | Klass | Suurus | Kaal |
|---|---|---|---|
| Brändilogo (header) | `text-3xl` / `text-4xl` | 30/36 px | `font-extrabold` (800), `tracking-tight`, `uppercase` |
| Lehe pealkiri (H2) | `text-3xl` | 30 px | `font-bold` (700) |
| Kaardi pealkiri (H3) | `text-lg` | 18 px | `font-bold` (700) |
| Sektsiooni alapealkiri (H4) | `text-lg` | 18 px | `font-bold` (700) |
| Suur number (KPI) | `text-3xl` | 30 px | `font-bold` (700) |
| Hiidnumber (skoor) | `text-4xl` | 36 px | `font-bold` (700) |
| Põhitekst | `text-base` (vaikimisi) / `text-sm` | 16 / 14 px | `font-normal` (400) / `font-medium` (500) |
| Abi-/saatetekst | `text-sm` `text-slate-500` | 14 px | 400 |
| Sildid, badge'id | `text-xs` `uppercase` `tracking-wider` `font-bold` | 12 px | 700 |
| Mikrotekst (kuupäev modaalis) | `text-[10px]` | 10 px | 700 + `uppercase` |

### 2.3. Reeglid
- Pealkirjad alati `text-slate-900`.
- Saatetekst alati `text-slate-500`.
- Numbrid (rahasummad) eesti vormingus: `value.toLocaleString('et-EE')` + ` €` (tühik enne euromärki).
- Kuupäevad: `et-EE` locale, dashboardil lühivorm `DD.MM` (nt `15.10`).

---

## 3. Värvipalett

> Põhimõte: **emerald = positiivne / rahaline edu**, **slate = struktuur ja tekst**, **indigo = AI / nutikus**, semantilised värvid hoiatusteks.

### 3.1. Brändi- ja primaarvärvid
| Roll | Tailwind | Hex | Kus |
|---|---|---|---|
| **Primaar / edu / raha** | `emerald-600` | `#059669` | CTA-nupud (Onboarding "Otsi ettevõtet"), ikoonid, edu-staatused |
| Primaar hover | `emerald-700` | `#047857` | hover-olekud |
| Primaar väga hele | `emerald-50` | `#ecfdf5` | taustad, "ravikindlustus on" kaartid |
| Primaar hele | `emerald-100` | `#d1fae5` | pillide taust |
| Primaar tekst pillis | `emerald-700` / `emerald-800` | — | tekst hele-taustal |
| Primaar varju toon | `shadow-emerald-200` | — | CTA-nuppude pehme värviline vari |

### 3.2. Struktuur ja tekst (slate)
| Roll | Tailwind | Hex |
|---|---|---|
| Lehe taust | `slate-50` | `#f8fafc` |
| Kaardi taust | `white` | `#ffffff` |
| Kaardi piirjoon | `slate-100` | `#f1f5f9` |
| Hover taust (rida) | `slate-50` | `#f8fafc` |
| Sisendvälja taust | `slate-50` | `#f8fafc` |
| Sisendvälja piirjoon | `slate-100` / `slate-200` | — |
| Sekundaarne nupp | `slate-200` (border), `slate-600` (tekst) | — |
| Tume CTA (default) | `slate-900` `text-white` | `#0f172a` |
| Tume CTA hover | `slate-800` | `#1e293b` |
| Põhitekst | `slate-800` / `slate-900` | — |
| Saatetekst | `slate-500` | `#64748b` |
| Disabled / placeholder | `slate-400` | `#94a3b8` |
| Diskreetne tekst | `slate-300` | `#cbd5e1` |

### 3.3. AI ja nutikus (indigo)
| Roll | Tailwind | Hex |
|---|---|---|
| AI aktsent | `indigo-600` | `#4f46e5` |
| AI hover | `indigo-700` | `#4338ca` |
| AI taust | `indigo-50` | `#eef2ff` |
| AI pill / badge | `indigo-100` + `indigo-700` | — |
| AI gradient kaart | `from-indigo-50 to-blue-50` | — |
| AI sügav (Credit hero) | `from-indigo-900 to-slate-900` | — |
| AI sära (focus ring) | `ring-indigo-500/50` | — |

### 3.4. Semantilised olekuvärvid
| Olek | Background pill | Text pill | Ikooni / aktsendi värv |
|---|---|---|---|
| Edu / makstud / OK | `bg-emerald-100` | `text-emerald-800` | `text-emerald-600` |
| Info / käibemaks / saadetud | `bg-blue-100` | `text-blue-800` | `text-blue-600` |
| Hoiatus / meeldetuletus | `bg-amber-100` | `text-amber-700` | `text-amber-600` |
| Viga / üle tähtaja | `bg-red-100` | `text-red-800` | `text-red-500` (badge punkt: `bg-red-500`) |
| AI soovitus | `bg-indigo-100` | `text-indigo-700` | `text-indigo-600` |
| Beta-funktsioon | `bg-indigo-100` | `text-indigo-700` | — |

### 3.5. Kasutusreeglid
- **Üks aktsentvärv ühe sõnumi kohta.** Ära kasuta ühel kaardil korraga emerald + indigo + amber.
- **Tume CTA (`slate-900`)** = neutraalne tegevus (uus arve, vaata detaile).
- **Roheline CTA (`emerald-600`)** = lõpetav / kinnitav tegevus (lõpeta seadistamine, otsi ettevõtet).
- **Indigo CTA (`indigo-600`)** = AI poolt soovitatud tegevus (saada arve, saada meeldetuletus).

---

## 4. Vahemaad, raadiused, varjud

### 4.1. Vahekauguste süsteem (Tailwindi `space-*`)
- **Sektsioonide vahel:** `space-y-6` (24 px) või `space-y-8` (32 px)
- **Kaartide vahel grid'is:** `gap-4` (16 px) või `gap-6` (24 px)
- **Kaardi sisemine padding:** `p-6` (24 px) — desktopil. Mobiilil `p-4` (16 px).
- **Lehe põhi padding:** `p-4 md:p-8` (16/32 px), `max-w-7xl mx-auto`
- **Nupu padding:** `px-5 py-2.5` (sekundaarne) / `py-3` (suur) / `py-4` (XL CTA onboardingus)

### 4.2. Border-radius süsteem
| Element | Klass | Px |
|---|---|---|
| Pill / badge / täielikult ümar | `rounded-full` | ∞ |
| Onboarding kaart, modaal | `rounded-3xl` | 24 |
| Kaardid (KPI, sisukaardid) | `rounded-2xl` | 16 |
| Nupud, sisendid, väiksemad kaardid | `rounded-xl` | 12 |
| Sisesed plokid, väiksemad nupud | `rounded-lg` | 8 |
| Tabeli ridade ikoonid | `rounded-lg` | 8 |

### 4.3. Varjud
- **Kaardi vari (default):** `shadow-sm` + `border border-slate-100`
- **Tõstetud CTA:** `shadow-lg shadow-slate-200` (tume) / `shadow-emerald-200` (roheline) / `shadow-indigo-200` (AI)
- **Modaali vari:** `shadow-2xl`
- **Floating chat:** `shadow-[0_8px_40px_rgb(0,0,0,0.15)]`
- **Onboarding kaart:** `shadow-xl shadow-slate-200/50`
- Reegel: **iga vari on värvitud**, mitte mustaks (nt `shadow-slate-200`, mitte vaikimisi must).

### 4.4. Piirjooned
- Default kaardi piirjoon: `border border-slate-100`
- Hover/aktiivne piirjoon: `hover:border-emerald-200` (roheline tegevus) / `hover:border-indigo-200` (AI tegevus) / `hover:border-blue-200` (info)
- Sisendi focus: `focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10`

---

## 5. Ikoonid

- **Teek:** [`lucide-react`](https://lucide.dev) (v0.562+)
- **Vaikimisi suurused:**
  - Sisuline ikoon nupus: `size={16}` või `size={18}`
  - Navigatsiooni ikoon: `size={20}`
  - Pealkirja kõrval: `size={24}` / `size={32}`
  - Hero / illustratsioon: `size={40}` / `size={48}`
- **Värv:** ikoon pärib oleku värvi (`text-emerald-600` jne). Diskreetsetel ikoonidel `opacity-50`.
- **Mõnele võtmemõistele on fikseeritud ikoon:**
  - Dashboard → `LayoutDashboard`
  - Müük → `FileText`
  - Ost → `Receipt`
  - Palgasimulaator → `Calculator`
  - Rahastus → `Wallet`
  - Seaded → `Settings`
  - AI Assistent → `Sparkles`
  - Teavitused → `Bell`
  - Eduolek → `CheckCircle2` / `ShieldCheck`
  - Hoiatus → `AlertCircle` / `AlertTriangle`

---

## 6. Komponentide muster

### 6.1. KPI-kaart (Dashboard)
```
white background • rounded-2xl • shadow-sm • border-slate-100 • p-6 • h-32
├─ p-text-sm text-slate-500 (silt)
└─ h3 text-3xl font-bold text-slate-900 (number)
+ dekoratiivne värviline veerand (absolute right-0 bottom-0 w-24 h-24 bg-{semantic}-50 rounded-tl-full opacity-50)
```

### 6.2. Sisukaart (üldine)
```
bg-white rounded-2xl shadow-sm border border-slate-100 p-6
├─ päis: flex justify-between, ikoon värvitud lahtris (bg-{semantic}-50 p-2.5 rounded-xl) + pealkiri + saatetekst
├─ sisu
└─ jalus: nupp "Vaata detaile" + ChevronRight
```

### 6.3. Nupp — variandid
| Variant | Klassid | Kasutus |
|---|---|---|
| **Primary dark** | `bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-slate-200 hover:bg-slate-800 hover:shadow-xl active:scale-95` | Üldised tegevused, "Uus arve" |
| **Primary success** | `bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98]` | Lõpetavad/kinnitavad sammud |
| **Primary AI** | `bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700` | AI soovitused, "Saada arve" |
| **Secondary** | `border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50` | "Vaata detaile" |
| **Ghost** | `text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl` | "Tagasi" |
| **Icon-only** | `p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg` | Tabelireal "Vaata", "Lae alla" |

**Universaalsed nupu reeglid:**
- Disabled olek: `disabled:opacity-50 disabled:cursor-not-allowed` või `disabled:opacity-70`
- Press feedback: `active:scale-95` või `active:scale-[0.98]`
- Hover feedback: värvi muutus + `hover:scale-[1.02]` suurtel CTA-del
- Üleminek: `transition-all` või `transition-colors`

### 6.4. Sisendväli
```html
class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl
       text-lg font-medium text-center
       focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
       outline-none transition-all placeholder:text-slate-400 text-slate-900"
```
- Suurtel olulistel sisestustel (nt registrikood) **tsentreeritud tekst, suur kiri**.
- Tavalisel chati sisendil: läbipaistev taust kandjas (`bg-transparent border-none outline-none`).

### 6.5. Badge / pill
```html
class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
       bg-{semantic}-100 text-{semantic}-800"
```
- Beta-märk navis: `bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide`
- "Autopiloodil" elav indikaator: pulseeriv `w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse` + `bg-emerald-50 text-emerald-700`

### 6.6. Modaal
```
fixed inset-0 z-50 flex items-center justify-center p-4
bg-black/40 backdrop-blur-sm
└─ container: bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]
   ├─ header: p-4 border-b border-slate-100 bg-slate-50 flex justify-between
   ├─ body: overflow-y-auto p-8 (vajadusel bg-slate-100 + sisene "paber" bg-white)
   └─ X-nupp: text-slate-400 hover:text-slate-600
```
- Klõps overlay'le sulgeb modaali.
- Klõps sisu peal: `e.stopPropagation()`.

### 6.7. AI nutiplokk ("Smart Action Center")
```
bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100
├─ pealkiri: white p-1.5 rounded-lg shadow-sm text-indigo-600 (Sparkles) + "Nutikas assistent soovitab"
├─ grid 1/2 veergu: bg-white p-5 rounded-xl border border-indigo-50 (üks soovitus)
└─ dekoratiivne udu: absolute w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-20
```
- **Iga AI soovitus** sisaldab: tüübi pill, klient/kontekst, lühikirjeldus, summa, primary AI action + secondary "vaata" + dismiss "X".

### 6.8. Floating Command Center (AI chat)
- Asukoht: `fixed bottom`, mobiilil täislaius, desktopis `max-w-2xl` keskel.
- Overlay: `bg-black/10 backdrop-blur-[2px]`
- Sisendkast: `bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgb(0,0,0,0.15)] rounded-2xl`
- Saatmise nupp: `bg-slate-900 text-white p-2.5 rounded-xl`, ainult kui inputis on tekst.
- Sulgemine: X-ikoon või klõps overlay'le.
- Sõnumimullid:
  - Kasutaja: `bg-slate-900 text-white rounded-2xl rounded-br-sm`
  - AI: `bg-white/95 text-slate-800 border border-white/50 rounded-2xl rounded-bl-sm` + 32 px Bot-avatar (Sparkles → Bot ikoon `indigo-600`)
- Animatsioon avamisel: `animate-in slide-in-from-bottom-10 zoom-in-95 duration-300`
- "Suggestion chips" enne esimest sõnumit: ümarad valged nupud konkreetsete küsimustega.

### 6.9. Progressi indikaatorid
- **Onboarding samm-progress:** 3 horisontaalset riba `h-1.5 flex-1 rounded-full`, aktiivne `bg-emerald-500`, mitteaktiivne `bg-slate-100`, üleminek `transition-all duration-500`.
- **Skoori bar (Ettevõtte tervis):** `h-2 bg-slate-100 rounded-full`, täidis `bg-emerald-{400|500|600}` vastavalt skoorile, laius `w-[XX%]`.
- **Laadimine:** `Loader2` lucide ikoon + `animate-spin`. Suuremad spinnerid: `w-16 h-16 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin`.

### 6.10. Tabel
```
bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden
└─ table:
   ├─ thead: bg-slate-50, th = px-6 py-4, text-xs font-semibold text-slate-500 uppercase tracking-wider
   └─ tbody divide-y divide-slate-100:
      tr: hover:bg-slate-50 transition-colors group cursor-pointer
      td: px-6 py-4
      action-ikoonid ilmuvad ainult hover'il (`opacity-0 group-hover:opacity-100 transition-opacity`)
```
- Tühi olek: tsentreeritud, ümar hall ikoonitaust (`bg-slate-50 rounded-full w-16 h-16`) + selgitav saatetekst.

---

## 7. Navigatsioon ja paigutus

### 7.1. Desktop (≥ md = 768 px)
- **Vasak sidebar** `w-64` (256 px), valge taust, `border-r border-slate-200`
- Sidebari sisu: logo, ettevõtte plokk (`bg-slate-50 rounded-lg`), nav-nupud, AI Assistent (eraldatud `mt-4`), teavitused (alumine).
- Põhisisu: `flex-1 overflow-y-auto h-screen p-8 max-w-7xl mx-auto w-full`

### 7.2. Mobiil (< md)
- **Top bar:** `sticky top-0 z-20 bg-white border-b border-slate-200 p-4`, vasakul brändilogo, paremal hamburger (`Menu`/`X` toggle).
- **Drawer:** sidebar `fixed inset-y-0 left-0 z-40 w-64`, `transform transition-transform`, libiseb vasakult.
- **Overlay drawer'i taga:** `fixed inset-0 bg-black/20 z-30`.
- **Sisuala kõrgus:** `h-[calc(100vh-65px)]` (65 px = top bar).
- **Lehe padding mobiilil:** `p-4`, alt `pb-20` (et floating UI ei kataks).
- AI Assistendi nupp sidebaris: avab full-screen modal-stiilis chati `fixed inset-0 z-50`.

### 7.3. Aktiivne nav-element
- Mitteaktiivne: `text-slate-600 hover:bg-slate-100 hover:text-slate-900`
- Aktiivne: `bg-slate-900 text-white shadow-md`
- AI Assistent aktiivne: `bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200`

### 7.4. Murdepunktid
Kasutame Tailwindi vaikimisi murdepunkte:
- `sm`: 640 px
- `md`: 768 px (peamine "mobile → desktop" piir)
- `lg`: 1024 px (kasutusel grid'i 1→2 veeru jagamiseks)
- `xl`: 1280 px

Reegel: **mobile-first**. Vaikeklassid mobiilile, `md:`/`lg:` täiendused suurematele.

---

## 8. Animatsioonid

Kasutame `tailwindcss-animate`-stiilis klasse (`animate-in`, `fade-in`, `slide-in-from-*`, `zoom-in-*`, `duration-*`).

| Olukord | Klass |
|---|---|
| Lehe sisu sisenemine | `animate-in fade-in` |
| Onboarding samm | `animate-in fade-in slide-in-from-right-8` |
| Modaal avaneb | `animate-in fade-in` + sisu `zoom-in-95` |
| Chat avaneb | `animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 ease-out` |
| Edu-ekraan | `animate-in zoom-in-95 duration-500` |
| Sõnumi mull | `animate-in slide-in-from-bottom-2 fade-in duration-300` |
| Pulseeriv punkt | `animate-pulse` |
| Spinner | `animate-spin` |
| Nupu vajutus | `active:scale-95` / `active:scale-[0.98]` |
| Nupu hover-lift | `hover:scale-[1.02]` |

**Reegel:** animatsioonid on kerged ja kiired (300–500 ms). Mitte ühtegi pikemat kui 700 ms.

---

## 9. Andmevormingud

- **Raha:** `value.toLocaleString('et-EE')` + ` €` (tühik enne €). Sentide kuvamine `value.toFixed(2)`, kui täpsus oluline (arvel, kuludokumendil).
- **Kuupäev:**
  - Pikk: `new Date().toLocaleDateString('et-EE')` (nt `21.05.2026`)
  - Lühike (graafik): `${d.getDate()}.${d.getMonth()+1}` (nt `15.10`)
- **Protsent:** ilma tühikuta: `20%` (käibemaks).
- **Registrikood:** monospace fondiga `font-mono` valgel `bg-white px-2 py-0.5 rounded border border-slate-200`.
- **Skoor:** suur number + hall `/100` järelliide (`<span class="text-4xl font-bold text-emerald-600">95</span><span class="text-slate-400 text-lg">/100</span>`).

---

## 10. Graafikud (recharts)

- Põhivärv: `emerald-500` (`#10b981`), joon `strokeWidth={3}`
- Täidis: vertikaalne gradient `#10b981` 10% → 0%
- Telg: ilma `axisLine`/`tickLine`, kiri `#94a3b8` 12 px
- Grid: ainult horisontaalne, `strokeDasharray="3 3"`, värv `#f1f5f9`
- Tooltip: `border-radius: 8px`, ilma piirjooneta, pehme vari
- Legend custom'itud: rohelised punktid (`bg-emerald-500` ajalugu, `bg-emerald-200` prognoos) + `text-xs text-slate-500`

---

## 11. Sisureeglid (microcopy)

### 11.1. Pealkirjad
- Lühikesed, 1–3 sõna kui võimalik: "Müük", "Ost", "Finantsstaap", "Maksud".
- Mitte tehnilist sõnastikku ("Tehingute haldamise moodul" ❌ → "Müük" ✅).

### 11.2. Saatetekstid
- Üks lause, kuni ~60 tähemärki.
- "Mida ma siit saan?" — vasta sellele: "Koosta, saada ja jälgi laekumisi."

### 11.3. Nupud
- Tegusõna + objekt: "Saada arve", "Lõpeta seadistamine", "Otsi ettevõtet", "Vaata detaile".
- Mitte "OK", "Klõpsa siia", "Jätka" üksinda.

### 11.4. AI-vastused
- Alusta põhjusega ("Kuna ostsid eelmisel kuul…").
- Anna konkreetne number, mitte hinnang ("ca 2500€", mitte "tõenäoliselt palju").
- Lõpeta soovituse või järgmise sammuga.

### 11.5. Veateated ja hoiatused
- Kirjelda **mis juhtus**, **mida tähendab**, **mida teha**.
- Näide: "Arve AR-2023-088 on üle tähtaja. Kas saadame automaatse meeldetuletuse?" → tegevus: "Saada meeldetuletus".

### 11.6. Edutated
- Lühike kinnitus + järgmine samm: "Palju õnne! Leping sõlmitud. Oled ametlikult registris."

---

## 12. Pildid, illustratsioonid, gradiendid

- **Päris pilte UI-s ei kasuta.** Kogu visuaal on tüpograafiast, ikoonidest, gradientidest ja varjudest.
- **Dekoratiivne udu** (ambient blur): `absolute w-{X} h-{X} bg-{color}-{50|200}/{opacity} rounded-full blur-3xl` + `pointer-events-none`.
- **Värvilised veerandid** KPI-kaartidel: `absolute right-0 bottom-0 w-24 h-24 bg-{color}-50 rounded-tl-full opacity-50`.
- **Tume hero-kaart** (Rahastus): `bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl`.

---

## 13. Lokaadid ja juurutus

- **Vaikimisi keel:** `et` (eesti).
- **Valuuta:** `EUR`, vorming `et-EE`.
- **Theme color:** `<meta name="theme-color" content="#ffffff">` (valge, mobiili brauseri tiitliriba).
- **Tailwind:** Vaikekonfiguratsioon + ainult `fontFamily.sans = ['Inter', 'system-ui', 'sans-serif']`.
- **Custom scrollbar (webkit):** 8 px laius, `track #f1f5f9`, `thumb #cbd5e1` → hover `#94a3b8`.

---

## 14. Ligipääsetavus (a11ü) — miinimum

- Kontrastid hoitakse `slate-500` saateteksti tasemel või tugevamad. **Halli halli peal vältida.**
- Iga interaktiivne ikoon-nupp peab omama `title` atribuuti (näide tabelis: `title="Vaata"`, `title="Lae alla"`, `title="Sulge"`).
- Modaali sulgemise X peab olema ≥ 24 px klikiala (`p-2` ümber `size={20}` ikooni).
- Fookuse ring kasutab värvilist `ring-{color}-500/{opacity}` mustrit, mitte ainult `outline-none`.
- Drawer'i overlay'l on `onClick` sulgemiseks, et puutetundlikul ekraanil saaks väljapoole klõpsates sulgeda.

---

## 15. Kuidas seda dokumenti kasutada teises rakenduses

1. **Värvid:** kopeeri sektsioonist 3 oma Tailwindi/CSS muutujate hulka. Klaariks ei kasuta custom värve — kõik on **Tailwind defaults** (`slate`, `emerald`, `indigo`, `blue`, `amber`, `red`).
2. **Font:** lisa Google Fonts Inter (300–800).
3. **Tailwind config:** pane `fontFamily.sans = ['Inter', 'system-ui', 'sans-serif']`. Muud erikonfiguratsiooni pole vaja.
4. **Ikoonid:** installi `lucide-react`. Hoia sektsiooni 5 ikoonipaare.
5. **Komponentide alusena** kasuta sektsiooni 6 mustreid otse — need on copy-paste-valmis Tailwindi klassikombinatsioonid.
6. **Hääletoon:** kirjuta tekstid sektsiooni 1.2 ja 11 reeglite järgi. Kui kahtled — tee lühemaks ja konkreetsemaks.

---

## 16. Mida selles dokumendis veel POLE (järgmised versioonid)

- Dark mode (praegu pole olemas, ainult valge teema).
- Animatsioonide täielik spec (easing curves, motion language).
- Figma-link / token JSON eksport.
- Komponendi varieerumine eri seisundites (loading, empty, error) — praegu ainult osaliselt.
- Illustratsioonid / brändi marketingmaterjal.
- Ligipääsetavuse põhjalik audit (WCAG 2.2 AA).

Need lisame, kui konkreetne vajadus tekib.
