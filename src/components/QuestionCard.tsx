import { Question, LikertValue } from '../types';
import { LikertScale } from './LikertScale';

interface QuestionCardProps {
  question: Question;
  value: LikertValue | null;
  onChange: (value: LikertValue) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="mb-6">
        <p className="text-lg md:text-xl text-gray-900 leading-relaxed">
          {question.text}
        </p>
      </div>
      <LikertScale value={value} onChange={onChange} />
    </div>
  );
}
