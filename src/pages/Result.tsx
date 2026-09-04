import { useLocation, useNavigate, Link } from 'react-router-dom';
import { QuizResult } from '../types';
import { ResultCard } from '../components/ResultCard';
import { DomainBar } from '../components/DomainBar';
import { SchemaRadarChart } from '../components/SchemaRadarChart';
import { exportAsJson, exportAsPdf } from '../lib/export';
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Resultado</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Cabeçalho do resultado */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Resultado da Avaliação</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Data da avaliação</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatDate(result.answeredAt)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Score total</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatScore(result.totalMean)} / 6.00
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Esquemas significativos</div>
              <div className="text-lg font-semibold text-gray-900">
                {significantSchemas.length} de 18
              </div>
            </div>
          </div>
        </div>

        {/* Botões de exportação */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={handleExportPdf}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <span>📄</span>
            Exportar PDF
          </button>
          <button
            onClick={handleExportJson}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <span>📋</span>
            Exportar JSON
          </button>
          <button
            onClick={handleNewEvaluation}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Nova Avaliação
          </button>
        </div>

        {/* Perfil por domínio */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfil por Domínio</h2>
          <div className="space-y-4">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resultados por Esquema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.schemas.map(schema => (
              <ResultCard key={schema.code} schema={schema} />
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">⚠️ Aviso Importante</h3>
          <div className="text-sm text-yellow-800 space-y-2">
            <p>
              Este resultado é gerado automaticamente e tem caráter <strong>informativo</strong>.
              Os resultados <strong>NÃO</strong> substituem uma avaliação profissional realizada
              por um psicólogo qualificado.
            </p>
            <p>
              A interpretação adequada dos esquemas deve ser feita por um profissional de saúde
              mental, considerando o contexto clínico completo do paciente.
            </p>
            <p>
              Para interpretação dos resultados, consulte um psicólogo especializado em
              <strong> Terapia do Esquema</strong>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
