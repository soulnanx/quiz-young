import { DomainScore } from '../types';
import { formatScore, getLevelLabel, getLevelColor } from '../lib/utils';

interface DomainBarProps {
  domain: DomainScore;
}

export function DomainBar({ domain }: DomainBarProps) {
  const percentWidth = (domain.mean / 6) * 100;
  const level = getLevelFromMean(domain.mean);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base">
          {domain.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">
            {formatScore(domain.mean)}
          </span>
          <span className={`text-xs font-medium ${getLevelColor(level)}`}>
            {getLevelLabel(level)}
          </span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all ${getLevelColor(level).replace('text-', 'bg-')}`}
          style={{ width: `${percentWidth}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
        {domain.schemas.map(schema => (
          <div key={schema.code} className="text-xs text-gray-600">
            <span className="font-medium">{schema.name}:</span>{' '}
            <span>{formatScore(schema.mean)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getLevelFromMean(mean: number): 'desativado' | 'leve' | 'moderado' | 'alto' | 'muito-alto' {
  if (mean < 2) return 'desativado';
  if (mean < 3) return 'leve';
  if (mean < 4) return 'moderado';
  if (mean < 5) return 'alto';
  return 'muito-alto';
}
