import { SchemaScore } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { formatScore } from '../lib/utils';

interface SchemaRadarChartProps {
  schemas: SchemaScore[];
}

export function SchemaRadarChart({ schemas }: SchemaRadarChartProps) {
  const data = schemas.map(s => ({
    schema: s.name,
    score: s.mean,
    fullMark: 6
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Perfil dos 18 Esquemas</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="schema"
            tick={{ fontSize: 10 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 6]}
            tick={{ fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value: number) => formatScore(value)}
            contentStyle={{ fontSize: 12 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
