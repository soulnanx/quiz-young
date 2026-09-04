import { DomainScore } from '../types';
import { formatScore, getLevelLabel, getLevelColor, getLevelBgColor } from '../lib/utils';

interface DomainBarProps {
  domain: DomainScore;
}

export function DomainBar({ domain }: DomainBarProps) {
  const percentWidth = (domain.mean / 6) * 100;
  const level = getLevelFromMean(domain.mean);

  return (
    <div className={`rounded-lg border-2 p-4 ${getLevelBgColor(level)} border-gray-200`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base">
          {domain.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatScore(domain.mean)}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded bg-white ${getLevelColor(level)}`}>
            {getLevelLabel(level)}
          </span>
        </div>
      </div>
      
      <div className="w-full bg-white rounded-full h-3 overflow-hidden mb-3">
        <div
          className={`h-3 rounded-full transition-all ${getLevelColor(level).replace('text-', 'bg-')}`}
          style={{ width: `${percentWidth}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {domain.schemas.map(schema => (
          <div key={schema.code} className="text-xs text-gray-700 bg-white bg-opacity-50 rounded px-2 py-1">
            <span className="font-medium">{schema.name}:</span>{' '}
            <span className="font-semibold">{formatScore(schema.mean)}</span>
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
