import { useState, useEffect } from 'react';
import { SchemaScore } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { formatScore, getLevelColor } from '../lib/utils';
import { schemasMeta } from '../data/questions';

interface SchemaRadarChartProps {
  schemas: SchemaScore[];
  series?: { label: string; schemas: SchemaScore[] }[];
}

const SERIES_COLORS = ['#2563eb', '#16a34a', '#9333ea', '#ea580c'];

interface RadarDataPoint {
  schema: string;
  fullMark: number;
  [key: string]: string | number;
}

export function SchemaRadarChart({ schemas, series }: SchemaRadarChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const data: RadarDataPoint[] = series
    ? Object.values(schemasMeta).map(meta => {
        const point: RadarDataPoint = {
          schema: meta.name,
          fullMark: 6
        };
        for (const s of series) {
          const found = s.schemas.find(sc => sc.code === meta.code);
          point[s.label] = found ? found.mean : 0;
        }
        return point;
      })
    : schemas.map(s => ({
        schema: s.name,
        score: s.mean,
        fullMark: 6
      }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-6">Perfil dos 18 Esquemas</h2>
      
      {/* Gráfico radar */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            {/* Esconder labels no mobile */}
            <PolarAngleAxis
              dataKey="schema"
              tick={isMobile ? false : { fontSize: 9 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 6]}
              tick={{ fontSize: 10 }}
            />
            {series ? (
              series.map((s, i) => (
                <Radar
                  key={s.label}
                  name={s.label}
                  dataKey={s.label}
                  stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                  fill={SERIES_COLORS[i % SERIES_COLORS.length]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))
            ) : (
              <Radar
                name="Score"
                dataKey="score"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            )}
            <Tooltip
              formatter={(value: number) => formatScore(value)}
              contentStyle={{ fontSize: 12 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda das séries (quando comparando múltiplas avaliações) */}
      {series && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {series.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 text-xs text-gray-700">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length] }}
              />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Legenda dos esquemas (sempre visível) */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        {schemas.map(schema => (
          <div key={schema.code} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1.5">
            <span className="text-gray-700 truncate mr-2 flex-1">{schema.name}</span>
            <span className={`font-bold whitespace-nowrap ${getLevelColor(schema.level)}`}>
              {formatScore(schema.mean)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
