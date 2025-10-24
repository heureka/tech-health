# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Tech Health Framework Configurator** - an interactive Next.js web application for conducting Tech Health assessments based on the Heureka Tech Health Framework. The app guides teams through a structured evaluation of their technical health across 5 main areas with 21 sub-axes, providing immediate visual feedback, scoring, and actionable recommendations.

## Common Commands

### Development
```bash
npm run dev          # Start development server with Turbopack on localhost:3000
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

### Testing & Validation
There are currently no automated tests in the project. Manual testing through the UI is required.

## Architecture Overview

### Data Flow Architecture

This is a **client-side-only Next.js application** with no backend API. All data flows through browser local storage:

1. **Input**: User completes assessment wizard in [app/assessment/page.tsx](app/assessment/page.tsx)
2. **Storage**: Auto-saved to localStorage via [lib/utils/storage.ts](lib/utils/storage.ts) on every change
3. **Calculation**: Results computed client-side in [lib/utils/scoring-logic.ts](lib/utils/scoring-logic.ts)
4. **Output**: Results displayed in [app/results/page.tsx](app/results/page.tsx), exportable as JSON

### Key Architectural Patterns

**Single Source of Truth**: [lib/data/assessment-data.ts](lib/data/assessment-data.ts) contains the complete framework definition:
- 5 assessment areas with emojis and descriptions
- 25 sub-axes (Tech Debt: 5, Testing: 5, Observability: 5, DORA: 5, Governance: 5)
- 100 level descriptions (4 levels × 25 sub-axes)
- 6 Pulse Survey questions (5 numeric sliders 0-10, 1 textarea)

**Type-Safe Data Model**: [lib/types/assessment.ts](lib/types/assessment.ts) defines all TypeScript interfaces:
- `AssessmentFramework`: The complete framework structure
- `AssessmentResponse`: User's answers (teamInfo, scores, pulseScores)
- `AssessmentResults`: Computed results with maturity level and recommendations
- All types are exported and used throughout the application

**Auto-Save Pattern**: Assessment wizard uses `useEffect` hooks to automatically save to localStorage on every state change (see [app/assessment/page.tsx](app/assessment/page.tsx:58-71))

**Maturity Level Calculation**: Four-level scoring system (1-4) averaged across sub-axes:
- 1.0-1.9: 🔴 Unstable (chaotic, reactive)
- 2.0-2.9: 🟠 Emerging (partial discipline)
- 3.0-3.4: 🟡 Defined (stable processes)
- 3.5-4.0: 🟢 Optimized (data-driven, automated)

**Speed-Sustainability Compass**: Visual leadership tool showing whether the team leans toward speed or sustainability (0-100 scale):
- **Speed** (⚡): Ability to deliver quickly - measured by DORA delivery metrics and Testing/Automation maturity
- **Sustainability** (🛡️): Ability to recover and stay reliable - measured by Observability, Tech Debt, and Governance
- **Balanced Zone**: Within 10 points difference = healthy balance
- **Speed-Heavy**: High delivery speed but potential reliability challenges → increase stability allocation
- **Sustainability-Heavy**: Over-invested in maintenance, innovation slowdown → shift capacity to features

### View Modes

The assessment supports two view modes (toggle persisted in localStorage):
- **Wizard Mode** (default): Step-by-step progression through areas
- **Compact View**: All areas visible at once for quick overview

## Component Architecture

### Assessment Components ([components/assessment/](components/assessment/))

- `AreaAssessment.tsx`: Accordion UI for one area's 5 sub-axes with level selectors and comment fields
- `LevelSelector.tsx`: Visual card selector for maturity levels 1-4 with color coding
- `PulseSurvey.tsx`: Slider inputs (0-10) and textarea for subjective team feedback
- `CompactView.tsx`: Alternative view showing all areas simultaneously

### Results Components ([components/results/](components/results/))

- `RadarChart.tsx`: Recharts-based pentagon radar chart showing 5 area scores
- `CompassChart.tsx`: SVG-based Speed-Sustainability Compass visualization with quadrant labels
- `Recommendations.tsx`: Prioritized action items generated from low scores

### UI Components ([components/ui/](components/ui/))

Standard shadcn/ui components built on Radix UI primitives. These are auto-generated and should not be manually edited unless necessary.

## Business Logic Details

### Scoring Algorithm ([lib/utils/scoring-logic.ts](lib/utils/scoring-logic.ts))

**Area Score Calculation**:
1. Average all sub-axis levels within an area (1-4)
2. Handle missing scores gracefully (only count completed sub-axes)
3. Overall score = weighted average of all 5 area averages

**Recommendation Generation**:
1. Identify sub-axes with scores < 3 (below "Defined" level)
2. Prioritize by level: Level 1 = high priority, Level 2 = medium
3. Add area-level recommendation if average < 2.5
4. Return top 10 recommendations sorted by priority
5. Each recommendation includes specific action and impact statement

**Pulse Survey Handling**:
- Numeric questions (0-10) are averaged for pulse score
- Textarea answers are stored but not scored
- Pulse results displayed separately from technical assessment

**Compass Position Calculation**:
1. **Speed Score** (0-100): Average of Delivery DORA + Testing/Automation areas, normalized to 0-100 scale
2. **Sustainability Score** (0-100): Average of Observability + Tech Debt + Governance areas, normalized to 0-100 scale
3. **Interpretation**:
   - Balanced: Difference ≤ 10 points
   - Speed-Heavy: Speed > Sustainability by > 10 points
   - Sustainability-Heavy: Sustainability > Speed by > 10 points
4. Provides actionable recommendations based on position (e.g., increase stability allocation if speed-heavy)

### Storage Layer ([lib/utils/storage.ts](lib/utils/storage.ts))

**Keys**:
- `tech-health-assessment`: Current in-progress assessment
- `tech-health-history`: Last 10 completed assessments (array)

**Functions**:
- `saveAssessment()`: Auto-save partial response
- `loadAssessment()`: Restore on page load
- `clearAssessment()`: Reset for new assessment
- `saveToHistory()`: Archive completed assessment
- `exportAssessmentAsJSON()`: Download complete data as JSON file

## Development Guidelines

### Git and Deployment Policy

**IMPORTANT**: Never push changes to the remote repository without explicit user permission. Always ask before running `git push`.

### Adding New Sub-Axes

1. Update [lib/data/assessment-data.ts](lib/data/assessment-data.ts):
   - Add sub-axis to appropriate area's `subAxes` array
   - Define all 4 levels with label, description, and example
2. Update [lib/utils/scoring-logic.ts](lib/utils/scoring-logic.ts):
   - Add action mapping in `getActionForSubAxis()`
3. No changes needed to types or components (they handle dynamic data)

### Adding New Assessment Areas

1. Update [lib/data/assessment-data.ts](lib/data/assessment-data.ts): Add new area object
2. Update [components/results/RadarChart.tsx](components/results/RadarChart.tsx): Adjust radar chart for N areas
3. Update [lib/utils/scoring-logic.ts](lib/utils/scoring-logic.ts): Add impact description for new area

### Modifying Maturity Level Thresholds

Edit `getMaturityLevel()` function in [lib/utils/scoring-logic.ts](lib/utils/scoring-logic.ts:69-74) to change score boundaries.

### UI Customization

- Colors and styling: Uses Tailwind CSS 4 with custom color scheme in maturity levels
- Level colors: Red (1) → Orange (2) → Yellow (3) → Green (4)
- Charts: Recharts library for radar visualization

## Important Implementation Notes

- **No Backend**: Everything runs client-side, including calculations and storage
- **Data Persistence**: Local storage only - no cloud sync or database
- **Session Resumption**: Users can close browser and resume assessment later
- **Export Format**: JSON export includes both raw responses and calculated results
- **Framework Version**: All level descriptions are embedded in code; updating requires new deployment

## Tech Stack

- **Framework**: Next.js 15 (App Router, client-side only)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts (radar chart)
- **Icons**: Lucide React
- **Storage**: Browser localStorage API
- **Build Tool**: Turbopack (Next.js dev server)

## Localization Note

The README and some UI text are in Czech (čeština), but code, comments, types, and variable names are in English. The application is designed for Heureka's Czech engineering teams.
