import { AssessmentFramework } from '../types/assessment';

export const assessmentFramework: AssessmentFramework = {
  areas: [
    {
      id: 'tech-debt',
      title: 'Tech Debt',
      emoji: '🧱',
      description: 'Evaluates code quality, architecture, infrastructure, process, and knowledge debt',
      subAxes: [
        {
          id: 'code-quality',
          title: 'Code Quality Debt',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'No consistent reviews, duplication everywhere. Code inconsistent, high complexity, no shared standards or ownership.',
              example: 'No PR reviews, code copied instead of reused, no linting'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'PR reviews exist but no static checks. Manual reviews done inconsistently; no linting or static analysis; quality depends on individuals.',
              example: 'Some code reviews happen, but no automation or standards'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Linting & SonarQube in CI; code-owner rules. Consistent PR reviews; automated style and quality checks in CI; ownership defined.',
              example: 'CI blocks merges on quality issues, CODEOWNERS enforced'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Automated checks + refactoring backlog; clean metrics trend down. Static analysis, code smells tracked; refactoring backlog prioritized; technical debt trend improving (Sonar metrics down).',
              example: 'Tech debt items in sprint backlog, metrics show improvement'
            }
          ]
        },
        {
          id: 'architecture-domain',
          title: 'Architecture / Domain Debt',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Monolith / tight coupling. Code and domains are tangled; any change affects multiple areas. No clear ownership.',
              example: 'Changing one feature breaks unrelated parts of the system'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Some domains defined; unclear API contracts. Partial separation, but boundaries fuzzy; APIs leak internal logic; unclear data ownership.',
              example: 'Services exist but share databases and internal models'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Clear bounded contexts; service boundaries reviewed. Domains explicitly defined; APIs stable and versioned; cross-domain dependencies reviewed regularly.',
              example: 'Each service has clear responsibility, versioned APIs'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Architecture validated by Fitness Functions; ADR history maintained. Teams own independent bounded contexts; minimal coupling; contracts tested automatically and documented.',
              example: 'Automated contract tests, architecture decision records maintained'
            }
          ]
        },
        {
          id: 'infrastructure',
          title: 'Infrastructure Debt',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Fully manual process, inconsistent environments.',
              example: 'Dev, staging, and prod environments configured differently'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Some automation exists, but still requires manual steps or supervision.',
              example: 'Deployment scripts exist but need manual intervention'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Reliable CI/CD with rollback.',
              example: 'One-click deploys with tested rollback procedures'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Full infra-as-code; zero-touch deploy; blue-green or canary releases.',
              example: 'Terraform/Pulumi manages all infrastructure, automated canary deploys'
            }
          ]
        },
        {
          id: 'process-delivery',
          title: 'Process / Delivery Debt',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Deploys happen anytime, nobody tracks what went out.',
              example: 'No release notes, unclear what changed in production'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Some rules exist (code review, tagging), but people often skip them.',
              example: 'Guidelines exist but not always followed'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Releases follow a defined flow; everyone knows what\'s deployed and when.',
              example: 'Release checklist, deployment calendar, change log'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Deploys fully automated; system tracks DORA metrics automatically.',
              example: 'Deployment frequency, lead time, CFR tracked automatically'
            }
          ]
        },
        {
          id: 'knowledge',
          title: 'Knowledge Debt',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Context in people\'s heads. README outdated; no ADRs.',
              example: 'Only one person knows how the system works'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'README outdated; no ADRs.',
              example: 'Some documentation exists but often out of date'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Docs & ADRs for major services.',
              example: 'Architecture decision records for key decisions'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Continuous documentation; onboarding < 1 day.',
              example: 'New team members productive within a day, living documentation'
            }
          ]
        }
      ]
    },
    {
      id: 'testing-automation',
      title: 'Testing & Automation',
      emoji: '🧪',
      description: 'Evaluates unit testing, integration testing, E2E coverage, pipeline reliability, and deployment automation',
      subAxes: [
        {
          id: 'unit-testing',
          title: 'Unit Testing Coverage',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'No meaningful tests; manual validation only.',
              example: 'Tests don\'t exist or are commented out'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Basic unit tests on key logic; not enforced in CI.',
              example: 'Some tests exist but can be bypassed'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Solid coverage of critical code; tests run automatically in CI.',
              example: 'CI fails on missing tests for new code'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'High-confidence unit suite; fast, stable, and used as living spec.',
              example: 'Tests serve as documentation, 100% of critical paths covered'
            }
          ]
        },
        {
          id: 'integration-testing',
          title: 'Integration Testing',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'No automated integration testing.',
              example: 'Service interactions tested manually if at all'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Few manual or partial API tests.',
              example: 'Postman collections maintained manually'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Contract tests between main services; checked in CI.',
              example: 'Pact or similar contract testing in place'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Full API contract validation in pipeline; auto-generated mocks and alerts on contract breaks.',
              example: 'Contract changes trigger notifications, automated mock generation'
            }
          ]
        },
        {
          id: 'e2e-flow',
          title: 'E2E Flow Coverage',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Only manual smoke tests after deploy.',
              example: 'Someone clicks through the app after each release'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Some automated E2E tests on main flows; run nightly.',
              example: 'Cypress/Playwright tests exist but often break'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Key business flows automated and part of CI.',
              example: 'Critical user journeys verified on every deploy'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Critical journeys fully automated; regression E2E suite runs on every deploy.',
              example: 'Comprehensive E2E suite, stable and maintained'
            }
          ]
        },
        {
          id: 'pipeline-reliability',
          title: 'Pipeline Reliability',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Builds often fail or give false results.',
              example: 'Flaky tests ignored, builds fail randomly'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Pipeline sometimes flaky; unclear root cause.',
              example: 'Tests fail intermittently, reruns common'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Reliable CI/CD; success > 95%, flaky < 5%.',
              example: 'Pipeline failures are actionable, rarely flaky'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Self-healing pipelines; > 98% success; issues visible and auto-reported.',
              example: 'Pipeline metrics tracked, automatic retry for infrastructure issues'
            }
          ]
        },
        {
          id: 'deployment-automation',
          title: 'Deployment Automation',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Deploys done by hand (SSH, scripts, manual config). No rollback, high risk of error.',
              example: 'SSH into server, run commands manually'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Basic scripts or CI jobs exist, but require manual input or approvals. Rollback unclear or manual.',
              example: 'Jenkins job requires manual approval, rollback is manual'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'One-click deploy from CI/CD; rollback tested and documented. No direct server access needed.',
              example: 'GitHub Actions deploys, rollback is documented procedure'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Fully automated delivery pipeline with health checks, canary or blue-green releases, and automatic rollback.',
              example: 'Canary deployments with automatic rollback on errors'
            }
          ]
        }
      ]
    },
    {
      id: 'observability-stability',
      title: 'Observability & Stability',
      emoji: '🔍',
      description: 'Evaluates monitoring, alerting, incident response, logging, and postmortem culture',
      subAxes: [
        {
          id: 'monitoring',
          title: 'Monitoring Coverage',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'No metrics or alerts; rely on user reports.',
              example: 'Users report issues before team knows'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Basic infra metrics (CPU/RAM); missing ownership.',
              example: 'Grafana dashboards exist but nobody looks at them'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Key services monitored with clear owners; SLOs for core SLIs.',
              example: 'Error rates, latency tracked with SLO targets'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Full observability stack (SLI/SLO/Error Budget) across services; live dashboards used daily by teams.',
              example: 'Error budgets guide release decisions, dashboards in team rituals'
            }
          ]
        },
        {
          id: 'alert-hygiene',
          title: 'Alert Hygiene & On-Call Discipline',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Alerts noisy or ignored; no on-call setup.',
              example: 'Alert fatigue, nobody responds to pages'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Some alerts tuned; on-call rotation informal or inconsistent.',
              example: 'On-call exists but not well defined'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Alerts actionable (>80%); OpsGenie used for ack/close tracking; P1/P2 severity respected.',
              example: 'Every alert has a runbook, severity levels enforced'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'On-call fully operational; all alerts actionable; MTTA/MTTR auto-tracked; no ignored pages.',
              example: 'Zero alert fatigue, all pages result in action'
            }
          ]
        },
        {
          id: 'incident-response',
          title: 'Incident Response (MTTR)',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Incidents ad-hoc; no tracking or ownership.',
              example: 'Incidents handled in Slack, no formal process'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Incidents logged manually; response unstructured.',
              example: 'Tickets created after the fact, no clear process'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'MTTR measured; Severity levels defined; RCA (Root Cause Analyses) required for P1s.',
              example: 'Incident commander role, RCAs for major incidents'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'MTTR <1h; incident auto-created in OpsGenie; RCA auto-linked; lessons shared org-wide.',
              example: 'Automated incident creation, learnings database'
            }
          ]
        },
        {
          id: 'logging-tracing',
          title: 'Logging / Tracing',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Scattered logs; no correlation.',
              example: 'Logs on different servers, hard to correlate'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Structured logs; tracing partial on key flows.',
              example: 'JSON logs but no distributed tracing'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Centralized logs; tracing active on top paths; searchable incidents.',
              example: 'ELK/Datadog with correlation IDs on main flows'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Full distributed tracing (100%); correlation IDs from edge to DB; logs auto-correlated with incidents.',
              example: 'OpenTelemetry traces all requests, auto-linked to incidents'
            }
          ]
        },
        {
          id: 'postmortems',
          title: 'Postmortems & Learning',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'None or blame-based.',
              example: 'No postmortems or finger-pointing culture'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Written ad-hoc; no follow-up.',
              example: 'Postmortems written but action items not tracked'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Formal RCAs for major incidents; improvement items tracked.',
              example: 'Blameless postmortems, action items in backlog'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'RCAs for all Severity 1-2s; learnings feed Tech Health backlog; trends reviewed in Tech Health Review.',
              example: 'Learning culture, trends analyzed for systemic issues'
            }
          ]
        }
      ]
    },
    {
      id: 'delivery-dora',
      title: 'Delivery Performance (DORA)',
      emoji: '⚡',
      description: 'Evaluates deployment frequency, lead time, change failure rate, recovery time, and rollback frequency',
      subAxes: [
        {
          id: 'deployment-frequency',
          title: 'Deployment Frequency (DF)',
          levels: [
            {
              level: 1,
              label: 'Low',
              description: '< 1 deploy / month.',
              example: 'Monthly or quarterly releases'
            },
            {
              level: 2,
              label: 'Medium',
              description: 'Weekly deploys.',
              example: 'Regular weekly release cadence'
            },
            {
              level: 3,
              label: 'High',
              description: 'Daily or per feature branch.',
              example: 'Multiple deploys per day'
            },
            {
              level: 4,
              label: 'Elite',
              description: 'On-demand / continuous delivery.',
              example: 'Deploy whenever needed, multiple times per day'
            }
          ]
        },
        {
          id: 'lead-time',
          title: 'Lead Time for Changes (LTC)',
          levels: [
            {
              level: 1,
              label: 'Low',
              description: '> 7 days.',
              example: 'Weeks from commit to production'
            },
            {
              level: 2,
              label: 'Medium',
              description: '2–7 days.',
              example: 'About a week from commit to production'
            },
            {
              level: 3,
              label: 'High',
              description: '1–2 days.',
              example: 'Next day deployment'
            },
            {
              level: 4,
              label: 'Elite',
              description: '< 24h from commit to prod.',
              example: 'Same-day deployment'
            }
          ]
        },
        {
          id: 'change-failure-rate',
          title: 'Change Failure Rate (CFR)',
          levels: [
            {
              level: 1,
              label: 'High',
              description: '> 25%.',
              example: 'More than 1 in 4 changes cause issues'
            },
            {
              level: 2,
              label: 'Medium',
              description: '15–25%.',
              example: 'About 1 in 5 changes cause issues'
            },
            {
              level: 3,
              label: 'Low',
              description: '5–15%.',
              example: 'Less than 1 in 10 changes cause issues'
            },
            {
              level: 4,
              label: 'Elite',
              description: '< 5%.',
              example: 'Very rare production issues'
            }
          ]
        },
        {
          id: 'mean-time-recovery',
          title: 'Mean Time to Recovery (MTTR)',
          levels: [
            {
              level: 1,
              label: 'High',
              description: '> 6h.',
              example: 'Hours to recover from incidents'
            },
            {
              level: 2,
              label: 'Medium',
              description: '2–6h.',
              example: 'Few hours to recover'
            },
            {
              level: 3,
              label: 'Low',
              description: '1–2h.',
              example: 'About an hour to recover'
            },
            {
              level: 4,
              label: 'Elite',
              description: '< 1h.',
              example: 'Minutes to recover from incidents'
            }
          ]
        },
        {
          id: 'rollback-frequency',
          title: 'Rollback Frequency',
          levels: [
            {
              level: 1,
              label: 'High',
              description: 'Frequent rollbacks.',
              example: 'Rollback more than 25% of deploys'
            },
            {
              level: 2,
              label: 'Medium',
              description: 'Occasional.',
              example: 'Rollback 10-25% of deploys'
            },
            {
              level: 3,
              label: 'Low',
              description: 'Rare (< 10%).',
              example: 'Rollback less than 10% of deploys'
            },
            {
              level: 4,
              label: 'Elite',
              description: 'Exceptional (< 3%).',
              example: 'Almost never need to rollback'
            }
          ]
        }
      ]
    },
    {
      id: 'governance-knowledge',
      title: 'Governance & Knowledge',
      emoji: '🧠',
      description: 'Evaluates ADR discipline, decision traceability, architecture docs, ownership, and transparency',
      subAxes: [
        {
          id: 'adr-discipline',
          title: 'ADR Discipline',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'No record of decisions; context lost.',
              example: 'Decisions made in Slack, no documentation'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'A few ADRs written reactively, not shared.',
              example: 'Some ADRs exist but not consistently created'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'ADRs created for all significant technical or architectural changes.',
              example: 'ADR template used, required for major decisions'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'ADRs standardized via template; reviewed quarterly; both team-level and global ADRs maintained.',
              example: 'ADR review process, searchable repository'
            }
          ]
        },
        {
          id: 'decision-traceability',
          title: 'Decision Traceability',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'No linkage to delivery work (Jira, Epics).',
              example: 'Can\'t trace why decisions were made'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Partial linkage; some ADRs referenced manually.',
              example: 'Occasional links between tickets and ADRs'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Decisions traceable to delivery items in ≥80% of cases where applicable.',
              example: 'Epics link to ADRs, clear decision trail'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Full traceability: each Epic or initiative links to its ADR; org-wide ADRs referenced in standards and playbooks.',
              example: 'Complete decision graph, automated linking'
            }
          ]
        },
        {
          id: 'architecture-docs',
          title: 'Architecture Docs',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'None or outdated diagrams.',
              example: 'Architecture knowledge in people\'s heads'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Partial or inconsistent C4 documentation.',
              example: 'Some diagrams exist but not maintained'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Up-to-date diagrams for core domains; shared in team space.',
              example: 'C4 diagrams for main services, regularly updated'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Comprehensive Arc42-style documentation; automated generation from code/config.',
              example: 'Documentation generated from code, always current'
            }
          ]
        },
        {
          id: 'ownership-clarity',
          title: 'Ownership Clarity',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Undefined; "who owns this?" is unclear.',
              example: 'Nobody knows who to call when service fails'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Some ownership lists exist, not maintained.',
              example: 'Outdated ownership spreadsheet'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Clear ownership in Backstage; on-call mapping exists.',
              example: 'Service catalog with owners, on-call schedule'
            },
            {
              level: 4,
              label: 'Optimized',
              description: 'Ownership isn\'t just written down — it\'s proven by operations. The team that has it on the dashboard and gets the alerts owns it.',
              example: 'Operational ownership, dashboards and alerts aligned'
            }
          ]
        },
        {
          id: 'transparency',
          title: 'Transparency',
          levels: [
            {
              level: 1,
              label: 'Chaotic',
              description: 'Context closed within teams; decisions siloed.',
              example: 'Information hoarding, no cross-team visibility'
            },
            {
              level: 2,
              label: 'Emerging',
              description: 'Shared internally but not visible org-wide.',
              example: 'Team docs exist but not discoverable'
            },
            {
              level: 3,
              label: 'Defined',
              description: 'Visible across engineering; ADRs and docs accessible to all.',
              example: 'Central wiki, searchable documentation'
            },
            {
              level: 4,
              label: 'Optimized',
              description: '"Public by default" culture: decisions and lessons reviewed quarterly in Tech Health Review.',
              example: 'Radical transparency, regular knowledge sharing'
            }
          ]
        }
      ]
    }
  ],
  pulseSurvey: [
    {
      id: 'pulse-tech-debt',
      question: 'How much does tech debt slow you down?',
      purpose: 'Detects friction sources',
      min: 0,
      max: 10
    },
    {
      id: 'pulse-release',
      question: 'How smooth is your release process?',
      purpose: 'Checks delivery flow confidence',
      min: 0,
      max: 10
    },
    {
      id: 'pulse-time',
      question: 'Do you have time for stability / engineering work?',
      purpose: 'Validates 25% allocation reality',
      min: 0,
      max: 10
    },
    {
      id: 'pulse-support',
      question: 'Do you feel leadership supports technical investment?',
      purpose: 'Measures cultural alignment',
      min: 0,
      max: 10
    },
    {
      id: 'pulse-tools',
      question: 'Are your tools / environments effective?',
      purpose: 'Surfaces DevEx blockers',
      min: 0,
      max: 10
    }
  ]
};
