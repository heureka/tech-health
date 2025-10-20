import {
  AssessmentResponse,
  AssessmentResults,
  AreaScore,
  MaturityLevel,
  Recommendation,
  CompassPosition,
} from '../types/assessment';
import { assessmentFramework } from '../data/assessment-data';

export function calculateResults(
  response: AssessmentResponse
): AssessmentResults {
  const areaScores: AreaScore[] = [];
  let totalScore = 0;
  let totalSubAxes = 0;

  // Calculate scores for each area
  assessmentFramework.areas.forEach((area) => {
    const subAxisScores = area.subAxes.map((subAxis) => {
      const score = response.scores[subAxis.id];
      return {
        subAxisId: subAxis.id,
        subAxisTitle: subAxis.title,
        level: score?.level || 0,
        comment: score?.comment,
      };
    });

    const validScores = subAxisScores.filter((s) => s.level > 0);
    const areaAverage =
      validScores.length > 0
        ? validScores.reduce((sum, s) => sum + s.level, 0) / validScores.length
        : 0;

    areaScores.push({
      areaId: area.id,
      areaTitle: area.title,
      averageScore: areaAverage,
      subAxisScores,
    });

    totalScore += areaAverage * validScores.length;
    totalSubAxes += validScores.length;
  });

  const overall = totalSubAxes > 0 ? totalScore / totalSubAxes : 0;
  const maturityLevel = getMaturityLevel(overall);
  const recommendations = generateRecommendations(areaScores);

  // Calculate pulse survey average (only numeric values)
  const pulseValues = Object.values(response.pulseScores).filter(
    (v) => v !== undefined && v !== null && typeof v === 'number'
  ) as number[];
  const pulseAverage =
    pulseValues.length > 0
      ? pulseValues.reduce((sum, v) => sum + v, 0) / pulseValues.length
      : 0;

  // Calculate Compass position
  const compass = calculateCompassPosition(areaScores);

  return {
    overall,
    maturityLevel,
    areaScores,
    pulseAverage,
    recommendations,
    compass,
    completedAt: new Date().toISOString(),
  };
}

export function getMaturityLevel(score: number): MaturityLevel {
  if (score < 2.0) return 'unstable';
  if (score < 3.0) return 'emerging';
  if (score < 3.5) return 'defined';
  return 'optimized';
}

export function getMaturityDescription(level: MaturityLevel): {
  label: string;
  description: string;
  action: string;
} {
  const descriptions = {
    unstable: {
      label: 'Unstable, reactive',
      description:
        'Your team is in reactive mode with significant technical challenges.',
      action: 'Create recovery plan; add to Tech Big Rocks.',
    },
    emerging: {
      label: 'Emerging discipline',
      description:
        'Your team has started building good practices but they\'re not yet consistent.',
      action: 'Prioritize automation & documentation.',
    },
    defined: {
      label: 'Stable baseline',
      description:
        'Your team has established solid processes and metrics for critical flows.',
      action: 'Sustain & optimize critical paths.',
    },
    optimized: {
      label: 'Optimized, data-driven',
      description:
        'Your team operates with excellent automation, measurement, and continuous improvement.',
      action: 'Share practices; help mentor others.',
    },
  };

  return descriptions[level];
}

function generateRecommendations(areaScores: AreaScore[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  areaScores.forEach((area) => {
    // Find sub-axes with lowest scores
    const lowScores = area.subAxisScores
      .filter((s) => s.level > 0 && s.level < 3)
      .sort((a, b) => a.level - b.level);

    if (lowScores.length > 0) {
      const lowest = lowScores[0];
      const priority =
        lowest.level === 1 ? 'high' : lowest.level === 2 ? 'medium' : 'low';

      recommendations.push({
        priority,
        areaId: area.areaId,
        areaTitle: area.areaTitle,
        issue: `${lowest.subAxisTitle} is at Level ${lowest.level}`,
        action: getActionForSubAxis(area.areaId, lowest.subAxisId),
        impact: getImpactForArea(area.areaId),
      });
    }

    // If area average is low, add area-level recommendation
    if (area.averageScore < 2.5 && area.averageScore > 0) {
      recommendations.push({
        priority: 'high',
        areaId: area.areaId,
        areaTitle: area.areaTitle,
        issue: `Overall ${area.areaTitle} score is ${area.averageScore.toFixed(1)}`,
        action: `Invest in ${area.areaTitle} as a strategic priority this quarter`,
        impact: getImpactForArea(area.areaId),
      });
    }
  });

  // Sort by priority
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return recommendations.slice(0, 10); // Top 10 recommendations
}

function getActionForSubAxis(
  areaId: string,
  subAxisId: string
): string {
  const actions: Record<string, Record<string, string>> = {
    'tech-debt': {
      'code-quality': 'Implement SonarQube in CI pipeline and establish code review standards',
      'architecture-domain': 'Document bounded contexts and define clear service boundaries',
      infrastructure: 'Start infrastructure-as-code initiative with Terraform or similar',
      'process-delivery': 'Establish release checklist and deployment calendar',
      knowledge: 'Create Architecture Decision Record (ADR) template and start documenting key decisions',
    },
    'testing-automation': {
      'unit-testing': 'Set minimum test coverage requirement and add to CI',
      'integration-testing': 'Implement contract testing between main services',
      'e2e-flow': 'Automate critical user journeys with Cypress or Playwright',
      'pipeline-reliability': 'Investigate and fix flaky tests, track CI success rate',
      'deployment-automation': 'Implement one-click deployment with documented rollback',
    },
    'observability-stability': {
      monitoring: 'Define SLIs and SLOs for critical services',
      'alert-hygiene': 'Audit alerts, add runbooks, and establish on-call rotation',
      'incident-response': 'Implement incident management process with clear severity levels',
      'logging-tracing': 'Centralize logs and add correlation IDs to requests',
      postmortems: 'Establish blameless postmortem process for all P1/P2 incidents',
    },
    'delivery-dora': {
      'deployment-frequency': 'Reduce batch size and increase deployment frequency',
      'lead-time': 'Identify and remove bottlenecks in deployment pipeline',
      'change-failure-rate': 'Invest in test automation and deployment safety checks',
      'mean-time-recovery': 'Improve monitoring and practice rollback procedures',
      'rollback-frequency': 'Increase test coverage and implement canary deployments',
    },
    'governance-knowledge': {
      'adr-discipline': 'Require ADRs for all significant technical decisions',
      'decision-traceability': 'Link ADRs to Epics and initiatives in project management tool',
      'architecture-docs': 'Create C4 diagrams for main services and update quarterly',
      'ownership-clarity': 'Document service ownership and on-call responsibilities',
      transparency: 'Establish regular knowledge sharing sessions across teams',
    },
  };

  return actions[areaId]?.[subAxisId] || 'Prioritize improvement in this area';
}

function getImpactForArea(areaId: string): string {
  const impacts: Record<string, string> = {
    'tech-debt':
      'Reduces technical friction, enables faster feature delivery, and improves code maintainability',
    'testing-automation':
      'Increases deployment confidence, reduces production incidents, and accelerates feedback loops',
    'observability-stability':
      'Enables proactive incident prevention, faster recovery times, and better user experience',
    'delivery-dora':
      'Improves time-to-market, reduces deployment risk, and enables continuous delivery',
    'governance-knowledge':
      'Preserves organizational knowledge, improves decision quality, and enables team scalability',
  };

  return impacts[areaId] || 'Improves overall technical health';
}

export function getCompletionPercentage(
  response: Partial<AssessmentResponse>
): number {
  if (!response.scores) return 0;

  const totalSubAxes = assessmentFramework.areas.reduce(
    (sum, area) => sum + area.subAxes.length,
    0
  );
  const completedSubAxes = Object.keys(response.scores).length;

  return Math.round((completedSubAxes / totalSubAxes) * 100);
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getScoreColor(score: number): string {
  if (score < 2) return 'text-red-600';
  if (score < 3) return 'text-yellow-600';
  if (score < 3.5) return 'text-green-600';
  return 'text-emerald-700';
}

export function getMaturityColor(level: MaturityLevel): string {
  const colors = {
    unstable: 'bg-red-100 text-red-800 border-red-300',
    emerging: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    defined: 'bg-green-100 text-green-800 border-green-300',
    optimized: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };
  return colors[level];
}

/**
 * Calculate Speed-Sustainability Compass position
 * Based on the Heureka evaluation framework
 *
 * Speed (0-100): Ability to deliver value quickly
 * - Delivery DORA metrics (from delivery-dora area)
 * - Testing & Automation maturity
 *
 * Sustainability (0-100): Ability to recover, stay reliable, and invest in long-term health
 * - Observability & Stability
 * - Tech Debt management
 * - Governance & Knowledge
 */
export function calculateCompassPosition(areaScores: AreaScore[]): CompassPosition {
  // Find relevant area scores
  const deliveryDora = areaScores.find(a => a.areaId === 'delivery-dora');
  const testingAutomation = areaScores.find(a => a.areaId === 'testing-automation');
  const observability = areaScores.find(a => a.areaId === 'observability-stability');
  const techDebt = areaScores.find(a => a.areaId === 'tech-debt');
  const governance = areaScores.find(a => a.areaId === 'governance-knowledge');

  // Calculate Speed score (0-100)
  // Speed = ability to deliver quickly (DORA DF + Lead Time + Testing/Deployment automation)
  const speedComponents = [
    deliveryDora?.averageScore || 0,
    testingAutomation?.averageScore || 0,
  ];
  const speedAverage = speedComponents.reduce((sum, s) => sum + s, 0) / speedComponents.length;
  const speed = Math.round((speedAverage / 4) * 100); // Convert 1-4 scale to 0-100

  // Calculate Sustainability score (0-100)
  // Sustainability = ability to recover, stay reliable, manage debt (CFR, MTTR, SLOs, Tech Debt, Governance)
  const sustainabilityComponents = [
    observability?.averageScore || 0,
    techDebt?.averageScore || 0,
    governance?.averageScore || 0,
  ];
  const sustainabilityAverage = sustainabilityComponents.reduce((sum, s) => sum + s, 0) / sustainabilityComponents.length;
  const sustainability = Math.round((sustainabilityAverage / 4) * 100); // Convert 1-4 scale to 0-100

  // Determine interpretation
  const difference = Math.abs(speed - sustainability);
  let interpretation: CompassPosition['interpretation'];

  if (difference <= 10) {
    interpretation = 'balanced';
  } else if (speed > sustainability) {
    interpretation = 'speed-heavy';
  } else {
    interpretation = 'sustainability-heavy';
  }

  return {
    speed,
    sustainability,
    interpretation,
  };
}

export function getCompassInterpretation(position: CompassPosition): {
  label: string;
  description: string;
  action: string;
  emoji: string;
} {
  const interpretations = {
    'speed-heavy': {
      label: 'Speed-Heavy',
      emoji: '⚡',
      description: 'Fast but potentially fragile. You can deliver quickly, but may have reliability challenges.',
      action: 'Increase stability allocation to 40%; focus on alerting, monitoring, and CI reliability to prevent burnout.',
    },
    'sustainability-heavy': {
      label: 'Sustainability-Heavy',
      emoji: '🛡️',
      description: 'Over-invested in maintenance. Systems are stable but innovation may be slowing down.',
      action: 'Shift 10% capacity back to feature delivery. Your foundation is strong - time to build on it.',
    },
    'balanced': {
      label: 'Balanced',
      emoji: '🎯',
      description: 'Healthy balance between execution speed and system resilience.',
      action: 'Maintain current practices and share your learnings with other teams.',
    },
  };

  return interpretations[position.interpretation];
}
