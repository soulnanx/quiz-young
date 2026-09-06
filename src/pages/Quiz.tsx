import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Question, LikertValue, Answer } from '../types';
import { getQuestionsByVersion, quizVersions } from '../data/questions';
import { computeQuizResult } from '../scoring/scoring';
import { saveEvaluation, saveDraft, loadDraft, clearDraft } from '../lib/storage';
import { QuestionCard } from '../components/QuestionCard';
import { ProgressBar } from '../components/ProgressBar';

type QuizPhase = 'instructions' | 'quiz' | 'completed';

export function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const versionId = searchParams.get('version') || 'short-v1';
  const isDebug = searchParams.get('debug') === 'true';

  const [phase, setPhase] = useState<QuizPhase>('instructions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, LikertValue>>(new Map());
  // Guarda contra o double-invoke de efeitos do StrictMode em dev
  const restorePrompted = useRef(false);

  // Carregar questões
  useEffect(() => {
    const qs = getQuestionsByVersion(versionId);
    setQuestions(qs);
  }, [versionId]);

  // Restaurar rascunho de avaliação incompleta
  useEffect(() => {
    if (phase !== 'instructions' || questions.length === 0) return;
    if (restorePrompted.current) return;
    const draft = loadDraft();
    if (!draft || draft.versionId !== versionId || draft.answers.length === 0) return;
    restorePrompted.current = true;
    const resume = confirm(
      `Você tem uma avaliação incompleta desta versão (${draft.answers.length} de ${questions.length} respondidas). Continuar de onde parou?`
    );
    if (resume) {
      setAnswers(new Map(draft.answers.map(a => [a.questionId, a.value] as const)));
      setCurrentIndex(draft.currentIndex);
      setPhase('quiz');
    } else {
      clearDraft();
    }
  }, [questions, versionId, phase]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentValue = currentQuestion ? answers.get(currentQuestion.id) ?? null : null;

  const buildDraft = () => ({
    versionId,
    answers: Array.from(answers.entries()).map(([questionId, value]) => ({ questionId, value })),
    currentIndex,
    updatedAt: new Date().toISOString()
  });

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
    const result = computeQuizResult(answerList, versionId, questions);

    // Salvar no histórico
    saveEvaluation(result);
    clearDraft();

    // Navegar para resultado
    navigate('/resultado', { state: { result } });
  };

  const handleDebugFill = () => {
    // Preencher todas as questões com valor 3
    const debugAnswers = new Map<number, LikertValue>();
    questions.forEach(q => debugAnswers.set(q.id, 3));
    setAnswers(debugAnswers);
    setCurrentIndex(totalQuestions - 1); // Ir para última questão
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const allAnswered = answers.size === totalQuestions;
  const canProceed = currentValue !== null;

  // Atalhos de teclado: Espaço = Próxima, Backspace = Anterior
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Só funciona na fase quiz
      if (phase !== 'quiz') return;
      
      // Não interfere com inputs/textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      
      // Espaço = Próxima (ou Ver Resultado se for a última)
      if (e.code === 'Space') {
        e.preventDefault();
        if (isLastQuestion) {
          if (allAnswered) handleFinish();
        } else {
          if (canProceed) handleNext();
        }
      }
      
      // Backspace = Anterior
      if (e.code === 'Backspace') {
        e.preventDefault();
        if (currentIndex > 0) handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isLastQuestion, allAnswered, canProceed, currentIndex]);

  // Autosave do rascunho durante o quiz
  useEffect(() => {
    if (phase !== 'quiz') return;
    saveDraft(buildDraft());
  }, [phase, versionId, answers, currentIndex]);

  // Salvar rascunho ao fechar/recarregar a página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (phase === 'quiz') saveDraft(buildDraft());
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [phase, versionId, answers, currentIndex]);

  // Tela de instruções
  if (phase === 'instructions') {
    const isLongVersion = versionId === 'long-v1';
    const totalQuestions = quizVersions[versionId].totalQuestions;
    const estimatedTime = totalQuestions === 200 ? '45' : totalQuestions === 232 ? '60' : '20';

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header com gradiente */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Instruções</h1>
                <p className="text-blue-100 text-sm">
                  {isLongVersion ? 'Versão Estendida (YSQ-L3)' : 'Versão Curta (YSQ-S3)'}
                </p>
              </div>
            </div>
            <div className="mt-6 max-w-2xl">
              <p className="text-blue-100 text-lg leading-relaxed">
                Leia atentamente as instruções abaixo antes de iniciar a avaliação.
                Suas respostas são confidenciais e serão usadas apenas para análise profissional.
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Informações rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{totalQuestions}</div>
              <div className="text-xs text-gray-600">Questões</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">~{estimatedTime}</div>
              <div className="text-xs text-gray-600">Minutos</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-blue-600 mb-1">18</div>
              <div className="text-xs text-gray-600">Esquemas</div>
            </div>
          </div>

          {/* Card principal de instruções */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Como responder
            </h2>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                A seguir há uma lista de afirmações que as pessoas podem utilizar para descrever
                a si mesmas. Por favor, leia cada afirmação e então a classifique, baseando-se
                em quão bem ela descreve você ao longo do <strong className="text-gray-900">último ano</strong>.
              </p>
              <p className="text-lg leading-relaxed">
                Quando você não tiver certeza, baseie sua resposta nos seus <strong className="text-gray-900">sentimentos</strong>,
                e não no que você acredita racionalmente que é verdade.
              </p>
            </div>

            {/* Box de atenção */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Atenção:</h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Alguns dos itens se referem a sua relação com seus pais ou parceiro(s) amoroso(s).
                    Se qualquer um deles já tiver falecido, responda baseando-se na sua relação com
                    eles enquanto eram vivos. Se você atualmente não tem um(a) parceiro(a), responda
                    baseando-se no parceiro(a) mais significativo que você teve recentemente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card da escala */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Escala de resposta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { value: 1, label: 'Completamente falso sobre mim' },
                { value: 2, label: 'Em grande parte falso sobre mim' },
                { value: 3, label: 'Um pouco mais verdadeiro do que falso sobre mim' },
                { value: 4, label: 'Moderadamente verdadeiro sobre mim' },
                { value: 5, label: 'Em grande parte verdadeiro sobre mim' },
                { value: 6, label: 'Me descreve perfeitamente' }
              ].map((item) => (
                <div key={item.value} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{item.value}</span>
                  </div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botão de início */}
          <button
            onClick={() => setPhase('quiz')}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
          >
            Começar Avaliação
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Link voltar */}
          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              ← Voltar para Home
            </Link>
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
          {/* Sair não perde progresso: rascunho é salvo automaticamente a cada resposta */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <ProgressBar current={currentIndex + 1} total={totalQuestions} />
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" />
              </svg>
              Sair
            </button>
          </div>
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

        {/* Botão de debug */}
        {isDebug && (
          <div className="mt-6 text-center">
            <button
              onClick={handleDebugFill}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              🐛 Debug: Preencher tudo e ir para última questão
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
