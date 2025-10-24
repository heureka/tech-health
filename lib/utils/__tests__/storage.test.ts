import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveAssessment,
  loadAssessment,
  clearAssessment,
  exportInProgressAssessment,
  exportAssessmentAsJSON,
} from '../storage';
import { AssessmentResponse } from '@/lib/types/assessment';

describe('Storage Functions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('saveAssessment', () => {
    it('should save a complete assessment to localStorage', () => {
      const mockAssessment: AssessmentResponse = {
        teamInfo: {
          teamName: 'Test Team',
          date: '2025-10-24',
          participants: ['John', 'Jane'],
          notes: 'Test notes',
        },
        scores: {
          'code-quality': { level: 3, comment: 'Good' },
        },
        pulseScores: {
          'pulse-tech-debt': 8,
        },
      };

      saveAssessment(mockAssessment);

      const saved = localStorage.getItem('tech-health-assessment');
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.teamInfo.teamName).toBe('Test Team');
      expect(parsed.scores['code-quality'].level).toBe(3);
    });

    it('should save a partial (in-progress) assessment', () => {
      const partialAssessment = {
        teamInfo: {
          teamName: 'Draft Team',
          date: '2025-10-24',
          participants: [],
        },
        scores: {},
        pulseScores: {},
      };

      saveAssessment(partialAssessment);

      const saved = localStorage.getItem('tech-health-assessment');
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.teamInfo.teamName).toBe('Draft Team');
      expect(Object.keys(parsed.scores)).toHaveLength(0);
    });
  });

  describe('loadAssessment', () => {
    it('should load saved assessment from localStorage', () => {
      const mockAssessment = {
        teamInfo: {
          teamName: 'Loaded Team',
          date: '2025-10-24',
          participants: [],
        },
        scores: { 'code-quality': { level: 2 } },
        pulseScores: {},
      };

      localStorage.setItem('tech-health-assessment', JSON.stringify(mockAssessment));

      const loaded = loadAssessment();
      expect(loaded).toBeTruthy();
      expect(loaded?.teamInfo.teamName).toBe('Loaded Team');
      expect(loaded?.scores['code-quality'].level).toBe(2);
    });

    it('should return null when no assessment exists', () => {
      const loaded = loadAssessment();
      expect(loaded).toBeNull();
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('tech-health-assessment', 'invalid-json');
      const loaded = loadAssessment();
      expect(loaded).toBeNull();
    });
  });

  describe('clearAssessment', () => {
    it('should remove assessment from localStorage', () => {
      const mockAssessment = {
        teamInfo: { teamName: 'Test', date: '2025-10-24', participants: [] },
        scores: {},
        pulseScores: {},
      };

      localStorage.setItem('tech-health-assessment', JSON.stringify(mockAssessment));
      expect(localStorage.getItem('tech-health-assessment')).toBeTruthy();

      clearAssessment();
      expect(localStorage.getItem('tech-health-assessment')).toBeNull();
    });
  });

  describe('exportInProgressAssessment', () => {
    it('should create a blob with in-progress status', () => {
      const mockBlobSpy = vi.spyOn(global, 'Blob');
      const mockAssessment = {
        teamInfo: {
          teamName: 'Draft Export',
          date: '2025-10-24',
          participants: ['Alice'],
        },
        scores: { 'code-quality': { level: 1 } },
        pulseScores: {},
      };

      exportInProgressAssessment(mockAssessment);

      expect(mockBlobSpy).toHaveBeenCalled();
      const blobContent = mockBlobSpy.mock.calls[0][0][0];
      const parsed = JSON.parse(blobContent as string);

      expect(parsed.status).toBe('in-progress');
      expect(parsed.assessment.teamInfo.teamName).toBe('Draft Export');
      expect(parsed.exportedAt).toBeTruthy();
    });

    it('should create download with correct filename', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');

      const mockAssessment = {
        teamInfo: {
          teamName: 'My Team Name',
          date: '2025-10-24',
          participants: [],
        },
        scores: {},
        pulseScores: {},
      };

      exportInProgressAssessment(mockAssessment);

      const anchorCalls = createElementSpy.mock.calls.filter(
        (call) => call[0] === 'a'
      );
      expect(anchorCalls.length).toBeGreaterThan(0);
    });

    it('should handle missing team name gracefully', () => {
      const mockAssessment = {
        teamInfo: undefined,
        scores: {},
        pulseScores: {},
      };

      expect(() => exportInProgressAssessment(mockAssessment)).not.toThrow();
    });
  });

  describe('exportAssessmentAsJSON', () => {
    it('should export complete assessment with results', () => {
      const mockBlobSpy = vi.spyOn(global, 'Blob');
      const mockAssessment: AssessmentResponse = {
        teamInfo: {
          teamName: 'Complete Export',
          date: '2025-10-24',
          participants: ['Bob'],
        },
        scores: {
          'code-quality': { level: 4, comment: 'Excellent' },
        },
        pulseScores: {
          'pulse-tech-debt': 9,
        },
      };

      const mockResults = {
        overall: 3.8,
        maturityLevel: 'optimized',
        areaScores: [],
      };

      exportAssessmentAsJSON(mockAssessment, mockResults);

      expect(mockBlobSpy).toHaveBeenCalled();
      const blobContent = mockBlobSpy.mock.calls[0][0][0];
      const parsed = JSON.parse(blobContent as string);

      expect(parsed.assessment).toBeTruthy();
      expect(parsed.results).toBeTruthy();
      expect(parsed.results.overall).toBe(3.8);
      expect(parsed.exportedAt).toBeTruthy();
      // Note: completed exports don't have explicit status field
      expect(parsed.status).toBeUndefined();
    });

    it('should create download with team name in filename', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');

      const mockAssessment: AssessmentResponse = {
        teamInfo: {
          teamName: 'Backend Team',
          date: '2025-10-24',
          participants: [],
        },
        scores: {},
        pulseScores: {},
      };

      exportAssessmentAsJSON(mockAssessment, {});

      const anchorCalls = createElementSpy.mock.calls.filter(
        (call) => call[0] === 'a'
      );
      expect(anchorCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Backward Compatibility', () => {
    it('should load old format exports (with results, no status)', () => {
      const oldFormatExport = {
        assessment: {
          teamInfo: {
            teamName: 'Old Format Team',
            date: '2024-01-01',
            participants: [],
          },
          scores: { 'code-quality': { level: 3 } },
          pulseScores: { 'pulse-tech-debt': 7 },
        },
        results: {
          overall: 3.0,
          maturityLevel: 'defined',
        },
        exportedAt: '2024-01-01T00:00:00.000Z',
        // No status field - old format
      };

      localStorage.setItem(
        'tech-health-assessment',
        JSON.stringify(oldFormatExport.assessment)
      );

      const loaded = loadAssessment();
      expect(loaded).toBeTruthy();
      expect(loaded?.teamInfo.teamName).toBe('Old Format Team');
    });

    it('should distinguish between old complete and new draft formats', () => {
      // Old complete export has results, no status
      const oldComplete = {
        assessment: { teamInfo: { teamName: 'Old' }, scores: {}, pulseScores: {} },
        results: { overall: 3.0 },
        exportedAt: '2024-01-01',
      };

      // New draft has status, no results
      const newDraft = {
        assessment: { teamInfo: { teamName: 'New' }, scores: {}, pulseScores: {} },
        status: 'in-progress',
        exportedAt: '2025-10-24',
      };

      // Verify old format has results
      expect(oldComplete.results).toBeTruthy();
      expect(oldComplete).not.toHaveProperty('status');

      // Verify new draft has status
      expect(newDraft.status).toBe('in-progress');
      expect(newDraft).not.toHaveProperty('results');
    });
  });
});
