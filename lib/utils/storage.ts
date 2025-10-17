import { AssessmentResponse } from '../types/assessment';

const STORAGE_KEY = 'tech-health-assessment';
const HISTORY_KEY = 'tech-health-history';

export function saveAssessment(response: Partial<AssessmentResponse>): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
  } catch (error) {
    console.error('Failed to save assessment:', error);
  }
}

export function loadAssessment(): Partial<AssessmentResponse> | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load assessment:', error);
    return null;
  }
}

export function clearAssessment(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear assessment:', error);
  }
}

export interface AssessmentHistory {
  id: string;
  teamName: string;
  date: string;
  overall: number;
  maturityLevel: string;
}

export function saveToHistory(response: AssessmentResponse, results: { overall: number; maturityLevel: string }): void {
  if (typeof window === 'undefined') return;

  try {
    const history = loadHistory();
    const entry: AssessmentHistory = {
      id: Date.now().toString(),
      teamName: response.teamInfo.teamName,
      date: response.teamInfo.date,
      overall: results.overall,
      maturityLevel: results.maturityLevel,
    };

    history.unshift(entry);

    // Keep only last 10 assessments
    const trimmedHistory = history.slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export function loadHistory(): AssessmentHistory[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export function exportAssessmentAsJSON(response: AssessmentResponse, results: unknown): void {
  const exportData = {
    assessment: response,
    results: results,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tech-health-assessment-${response.teamInfo.teamName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
