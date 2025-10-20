'use client';

import { CompassPosition } from '@/lib/types/assessment';

interface CompassChartProps {
  compass: CompassPosition;
}

export default function CompassChart({ compass }: CompassChartProps) {
  const { speed, sustainability } = compass;

  // Calculate position in the chart (0-100 scale)
  // Map to SVG coordinates (we'll use a 200x200 viewBox)
  const centerX = 100;
  const centerY = 100;
  const scale = 0.8; // Scale factor for the compass (80% of the available space)

  // Position: X axis = Speed (right), Y axis = Sustainability (up)
  const pointX = centerX + ((speed - 50) * scale);
  const pointY = centerY - ((sustainability - 50) * scale);

  // Balanced zone (circle around center)
  const balancedRadius = 10;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-auto"
        style={{ maxHeight: '400px' }}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="sustainGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="100%" stopColor="#dcfce7" />
          </linearGradient>
        </defs>

        {/* Axes */}
        <line
          x1="20"
          y1={centerY}
          x2="180"
          y2={centerY}
          stroke="#94a3b8"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <line
          x1={centerX}
          y1="20"
          x2={centerX}
          y2="180"
          stroke="#94a3b8"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        {/* Balanced zone circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={balancedRadius}
          fill="#dcfce7"
          stroke="#22c55e"
          strokeWidth="2"
          strokeDasharray="3 3"
          opacity="0.3"
        />

        {/* Axis labels */}
        <text
          x="185"
          y={centerY + 4}
          fontSize="10"
          fill="#64748b"
          textAnchor="start"
          fontWeight="600"
        >
          ⚡ SPEED
        </text>
        <text
          x={centerX}
          y="15"
          fontSize="10"
          fill="#64748b"
          textAnchor="middle"
          fontWeight="600"
        >
          🛡️ SUSTAINABILITY
        </text>

        {/* Quadrant labels */}
        <text
          x="150"
          y="40"
          fontSize="9"
          fill="#94a3b8"
          textAnchor="middle"
          fontStyle="italic"
        >
          Fast & Stable
        </text>
        <text
          x="50"
          y="40"
          fontSize="9"
          fill="#94a3b8"
          textAnchor="middle"
          fontStyle="italic"
        >
          Slow & Stable
        </text>
        <text
          x="150"
          y="190"
          fontSize="9"
          fill="#94a3b8"
          textAnchor="middle"
          fontStyle="italic"
        >
          Fast & Fragile
        </text>
        <text
          x="50"
          y="190"
          fontSize="9"
          fill="#94a3b8"
          textAnchor="middle"
          fontStyle="italic"
        >
          Slow & Fragile
        </text>

        {/* Current position marker */}
        <circle
          cx={pointX}
          cy={pointY}
          r="6"
          fill="#3b82f6"
          stroke="#1e40af"
          strokeWidth="2"
        />
        <circle
          cx={pointX}
          cy={pointY}
          r="10"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          opacity="0.3"
        />

        {/* Position label */}
        <text
          x={pointX}
          y={pointY - 15}
          fontSize="11"
          fill="#1e40af"
          textAnchor="middle"
          fontWeight="700"
        >
          Current
        </text>

        {/* Score labels on axes */}
        <text
          x="25"
          y={centerY + 4}
          fontSize="8"
          fill="#94a3b8"
          textAnchor="middle"
        >
          0
        </text>
        <text
          x="175"
          y={centerY + 4}
          fontSize="8"
          fill="#94a3b8"
          textAnchor="middle"
        >
          100
        </text>
        <text
          x={centerX + 10}
          y="185"
          fontSize="8"
          fill="#94a3b8"
          textAnchor="start"
        >
          0
        </text>
        <text
          x={centerX + 10}
          y="25"
          fontSize="8"
          fill="#94a3b8"
          textAnchor="start"
        >
          100
        </text>

        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="2" fill="#64748b" />
      </svg>

      {/* Legend below chart */}
      <div className="mt-4 flex justify-center gap-6 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-700"></div>
          <span>Current Position</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-100 border-2 border-green-500 border-dashed"></div>
          <span>Balanced Zone</span>
        </div>
      </div>

      {/* Numeric values */}
      <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">⚡ {speed}</div>
          <div className="text-xs text-slate-600 mt-1">Speed Score</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-700">🛡️ {sustainability}</div>
          <div className="text-xs text-slate-600 mt-1">Sustainability Score</div>
        </div>
      </div>
    </div>
  );
}
