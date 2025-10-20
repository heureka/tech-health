# 🚀 Tech Health Framework Configurator

Interaktivní webová aplikace pro provádění Tech Health assessmentů podle **Heureka Tech Health Framework**.

## ✨ Co je hotové

### ✅ Kompletní Implementace (100%)

Aplikace je **plně funkční** a připravená k použití!

**1. Úvodní stránka** ([app/page.tsx](app/page.tsx))
- Profesionální landing page s popisem frameworku
- Přehled všech 5 oblastí assessmentu
- Vysvětlení maturity levelů (1-4)
- Core principles a metodika

**2. Assessment Wizard** ([app/assessment/page.tsx](app/assessment/page.tsx))
- Multi-step průvodce se 7 kroky:
  - Krok 0: Informace o týmu
  - Kroky 1-5: Assessment 5 oblastí (21 sub-os)
  - Krok 6: Pulse Survey (6 otázek)
- Progress bar s indikací dokončení
- Auto-save do local storage každou změnou
- Možnost pokračovat v rozpracovaném assessmentu

**3. Level Selector** ([components/assessment/LevelSelector.tsx](components/assessment/LevelSelector.tsx))
- Vizuální karty pro každý level (1-4)
- Barevné označení (červená → oranžová → žlutá → zelená)
- Detailní popis každého levelu s příklady
- Responzivní design

**4. Area Assessment** ([components/assessment/AreaAssessment.tsx](components/assessment/AreaAssessment.tsx))
- Accordion s 5 sub-osami pro každou oblast
- Progress tracking (X / 5 completed)
- Volitelné komentáře k jednotlivým sub-osám
- Indikátory dokončení

**5. Pulse Survey** ([components/assessment/PulseSurvey.tsx](components/assessment/PulseSurvey.tsx))
- 6 otázek se sliderem (0-10)
- Vizuální feedback (emoji + barvy)
- Živé zobrazení aktuálního skóre

**6. Results Dashboard** ([app/results/page.tsx](app/results/page.tsx))
- Overall skóre a maturity level
- **Speed-Sustainability Compass** - vizuální indikátor rychlosti vs. udržitelnosti
- Radar chart pro vizualizaci 5 oblastí
- Detailní breakdown každé oblasti
- Prioritizovaná doporučení
- Export do JSON
- Možnost smazat a začít nový assessment

**7. Komponenty vizualizace**
- **RadarChart** ([components/results/RadarChart.tsx](components/results/RadarChart.tsx)) - Recharts radar graf
- **CompassChart** ([components/results/CompassChart.tsx](components/results/CompassChart.tsx)) - Speed-Sustainability Compass (SVG vizualizace)
- **Recommendations** ([components/results/Recommendations.tsx](components/results/Recommendations.tsx)) - Doporučení s prioritami

**8. Business logika**
- **Scoring Logic** ([lib/utils/scoring-logic.ts](lib/utils/scoring-logic.ts)) - Výpočty, maturity levely, generování doporučení
- **Storage** ([lib/utils/storage.ts](lib/utils/storage.ts)) - Local storage persistence, export JSON

**9. Datový model**
- **Kompletní framework data** ([lib/data/assessment-data.ts](lib/data/assessment-data.ts))
  - 5 oblastí
  - 21 sub-os
  - 84 detailních popisů levelů (4 × 21)
  - 6 pulse survey otázek
- **TypeScript typy** ([lib/types/assessment.ts](lib/types/assessment.ts))

## 🚀 Spuštění aplikace

### Instalace
```bash
cd configurator
npm install
```

### Development server
```bash
npm run dev
```

Otevřete [http://localhost:3000](http://localhost:3000) v prohlížeči.

### Production build
```bash
npm run build
npm start
```

## 📊 Tech Health Framework

### 5 Hlavních Oblastí (21 Sub-os)

#### 🧱 **A. Tech Debt** (5 sub-os)
1. Code Quality Debt
2. Architecture / Domain Debt
3. Infrastructure Debt
4. Process / Delivery Debt
5. Knowledge Debt

#### 🧪 **B. Testing & Automation** (5 sub-os)
1. Unit Testing Coverage
2. Integration Testing
3. E2E Flow Coverage
4. Pipeline Reliability
5. Deployment Automation

#### 🔍 **C. Observability & Stability** (5 sub-os)
1. Monitoring Coverage
2. Alert Hygiene & On-Call Discipline
3. Incident Response (MTTR)
4. Logging / Tracing
5. Postmortems & Learning

#### ⚡ **D. Delivery Performance (DORA)** (4 sub-os)
1. Deployment Frequency (DF)
2. Lead Time for Changes (LTC)
3. Change Failure Rate (CFR)
4. Mean Time to Recovery (MTTR)

#### 🧠 **E. Governance & Knowledge** (5 sub-os)
1. ADR Discipline
2. Decision Traceability
3. Architecture Docs
4. Ownership Clarity
5. Transparency

### Maturity Levely (1-4)

| Level | Název | Popis |
|-------|-------|-------|
| **1** | 🔴 Chaotic | Ad-hoc, manual, unpredictable |
| **2** | 🟠 Emerging | Partial coverage or informal discipline |
| **3** | 🟡 Defined | Stable processes & metrics for critical flows |
| **4** | 🟢 Optimized | Automated, measurable, continuously improved |

### Interpretace Skóre

| Průměr | Maturity Level | Doporučená Akce |
|--------|----------------|-----------------|
| 1.0 - 1.9 | 🔴 Unstable, reactive | Create recovery plan; add to Tech Big Rocks |
| 2.0 - 2.9 | 🟠 Emerging discipline | Prioritize automation & documentation |
| 3.0 - 3.4 | 🟡 Stable baseline | Sustain & optimize critical paths |
| 3.5 - 4.0 | 🟢 Optimized, data-driven | Share practices; help mentor others |

### 🧭 Speed-Sustainability Compass

Compass ukazuje, zda tým inklinuje k rychlosti nebo udržitelnosti (škála 0-100):

| Pozice | Význam | Akce |
|--------|--------|------|
| ⚡ **Speed-Heavy** | Rychlé dodávání, ale potenciální problémy se spolehlivostí | Zvýšit stabilizační alokaci na 40%; focus na alerting & monitoring |
| 🛡️ **Sustainability-Heavy** | Přeinvestováno do údržby, inovace zpomalují | Přesunout 10% kapacity zpět na features |
| 🎯 **Balanced** | Zdravá rovnováha mezi rychlostí a resilience | Udržovat současné praktiky, sdílet s ostatními týmy |

**Výpočet:**
- **Speed** (0-100): DORA Delivery metriky + Testing/Automation maturity
- **Sustainability** (0-100): Observability + Tech Debt + Governance
- **Balanced zóna**: rozdíl ≤ 10 bodů

## 🎯 Jak používat aplikaci

### 1. Úvodní stránka
- Prohlédněte si popis frameworku
- Klikněte na "Start New Assessment"

### 2. Informace o týmu
- Vyplňte název týmu (povinné)
- Přidejte účastníky assessmentu
- Volitelně poznámky

### 3. Assessment jednotlivých oblastí
- Pro každou sub-osu vyberte level (1-4)
- Přečtěte si popis každého levelu s příklady
- Volitelně přidejte komentář

### 4. Pulse Survey
- Odpovězte na 6 otázek pomocí slideru (0-10)
- Vyjadřuje subjektivní pocit týmu

### 5. Výsledky
- Zobrazí se overall skóre, maturity level a radar chart
- Dostanete prioritizovaná doporučení
- Můžete exportovat výsledky do JSON

## 💾 Persistence

- **Auto-save**: Každá změna se automaticky ukládá do local storage
- **Resume**: Při návratu do aplikace můžete pokračovat
- **Export**: JSON export s kompletními daty

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: Browser Local Storage

## 📁 Struktura projektu

```
configurator/
├── app/
│   ├── page.tsx                 # Home page ✅
│   ├── assessment/
│   │   └── page.tsx             # Assessment wizard ✅
│   └── results/
│       └── page.tsx             # Results dashboard ✅
├── components/
│   ├── ui/                      # shadcn/ui components ✅
│   ├── assessment/
│   │   ├── LevelSelector.tsx   # Level selector ✅
│   │   ├── AreaAssessment.tsx  # Area component ✅
│   │   └── PulseSurvey.tsx     # Pulse survey ✅
│   └── results/
│       ├── RadarChart.tsx       # Radar chart ✅
│       ├── CompassChart.tsx     # Speed-Sustainability Compass ✅
│       └── Recommendations.tsx  # Recommendations ✅
├── lib/
│   ├── data/
│   │   └── assessment-data.ts   # Framework data ✅
│   ├── utils/
│   │   ├── scoring-logic.ts     # Calculations ✅
│   │   └── storage.ts           # Storage utils ✅
│   └── types/
│       └── assessment.ts        # TypeScript types ✅
└── README.md                    # This file ✅
```

## 🚢 Deployment

### Vercel (doporučeno)
```bash
# Push to GitHub
git push

# Import do Vercel
vercel
```

### Manual
```bash
npm run build
# Deploy .next folder a public directory
```

## 📝 Poznámky

- Assessment trvá cca 20-30 minut
- Doporučeno: Tech Lead / EM + 1-2 inženýři
- Běžet jednou za kvartál
- Cíl: reflexe a zlepšení, ne judgment nebo ranking

## 📚 Dokumentace

Kompletní implementační plán: [../plan.md](../plan.md)

---

**Vytvořeno s ❤️ pro lepší engineering practices**

🎉 **Aplikace je plně funkční a připravená k použití!**
