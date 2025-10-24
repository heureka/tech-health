'use client';

import { PulseQuestion } from '@/lib/types/assessment';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

interface PulseSurveyProps {
  questions: PulseQuestion[];
  scores: Record<string, number | string>;
  onScoreChange: (questionId: string, value: number | string) => void;
}

const getScoreColor = (score: number): string => {
  if (score <= 3) return 'text-red-600';
  if (score <= 5) return 'text-orange-600';
  if (score <= 7) return 'text-yellow-600';
  return 'text-green-600';
};

const getScoreEmoji = (score: number): string => {
  if (score <= 2) return '😞';
  if (score <= 4) return '😕';
  if (score <= 6) return '😐';
  if (score <= 8) return '🙂';
  return '😄';
};

export default function PulseSurvey({ questions, scores, onScoreChange }: PulseSurveyProps) {
  const completedCount = questions.filter(q =>
    scores[q.id] !== undefined && scores[q.id] !== null
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-4xl">💬</span>
          Pulse Survey
        </CardTitle>
        <CardDescription className="text-base">
          Quick sentiment check on key aspects of your team&apos;s experience.
          <br />
          <strong className="text-slate-700">Scale: 0 = worst, 10 = best</strong>
        </CardDescription>
        <div className="text-sm text-slate-600 mt-2">
          Progress: {completedCount} / {questions.length} answered
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {questions.map((question, index) => {
            const score = scores[question.id];
            const hasScore = score !== undefined && score !== null && score !== '';
            const isTextarea = question.type === 'textarea';

            return (
              <div key={question.id} className="space-y-4 p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                    hasScore
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-300 text-slate-600'
                  }`}>
                    {hasScore ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <Label className="text-lg font-semibold block mb-1">
                      {question.question}
                    </Label>
                    <p className="text-sm text-slate-600 italic">
                      Purpose: {question.purpose}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 ml-11">
                  {isTextarea ? (
                    <Textarea
                      value={typeof score === 'string' ? score : ''}
                      onChange={(e) => onScoreChange(question.id, e.target.value)}
                      placeholder="Share what's slowing your team down..."
                      className="min-h-[100px] resize-y"
                    />
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">0 (Worst)</span>
                        {hasScore && typeof score === 'number' && (
                          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                            {score} {getScoreEmoji(score)}
                          </span>
                        )}
                        <span className="text-sm text-green-700 font-semibold">10 (Best)</span>
                      </div>

                      <Slider
                        value={[hasScore && typeof score === 'number' ? score : 5]}
                        onValueChange={(values) => onScoreChange(question.id, values[0])}
                        min={question.min ?? 0}
                        max={question.max ?? 10}
                        step={1}
                        className="w-full"
                      />

                      <div className="flex justify-between text-xs text-slate-500">
                        {Array.from({ length: 11 }, (_, i) => (
                          <span key={i} className={hasScore && score === i ? 'font-bold' : ''}>
                            {i}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-slate-700">
            <strong>💡 Tip:</strong> These questions capture the team&apos;s subjective experience.
            <strong className="text-green-700"> Higher scores = better.</strong> There are no wrong answers - be honest about how you feel right now.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
