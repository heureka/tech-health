'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { assessmentFramework } from '@/lib/data/assessment-data';
import { AssessmentResponse, SubAxisScore, TeamInfo } from '@/lib/types/assessment';
import { saveAssessment, loadAssessment } from '@/lib/utils/storage';
import { ArrowLeft, ArrowRight, Save, LayoutList, Rows3 } from 'lucide-react';
import AreaAssessment from '@/components/assessment/AreaAssessment';
import PulseSurvey from '@/components/assessment/PulseSurvey';
import CompactView from '@/components/assessment/CompactView';

type ViewMode = 'wizard' | 'compact';

export default function AssessmentPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('wizard');
  const [currentStep, setCurrentStep] = useState(0);
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    teamName: '',
    date: new Date().toISOString().split('T')[0],
    participants: [],
    notes: ''
  });
  const [scores, setScores] = useState<Record<string, SubAxisScore>>({});
  const [pulseScores, setPulseScores] = useState<Record<string, number>>({});
  const [participantsText, setParticipantsText] = useState('');

  const totalSteps = assessmentFramework.areas.length + 2; // team info + areas + pulse survey
  const progress = (currentStep / (totalSteps - 1)) * 100;

  // Load saved assessment and view mode on mount
  useEffect(() => {
    const saved = loadAssessment();
    if (saved) {
      if (saved.teamInfo) setTeamInfo(saved.teamInfo);
      if (saved.scores) setScores(saved.scores);
      if (saved.pulseScores) setPulseScores(saved.pulseScores);
      if (saved.teamInfo?.participants) {
        setParticipantsText(saved.teamInfo.participants.join(', '));
      }
    }

    // Load view mode preference
    const savedViewMode = localStorage.getItem('assessmentViewMode') as ViewMode;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Auto-save every change
  useEffect(() => {
    const response: Partial<AssessmentResponse> = {
      teamInfo: {
        ...teamInfo,
        participants: participantsText
          .split(',')
          .map(p => p.trim())
          .filter(p => p.length > 0)
      },
      scores,
      pulseScores
    };
    saveAssessment(response);
  }, [teamInfo, scores, pulseScores, participantsText]);

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem('assessmentViewMode', viewMode);
  }, [viewMode]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Final step - go to results
      const finalResponse: AssessmentResponse = {
        teamInfo: {
          ...teamInfo,
          participants: participantsText
            .split(',')
            .map(p => p.trim())
            .filter(p => p.length > 0)
        },
        scores,
        pulseScores
      };
      saveAssessment(finalResponse);
      router.push('/results');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      router.push('/');
    }
  };

  const handleScoreChange = (subAxisId: string, score: SubAxisScore) => {
    setScores(prev => ({
      ...prev,
      [subAxisId]: score
    }));
  };

  const handlePulseScoreChange = (questionId: string, value: number) => {
    setPulseScores(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return teamInfo.teamName.trim().length > 0;
    }
    if (currentStep > 0 && currentStep <= assessmentFramework.areas.length) {
      const area = assessmentFramework.areas[currentStep - 1];
      return area.subAxes.every(subAxis => scores[subAxis.id]?.level > 0);
    }
    if (currentStep === totalSteps - 1) {
      return assessmentFramework.pulseSurvey.every(q =>
        pulseScores[q.id] !== undefined && pulseScores[q.id] !== null
      );
    }
    return true;
  };

  const canViewResults = () => {
    // Check if team info is filled
    if (!teamInfo.teamName.trim()) return false;

    // Check if all areas are completed
    const allAreasComplete = assessmentFramework.areas.every(area =>
      area.subAxes.every(subAxis => scores[subAxis.id]?.level > 0)
    );

    // Check if pulse survey is complete
    const pulseSurveyComplete = assessmentFramework.pulseSurvey.every(q =>
      pulseScores[q.id] !== undefined && pulseScores[q.id] !== null
    );

    return allAreasComplete && pulseSurveyComplete;
  };

  const renderStep = () => {
    // Step 0: Team Information
    if (currentStep === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Team Information</CardTitle>
            <CardDescription>
              Tell us about your team before starting the assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                placeholder="e.g., Content Gang, Platform Team"
                value={teamInfo.teamName}
                onChange={(e) => setTeamInfo(prev => ({ ...prev, teamName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Assessment Date</Label>
              <Input
                id="date"
                type="date"
                value={teamInfo.date}
                onChange={(e) => setTeamInfo(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Participants (comma-separated)</Label>
              <Input
                id="participants"
                placeholder="e.g., John Doe, Jane Smith, Tech Lead"
                value={participantsText}
                onChange={(e) => setParticipantsText(e.target.value)}
              />
              <p className="text-sm text-slate-500">
                Recommended: Tech Lead / EM with 1-2 engineers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any context about this assessment..."
                value={teamInfo.notes}
                onChange={(e) => setTeamInfo(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      );
    }

    // Steps 1-5: Area Assessments
    if (currentStep > 0 && currentStep <= assessmentFramework.areas.length) {
      const area = assessmentFramework.areas[currentStep - 1];
      return (
        <AreaAssessment
          area={area}
          scores={scores}
          onScoreChange={handleScoreChange}
        />
      );
    }

    // Final step: Pulse Survey
    if (currentStep === totalSteps - 1) {
      return (
        <PulseSurvey
          questions={assessmentFramework.pulseSurvey}
          scores={pulseScores}
          onScoreChange={handlePulseScoreChange}
        />
      );
    }

    return null;
  };

  const getStepTitle = () => {
    if (currentStep === 0) return 'Team Information';
    if (currentStep > 0 && currentStep <= assessmentFramework.areas.length) {
      const area = assessmentFramework.areas[currentStep - 1];
      return `${area.emoji} ${area.title}`;
    }
    if (currentStep === totalSteps - 1) return '💬 Pulse Survey';
    return '';
  };

  const renderTeamInfo = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Team Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="teamName-compact">Team Name *</Label>
          <Input
            id="teamName-compact"
            placeholder="e.g., Content Gang, Platform Team"
            value={teamInfo.teamName}
            onChange={(e) => setTeamInfo(prev => ({ ...prev, teamName: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-compact">Assessment Date</Label>
            <Input
              id="date-compact"
              type="date"
              value={teamInfo.date}
              onChange={(e) => setTeamInfo(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants-compact">Participants</Label>
            <Input
              id="participants-compact"
              placeholder="e.g., John, Jane, Tech Lead"
              value={participantsText}
              onChange={(e) => setParticipantsText(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes-compact">Notes (optional)</Label>
          <Textarea
            id="notes-compact"
            placeholder="Any context about this assessment..."
            value={teamInfo.notes}
            onChange={(e) => setTeamInfo(prev => ({ ...prev, notes: e.target.value }))}
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Tech Health Assessment</h1>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
              <Button
                variant={viewMode === 'wizard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('wizard')}
                className="gap-2"
              >
                <LayoutList className="w-4 h-4" />
                <span className="hidden sm:inline">Wizard</span>
              </Button>
              <Button
                variant={viewMode === 'compact' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('compact')}
                className="gap-2"
              >
                <Rows3 className="w-4 h-4" />
                <span className="hidden sm:inline">Compact</span>
              </Button>
            </div>
          </div>

          {viewMode === 'wizard' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">
                  Step {currentStep + 1} of {totalSteps}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </>
          )}
        </div>

        {/* Wizard Mode */}
        {viewMode === 'wizard' && (
          <>
            {/* Step Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">{getStepTitle()}</h2>
              {currentStep === 0 && (
                <p className="text-slate-600 mt-2">
                  Assessment takes 20-30 minutes. Your progress is saved automatically.
                </p>
              )}
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 0 ? 'Home' : 'Previous'}
              </Button>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Save className="w-4 h-4" />
                Auto-saved
              </div>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2"
              >
                {currentStep === totalSteps - 1 ? 'View Results' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}

        {/* Compact Mode */}
        {viewMode === 'compact' && (
          <>
            <div className="mb-6">
              <p className="text-slate-600">
                Fill out all sections below. Your progress is saved automatically.
              </p>
            </div>

            {renderTeamInfo()}

            <CompactView
              areas={assessmentFramework.areas}
              pulseSurvey={assessmentFramework.pulseSurvey}
              scores={scores}
              pulseScores={pulseScores}
              onScoreChange={handleScoreChange}
              onPulseScoreChange={handlePulseScoreChange}
            />

            {/* Compact Mode Navigation */}
            <div className="mt-8 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Home
              </Button>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Save className="w-4 h-4" />
                Auto-saved
              </div>

              <Button
                onClick={() => {
                  const finalResponse: AssessmentResponse = {
                    teamInfo: {
                      ...teamInfo,
                      participants: participantsText
                        .split(',')
                        .map(p => p.trim())
                        .filter(p => p.length > 0)
                    },
                    scores,
                    pulseScores
                  };
                  saveAssessment(finalResponse);
                  router.push('/results');
                }}
                disabled={!canViewResults()}
                className="gap-2"
              >
                View Results
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
