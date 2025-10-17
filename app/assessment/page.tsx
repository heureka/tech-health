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
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import AreaAssessment from '@/components/assessment/AreaAssessment';
import PulseSurvey from '@/components/assessment/PulseSurvey';

export default function AssessmentPage() {
  const router = useRouter();
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

  // Load saved assessment on mount
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Tech Health Assessment</h1>
            <div className="text-sm text-slate-600">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

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
      </div>
    </div>
  );
}
