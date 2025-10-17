'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { AssessmentArea, PulseQuestion, SubAxisScore } from '@/lib/types/assessment';
import AreaAssessment from './AreaAssessment';
import PulseSurvey from './PulseSurvey';
import { CheckCircle2, Circle } from 'lucide-react';

interface CompactViewProps {
  areas: AssessmentArea[];
  pulseSurvey: PulseQuestion[];
  scores: Record<string, SubAxisScore>;
  pulseScores: Record<string, number | string>;
  onScoreChange: (subAxisId: string, score: SubAxisScore) => void;
  onPulseScoreChange: (questionId: string, value: number | string) => void;
}

export default function CompactView({
  areas,
  pulseSurvey,
  scores,
  pulseScores,
  onScoreChange,
  onPulseScoreChange
}: CompactViewProps) {

  const getAreaCompletion = (area: AssessmentArea) => {
    const completed = area.subAxes.filter(subAxis => scores[subAxis.id]?.level > 0).length;
    const total = area.subAxes.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const getPulseCompletion = () => {
    const completed = pulseSurvey.filter(q => {
      const score = pulseScores[q.id];
      return score !== undefined && score !== null && score !== '';
    }).length;
    const total = pulseSurvey.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={['area-0']} className="space-y-4">
        {areas.map((area, index) => {
          const completion = getAreaCompletion(area);
          const isComplete = completion.completed === completion.total;

          return (
            <AccordionItem
              key={area.id}
              value={`area-${index}`}
              className="border rounded-lg bg-white shadow-sm"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    )}
                    <span className="text-2xl">{area.emoji}</span>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">{area.title}</h3>
                      <p className="text-sm text-slate-600">{area.description}</p>
                    </div>
                  </div>
                  <Badge variant={isComplete ? 'default' : 'outline'}>
                    {completion.completed} / {completion.total}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <AreaAssessment
                  area={area}
                  scores={scores}
                  onScoreChange={onScoreChange}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}

        {/* Pulse Survey */}
        <AccordionItem
          value="pulse-survey"
          className="border rounded-lg bg-white shadow-sm"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-3">
                {getPulseCompletion().completed === getPulseCompletion().total ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                )}
                <span className="text-2xl">💬</span>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Pulse Survey</h3>
                  <p className="text-sm text-slate-600">Team sentiment and quick feedback</p>
                </div>
              </div>
              <Badge variant={getPulseCompletion().completed === getPulseCompletion().total ? 'default' : 'outline'}>
                {getPulseCompletion().completed} / {getPulseCompletion().total}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <PulseSurvey
              questions={pulseSurvey}
              scores={pulseScores}
              onScoreChange={onPulseScoreChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
