import { Question, LikertValue } from '../types';
import { LikertScale } from './LikertScale';

interface QuestionCardProps {
  question: Question;
  value: LikertValue | null;
  onChange: (value: LikertValue) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 h-[420px] md:h-auto md:min-h-[320px] flex flex-col">
      <div className="mb-4 md:mb-6 flex items-start" style={{ minHeight: '100px' }}>
        <p className="text-lg md:text-xl text-gray-900 leading-relaxed">
          {question.text}
        </p>
      </div>
      <div className="mt-auto">
        <LikertScale value={value} onChange={onChange} />
      </div>
    </div>
  );
}
