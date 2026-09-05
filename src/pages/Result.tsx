import { useLocation, useNavigate, Link } from 'react-router-dom';
import { QuizResult } from '../types';
import { ResultCard } from '../components/ResultCard';
import { DomainBar } from '../components/DomainBar';
import { SchemaRadarChart } from '../components/SchemaRadarChart';
import { exportAsJson, exportAsPdf, exportAsCsv } from '../lib/export';
import { formatScore, formatDate } from '../lib/utils';

export function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as { result?: QuizResult })?.result;

  // Se não há resultado, redirecionar para home
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nenhum resultado encontrado.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  const handleExportJson = () => {
    exportAsJson(result);
  };

  const handleExportCsv = () => {
    exportAsCsv(result);
  };

  const handleExportPdf = () => {
    exportAsPdf(result);
  };

  const handleNewEvaluation = () => {
    navigate('/');
  };

  const significantSchemas = result.schemas.filter(
    s => s.level === 'alto' || s.level === 'muito-alto'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Resultado</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Cabeçalho compacto com score em destaque */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Resultado da Avaliação</h1>
              <div className="text-blue-100 text-sm">{formatDate(result.answeredAt)}</div>
            </div>
            <div className="flex items-center gap-4 md:gap-8">
              <div className="flex-1 text-center">
                <div className="text-4xl md:text-5xl font-bold">{formatScore(result.totalMean)}</div>
                <div className="text-blue-100 text-sm">Score Total</div>
              </div>
              <div className="w-px h-12 bg-blue-400 opacity-40 hidden md:block" />
              <div className="flex-1 text-center">
                <div className="text-4xl md:text-5xl font-bold">{significantSchemas.length}</div>
                <div className="text-blue-100 text-sm">Esquemas Significativos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação compactos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            onClick={handleExportPdf}
            className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
          >
            <span>📄</span>
            <span className="hidden sm:inline">Exportar PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
          >
            <span>📋</span>
            <span className="hidden sm:inline">Exportar JSON</span>
            <span className="sm:hidden">JSON</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
          >
            <span>📊</span>
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
          <button
            onClick={handleNewEvaluation}
            className="col-span-2 md:col-span-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Nova Avaliação
          </button>
        </div>

        {/* Perfil por domínio */}
        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Perfil por Domínio</h2>
          <div className="space-y-3">
            {result.domains.map(domain => (
              <DomainBar key={domain.name} domain={domain} />
            ))}
          </div>
        </section>

        {/* Gráfico radar */}
        <section className="mb-8">
          <SchemaRadarChart schemas={result.schemas} />
        </section>

        {/* Resultados por schema */}
        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Resultados por Esquema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.schemas.map(schema => (
              <ResultCard key={schema.code} schema={schema} />
            ))}
          </div>
        </section>

        {/* Disclaimer compacto */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-yellow-900 mb-2">⚠️ Aviso Importante</h3>
          <div className="text-xs text-yellow-800 space-y-1">
            <p>
              Resultado gerado automaticamente. <strong>NÃO</strong> substitui avaliação profissional.
            </p>
            <p>
              Consulte um psicólogo especializado em Terapia do Esquema para interpretação adequada.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
