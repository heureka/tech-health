'use client';

import { Recommendation } from '@/lib/types/assessment';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const priorityConfig = {
  high: {
    label: 'High Priority',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: AlertCircle,
    iconColor: 'text-red-600'
  },
  medium: {
    label: 'Medium Priority',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: AlertTriangle,
    iconColor: 'text-orange-600'
  },
  low: {
    label: 'Low Priority',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Info,
    iconColor: 'text-blue-600'
  }
};

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Excellent Tech Health!
            </h3>
            <p className="text-green-700">
              Your team is performing well across all areas. Keep up the great work and continue to maintain these high standards.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => {
        const config = priorityConfig[rec.priority];
        const Icon = config.icon;

        return (
          <Card key={index} className="border-l-4" style={{ borderLeftColor: config.iconColor }}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-1 ${config.iconColor}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={config.color}>
                      {config.label}
                    </Badge>
                    <span className="text-sm text-slate-600">
                      {rec.areaTitle}
                    </span>
                  </div>
                  <CardTitle className="text-lg">
                    {rec.issue}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Recommended Action:
                </p>
                <p className="text-sm text-blue-800">
                  {rec.action}
                </p>
              </div>
              <div className="text-sm text-slate-600">
                <strong>Impact:</strong> {rec.impact}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
