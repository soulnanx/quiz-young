interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Questão {current} de {total}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {percent.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
