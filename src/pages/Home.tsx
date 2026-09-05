import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { QuizResult } from '../types';
import { loadHistory, removeEvaluation } from '../lib/storage';
import { importEvaluation } from '../lib/import';
import { formatDate, formatScore } from '../lib/utils';

const APP_VERSION = '1.1.0';

export function Home() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<QuizResult[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportError(null);
      const importedResult = await importEvaluation(file);
      setImportSuccess(true);
      setEvaluations(loadHistory().evaluations);
      setTimeout(() => {
        setImportSuccess(false);
        handleViewResult(importedResult);
      }, 1500);
    } catch (error) {
      setImportError((error as Error).message);
      setTimeout(() => setImportError(null), 5000);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Quiz de Young</h1>
              <p className="text-blue-100 text-sm">Questionário de Esquemas Iniciais Desadaptativos</p>
            </div>
          </div>
          <div className="mt-6 max-w-2xl">
            <p className="text-blue-100 text-lg leading-relaxed">
              Identifique padrões de pensamento, emoção e comportamento que se desenvolvem na infância
              e influenciam sua vida adulta através de uma avaliação profissional baseada na Terapia do Esquema.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">18</div>
            <div className="text-xs text-gray-600">Esquemas</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">5</div>
            <div className="text-xs text-gray-600">Domínios</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">90</div>
            <div className="text-xs text-gray-600">Questões</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">20</div>
            <div className="text-xs text-gray-600">Minutos</div>
          </div>
        </div>

        {/* Nova Avaliação */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nova Avaliação
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Versão Curta */}
            <Link
              to="/quiz?version=short-v1"
              className="group bg-white rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-300 p-8 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                  RECOMENDADO
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Versão Curta</h3>
              <p className="text-blue-600 font-semibold mb-4">YSQ-S3</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm">90 questões</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">~20 minutos</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">18 esquemas avaliados</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold group-hover:from-blue-700 group-hover:to-blue-800 transition-all">
                Iniciar Avaliação
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>

            {/* Versão Estendida */}
            <Link
              to="/quiz?version=long-v1"
              className="group bg-white rounded-2xl shadow-lg border-2 border-indigo-100 hover:border-indigo-300 p-8 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                  COMPLETO
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Versão Estendida</h3>
              <p className="text-indigo-600 font-semibold mb-4">YSQ-L3</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm">232 questões</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">~60 minutos</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Avaliação clínica detalhada</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold group-hover:from-indigo-700 group-hover:to-indigo-800 transition-all">
                Iniciar Avaliação
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          </div>
        </section>

        {/* Histórico */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Avaliações Anteriores
            </h2>
            <button
              onClick={handleImportClick}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Importar
            </button>
          </div>

          {/* Input file oculto para importação */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Mensagens de feedback */}
          {importError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm"> {importError}</p>
            </div>
          )}
          {importSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">✅ Avaliação importada com sucesso! Redirecionando...</p>
            </div>
          )}

          {evaluations.length > 0 ? (
            <div className="space-y-4">
              {evaluations.map((eval_) => {
                const significantCount = eval_.schemas.filter(
                  s => s.level === 'alto' || s.level === 'muito-alto'
                ).length;
                
                return (
                  <div
                    key={eval_.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-sm text-gray-500">
                            {formatDate(eval_.answeredAt)}
                          </div>
                          {significantCount > 0 && (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                              {significantCount} esquemas significativos
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatScore(eval_.totalMean)}
                          </span>
                          <span className="text-gray-500 text-sm">/ 6.00</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewResult(eval_)}
                          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver Resultado
                        </button>
                        <button
                          onClick={() => handleRemove(eval_.id)}
                          className="px-5 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Nenhuma avaliação anterior encontrada.</p>
              <p className="text-sm mt-2">Inicie uma nova avaliação ou importe um questionário.</p>
            </div>
          )}
        </section>

        {/* Sobre o Questionário */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sobre o Questionário
          </h2>
          
          <div className="prose prose-sm md:prose-base text-gray-600 space-y-4">
            <p className="text-lg leading-relaxed">
              O <strong className="text-gray-900">Questionário de Esquemas de Young (YSQ)</strong> é um instrumento
              de avaliação psicológica desenvolvido para identificar <strong className="text-gray-900">Esquemas Iniciais
              Desadaptativos (EIDs)</strong> — padrões de pensamento, emoção e comportamento que se desenvolvem
              na infância e persistem ao longo da vida.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2">18 Esquemas Avaliados</h4>
                <p className="text-sm text-blue-800">
                  Padrões como Abandono, Desconfiança, Defectividade, Fracasso, e outros que influenciam
                  seus relacionamentos e decisões.
                </p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <h4 className="font-semibold text-indigo-900 mb-2">5 Domínios</h4>
                <p className="text-sm text-indigo-800">
                  Desconexão/Rejeição, Autonomia Prejudicada, Limites Prejudicados, Orientação ao Outro,
                  e Vigilância Excessiva.
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-yellow-800">
                <strong>Aviso Importante:</strong> Os resultados deste questionário são informativos e
                <strong> não substituem</strong> uma avaliação profissional realizada por um psicólogo
                qualificado. Para interpretação adequada, consulte um especialista em Terapia do Esquema.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Quiz de Young v{APP_VERSION} — Baseado no YSQ-S3 de Jeffrey Young</p>
        </footer>
      </main>
    </div>
  );
}
