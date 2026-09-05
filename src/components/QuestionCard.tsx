import { Question, LikertValue } from '../types';
import { LikertScale } from './LikertScale';

interface QuestionCardProps {
  question: Question;
  value: LikertValue | null;
  onChange: (value: LikertValue) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 min-h-[400px] md:min-h-[320px] flex flex-col">
      <div className="mb-6 min-h-[120px] md:min-h-[80px] flex items-start">
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
