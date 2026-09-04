import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Question, LikertValue, Answer } from '../types';
import { getQuestionsByVersion } from '../data/questions';
import { computeQuizResult } from '../scoring/scoring';
import { saveEvaluation } from '../lib/storage';
import { QuestionCard } from '../components/QuestionCard';
import { ProgressBar } from '../components/ProgressBar';

type QuizPhase = 'instructions' | 'quiz' | 'completed';

export function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const versionId = searchParams.get('version') || 'short-v1';

  const [phase, setPhase] = useState<QuizPhase>('instructions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, LikertValue>>(new Map());

  // Carregar questões
  useEffect(() => {
    const qs = getQuestionsByVersion(versionId);
    setQuestions(qs);
  }, [versionId]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentValue = currentQuestion ? answers.get(currentQuestion.id) ?? null : null;

  const handleAnswer = (value: LikertValue) => {
    if (!currentQuestion) return;
    setAnswers(prev => new Map(prev).set(currentQuestion.id, value));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    // Converter Map para Answer[]
    const answerList: Answer[] = Array.from(answers.entries()).map(([questionId, value]) => ({
      questionId,
      value
    }));

    // Calcular resultado
    const result = computeQuizResult(answerList, versionId);

    // Salvar no histórico
    saveEvaluation(result);

    // Navegar para resultado
    navigate('/resultado', { state: { result } });
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const allAnswered = answers.size === totalQuestions;
  const canProceed = currentValue !== null;

  // Tela de instruções
  if (phase === 'instructions') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Instruções</span>
            </nav>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Instruções
            </h1>

            <div className="prose prose-sm md:prose-base text-gray-700 space-y-4 mb-8">
              <p>
                A seguir há uma lista de afirmações que as pessoas podem utilizar para descrever
                a si mesmas. Por favor, leia cada afirmação e então a classifique, baseando-se
                em quão bem ela descreve você ao longo do <strong>último ano</strong>.
              </p>
              <p>
                Quando você não tiver certeza, baseie sua resposta nos seus <strong>sentimentos</strong>,
                e não no que você acredita racionalmente que é verdade.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Atenção:</p>
                <p className="text-sm text-blue-800">
                  Alguns dos itens se referem a sua relação com seus pais ou parceiro(s) amoroso(s).
                  Se qualquer um deles já tiver falecido, responda baseando-se na sua relação com
                  eles enquanto eram vivos. Se você atualmente não tem um(a) parceiro(a), responda
                  baseando-se no parceiro(a) mais significativo que você teve recentemente.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Escala de resposta:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>1</strong> = Completamente falso sobre mim</li>
                  <li><strong>2</strong> = Em grande parte falso sobre mim</li>
                  <li><strong>3</strong> = Um pouco mais verdadeiro do que falso sobre mim</li>
                  <li><strong>4</strong> = Moderadamente verdadeiro sobre mim</li>
                  <li><strong>5</strong> = Em grande parte verdadeiro sobre mim</li>
                  <li><strong>6</strong> = Me descreve perfeitamente</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setPhase('quiz')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Começar Avaliação
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Tela do quiz
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            value={currentValue}
            onChange={handleAnswer}
          />
        )}

        {/* Navegação */}
        <div className="flex justify-between items-center mt-6 gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleFinish}
              disabled={!allAnswered}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ver Resultado
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          )}
        </div>

        {/* Contador de respondidas */}
        <div className="text-center mt-4 text-sm text-gray-500">
          {answers.size} de {totalQuestions} questões respondidas
        </div>
      </main>
    </div>
  );
}
