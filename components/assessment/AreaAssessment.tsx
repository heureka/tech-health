'use client';

import { AssessmentArea, SubAxisScore } from '@/lib/types/assessment';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import LevelSelector from './LevelSelector';

interface AreaAssessmentProps {
  area: AssessmentArea;
  scores: Record<string, SubAxisScore>;
  onScoreChange: (subAxisId: string, score: SubAxisScore) => void;
}

export default function AreaAssessment({ area, scores, onScoreChange }: AreaAssessmentProps) {
  const handleLevelSelect = (subAxisId: string, level: number) => {
    const currentScore = scores[subAxisId] || { level: 0, comment: '' };
    onScoreChange(subAxisId, {
      ...currentScore,
      level: level as 1 | 2 | 3 | 4
    });
  };

  const handleCommentChange = (subAxisId: string, comment: string) => {
    const currentScore = scores[subAxisId] || { level: 0, comment: '' };
    onScoreChange(subAxisId, {
      ...currentScore,
      comment
    });
  };

  const completedCount = area.subAxes.filter(
    subAxis => scores[subAxis.id]?.level > 0
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-4xl">{area.emoji}</span>
          {area.title}
        </CardTitle>
        <CardDescription className="text-base">
          {area.description}
        </CardDescription>
        <div className="text-sm text-slate-600 mt-2">
          Progress: {completedCount} / {area.subAxes.length} completed
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {area.subAxes.map((subAxis, index) => {
            const score = scores[subAxis.id];
            const isCompleted = score?.level > 0;

            return (
              <AccordionItem key={subAxis.id} value={subAxis.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className="font-medium">{subAxis.title}</span>
                    {isCompleted && score && (
                      <span className="text-sm text-slate-500">
                        (Level {score.level})
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-4">
                    {/* Level Selector */}
                    <div>
                      <Label className="text-base mb-4 block">
                        Select the level that best describes your team:
                      </Label>
                      <LevelSelector
                        levels={subAxis.levels}
                        selectedLevel={score?.level}
                        onSelect={(level) => handleLevelSelect(subAxis.id, level)}
                      />
                    </div>

                    {/* Comment Field */}
                    {isCompleted && (
                      <div className="space-y-2">
                        <Label htmlFor={`comment-${subAxis.id}`}>
                          Why this score? What&apos;s next? (optional)
                        </Label>
                        <Textarea
                          id={`comment-${subAxis.id}`}
                          placeholder="Add context: specific examples, planned improvements, blockers..."
                          value={score?.comment || ''}
                          onChange={(e) => handleCommentChange(subAxis.id, e.target.value)}
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
