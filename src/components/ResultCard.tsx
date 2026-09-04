import { SchemaScore } from '../types';
import { formatScore, getLevelLabel, getLevelColor, getLevelBgColor } from '../lib/utils';

interface ResultCardProps {
  schema: SchemaScore;
}

export function ResultCard({ schema }: ResultCardProps) {
  const percentWidth = (schema.mean / 6) * 100;

  return (
    <div className={`rounded-lg border-2 p-4 ${getLevelBgColor(schema.level)} border-gray-200`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base">
          {schema.name}
        </h3>
        <span className={`text-xs font-medium px-2 py-1 rounded ${getLevelColor(schema.level)} bg-white`}>
          {getLevelLabel(schema.level)}
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatScore(schema.mean)}
          </span>
          <span className="text-sm text-gray-600">/ 6.00</span>
        </div>
      </div>

      <div className="w-full bg-white rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all ${getLevelColor(schema.level).replace('text-', 'bg-')}`}
          style={{ width: `${percentWidth}%` }}
        />
      </div>

      <p className="text-xs text-gray-600 mt-3 leading-relaxed">
        {schema.description}
      </p>
    </div>
  );
}
