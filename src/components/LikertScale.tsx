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
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value) as LikertValue);
  };

  return (
    <div className="space-y-4">
      {/* Desktop: grid de botões */}
      <div className="hidden md:grid grid-cols-6 gap-2">
        {labels.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value as LikertValue)}
            className={`
              relative h-[110px] p-3 rounded-lg border-2 transition-all
              flex flex-col items-center justify-center text-center
              ${value === item.value
                ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
              }
            `}
          >
            <div className="text-2xl font-bold mb-1 shrink-0">{item.short}</div>
            <div className="text-xs text-gray-600 leading-tight flex-1 flex items-center justify-center">
              {item.label}
            </div>
          </button>
        ))}
      </div>

      {/* Mobile: slider com escala visual */}
      <div className="md:hidden space-y-3">
        {/* Labels das extremidades */}
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>Falso</span>
          <span>Verdadeiro</span>
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={value || 3}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-8
              [&::-webkit-slider-thumb]:h-8
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-blue-600
              [&::-webkit-slider-thumb]:border-4
              [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-8
              [&::-moz-range-thumb]:h-8
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-blue-600
              [&::-moz-range-thumb]:border-4
              [&::-moz-range-thumb]:border-white
              [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>

        {/* Números da escala */}
        <div className="flex justify-between px-1">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num as LikertValue)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${value === num
                  ? 'bg-blue-600 text-white shadow-md scale-110'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Label do valor selecionado - espaço reservado mesmo quando vazio */}
        <div className="text-center h-8 flex items-center justify-center">
          {value && (
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-sm font-medium">
              {labels.find(l => l.value === value)?.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
