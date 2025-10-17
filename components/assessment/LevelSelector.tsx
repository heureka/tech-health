'use client';

import { Level } from '@/lib/types/assessment';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface LevelSelectorProps {
  levels: Level[];
  selectedLevel?: number;
  onSelect: (level: number) => void;
}

const levelColors = {
  1: {
    bg: 'hover:bg-red-50',
    border: 'border-red-200',
    selected: 'bg-red-100 border-red-500 border-2',
    badge: 'bg-red-600 text-white'
  },
  2: {
    bg: 'hover:bg-yellow-50',
    border: 'border-yellow-200',
    selected: 'bg-yellow-100 border-yellow-500 border-2',
    badge: 'bg-yellow-600 text-white'
  },
  3: {
    bg: 'hover:bg-green-50',
    border: 'border-green-200',
    selected: 'bg-green-100 border-green-500 border-2',
    badge: 'bg-green-600 text-white'
  },
  4: {
    bg: 'hover:bg-emerald-50',
    border: 'border-emerald-200',
    selected: 'bg-emerald-100 border-emerald-600 border-2',
    badge: 'bg-emerald-700 text-white'
  }
};

export default function LevelSelector({ levels, selectedLevel, onSelect }: LevelSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {levels.map((level) => {
        const isSelected = selectedLevel === level.level;
        const colors = levelColors[level.level as keyof typeof levelColors];

        return (
          <Card
            key={level.level}
            className={`cursor-pointer transition-all relative ${
              isSelected
                ? colors.selected
                : `${colors.border} ${colors.bg}`
            }`}
            onClick={() => onSelect(level.level)}
          >
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className="bg-blue-600 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Badge className={colors.badge}>
                  {level.level}
                </Badge>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{level.label}</h4>
                </div>
              </div>
              <p className="text-sm text-slate-700 mb-3">
                {level.description}
              </p>
              <div className="bg-slate-50 rounded p-2 border border-slate-200">
                <p className="text-xs text-slate-600 italic">
                  Example: {level.example}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
