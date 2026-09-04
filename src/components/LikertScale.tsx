import { LikertValue } from '../types';

interface LikertScaleProps {
  value: LikertValue | null;
  onChange: (value: LikertValue) => void;
}

const labels = [
  { value: 1, short: '1', label: 'Completamente falso' },
  { value: 2, short: '2', label: 'Em grande parte falso' },
  { value: 3, short: '3', label: 'Mais falso que verdadeiro' },
  { value: 4, short: '4', label: 'Moderadamente verdadeiro' },
  { value: 5, short: '5', label: 'Em grande parte verdadeiro' },
  { value: 6, short: '6', label: 'Descreve perfeitamente' }
];

export function LikertScale({ value, onChange }: LikertScaleProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {labels.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value as LikertValue)}
            className={`
              relative p-3 rounded-lg border-2 transition-all
              ${value === item.value
                ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
              }
            `}
          >
            <div className="text-2xl font-bold mb-1">{item.short}</div>
            <div className="text-xs text-gray-600 leading-tight hidden sm:block">
              {item.label}
            </div>
          </button>
        ))}
      </div>
      {/* Labels móveis para telas pequenas */}
      <div className="sm:hidden">
        {value && (
          <div className="text-center text-sm text-gray-700 mt-2">
            {labels.find(l => l.value === value)?.label}
          </div>
        )}
      </div>
    </div>
  );
}
