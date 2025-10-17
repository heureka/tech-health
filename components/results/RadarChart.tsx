'use client';

import { AreaScore } from '@/lib/types/assessment';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface RadarChartProps {
  areaScores: AreaScore[];
}

export default function RadarChart({ areaScores }: RadarChartProps) {
  const data = areaScores.map(area => ({
    area: area.areaTitle,
    score: Number(area.averageScore.toFixed(2)),
    fullMark: 4
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="#cbd5e1" />
        <PolarAngleAxis
          dataKey="area"
          tick={{ fill: '#475569', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 4]}
          tick={{ fill: '#64748b', fontSize: 10 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.6}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px'
          }}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
