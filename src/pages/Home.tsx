import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { QuizResult } from '../types';
import { loadHistory, removeEvaluation } from '../lib/storage';
import { formatDate, formatScore } from '../lib/utils';

const APP_VERSION = '1.0.0';

export function Home() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<QuizResult[]>([]);

  useEffect(() => {
    const history = loadHistory();
    setEvaluations(history.evaluations);
  }, []);

  const handleRemove = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta avaliação?')) {
      removeEvaluation(id);
      setEvaluations(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleViewResult = (result: QuizResult) => {
    navigate('/resultado', { state: { result } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Quiz de Young</h1>
          <span className="text-sm text-gray-400 border border-gray-200 rounded px-2 py-0.5">
            v{APP_VERSION}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Nova Avaliação */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nova Avaliação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/quiz?version=short-v1"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Versão Curta (YSQ-S3)</h3>
              <p className="text-gray-600 mb-4">90 questões, aproximadamente 20 minutos</p>
              <div className="text-sm text-blue-600 font-medium">Iniciar avaliação →</div>
            </Link>

            <div className="bg-gray-100 rounded-lg border border-gray-200 p-6 opacity-60">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Versão Estendida (YSQ-L3)</h3>
              <p className="text-gray-600 mb-4">232 questões, aproximadamente 60 minutos</p>
              <div className="text-sm text-gray-500 font-medium">Em breve</div>
            </div>
          </div>
        </section>

        {/* Histórico */}
        {evaluations.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações Anteriores</h2>
            <div className="space-y-4">
              {evaluations.map((eval_) => (
                <div
                  key={eval_.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {formatDate(eval_.answeredAt)}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        Score Total: {formatScore(eval_.totalMean)} / 6.00
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {eval_.schemas.filter(s => s.level === 'alto' || s.level === 'muito-alto').length} esquemas clinicamente significativos
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewResult(eval_)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Ver Resultado
                      </button>
                      <button
                        onClick={() => handleRemove(eval_.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Informações */}
        <section className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre o Questionário</h2>
          <div className="prose prose-sm text-gray-600">
            <p>
              O <strong>Questionário de Esquemas de Young (YSQ)</strong> é um instrumento de avaliação
              psicológica desenvolvido para identificar Esquemas Iniciais Desadaptativos (EIDs) —
              padrões de pensamento, emoção e comportamento que se desenvolvem na infância e
              persistem ao longo da vida.
            </p>
            <p>
              Este questionário avalia <strong>18 esquemas</strong> organizados em <strong>5 domínios</strong>:
              Desconexão/Rejeição, Autonomia Prejudicada, Limites Prejudicados, Orientação ao Outro,
              e Vigilância Excessiva e Inibição.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Aviso:</strong> Os resultados deste questionário são informativos e não substituem
              uma avaliação profissional realizada por um psicólogo qualificado.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
