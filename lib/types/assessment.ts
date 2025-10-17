// TypeScript types for Tech Health Framework Assessment

export interface AssessmentFramework {
  areas: AssessmentArea[];
  pulseSurvey: PulseQuestion[];
}

export interface AssessmentArea {
  id: string;
  title: string;
  emoji: string;
  description: string;
  subAxes: SubAxis[];
}

export interface SubAxis {
  id: string;
  title: string;
  levels: Level[];
}

export interface Level {
  level: 1 | 2 | 3 | 4;
  label: string;
  description: string;
  example: string;
}

export interface PulseQuestion {
  id: string;
  question: string;
  purpose: string;
  type?: 'slider' | 'textarea';
  min?: number;
  max?: number;
}

// User responses
export interface TeamInfo {
  teamName: string;
  date: string;
  participants: string[];
  notes?: string;
}

export interface SubAxisScore {
  level: 1 | 2 | 3 | 4;
  comment?: string;
}

export interface AssessmentResponse {
  teamInfo: TeamInfo;
  scores: Record<string, SubAxisScore>;
  pulseScores: Record<string, number | string>;
}

// Results and analysis
export type MaturityLevel = 'unstable' | 'emerging' | 'defined' | 'optimized';

export interface AreaScore {
  areaId: string;
  areaTitle: string;
  averageScore: number;
  subAxisScores: {
    subAxisId: string;
    subAxisTitle: string;
    level: number;
    comment?: string;
  }[];
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  areaId: string;
  areaTitle: string;
  issue: string;
  action: string;
  impact: string;
}

export interface AssessmentResults {
  overall: number;
  maturityLevel: MaturityLevel;
  areaScores: AreaScore[];
  pulseAverage: number;
  recommendations: Recommendation[];
  completedAt: string;
}

// Form state
export interface WizardStep {
  step: number;
  title: string;
  areaId?: string;
  completed: boolean;
}
