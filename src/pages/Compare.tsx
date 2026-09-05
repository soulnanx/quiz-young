import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QuizResult } from '../types';
import { loadHistory } from '../lib/storage';
import { SchemaRadarChart } from '../components/SchemaRadarChart';
import { schemasMeta, quizVersions } from '../data/questions';
import { formatDate, formatScore, getLevelLabel } from '../lib/utils';

interface DeltaRow {
  code: string;
  name: string;
  means: number[];
  delta: number;
  levelChange: string;
}

export function Compare() {
  const [evaluations] = useState<QuizResult[]>(() => loadHistory().evaluations);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Selecionadas em ordem cronológica (mais antiga → mais nova)
  const selected = evaluations
    .filter(e => selectedIds.has(e.id))
    .sort((a, b) => new Date(a.answeredAt).getTime() - new Date(b.answeredAt).getTime());

  const oldest = selected[0];
  const newest = selected[selected.length - 1];

  const meanOf = (e: QuizResult, code: string): number =>
    e.schemas.find(s => s.code === code)?.mean ?? 0;

  const rows: DeltaRow[] = Object.values(schemasMeta).map(meta => {
    const oldestScore = oldest ? oldest.schemas.find(s => s.code === meta.code) : undefined;
    const newestScore = newest ? newest.schemas.find(s => s.code === meta.code) : undefined;
    const delta = (newestScore?.mean ?? 0) - (oldestScore?.mean ?? 0);
    const levelChange =
      oldestScore && newestScore && oldestScore.level !== newestScore.level
        ? `${getLevelLabel(oldestScore.level)} → ${getLevelLabel(newestScore.level)}`
        : '—';
    return {
      code: meta.code,
      name: meta.name,
      means: selected.map(e => meanOf(e, meta.code)),
      delta,
      levelChange
    };
  }).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Comparar Avaliações</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Comparar Avaliações
        </h1>

        {evaluations.length < 2 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-4">
              Você precisa de pelo menos 2 avaliações no histórico para comparar.
            </p>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Voltar para Home
            </Link>
          </div>
        ) : (
          <>
            {/* Seleção de avaliações */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📋 Selecione as avaliações
              </h2>
              <div className="space-y-2">
                {evaluations.map(e => (
                  <label
                    key={e.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(e.id)}
                      onChange={() => toggle(e.id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="flex-1 text-sm text-gray-700">
                      {formatDate(e.answeredAt)}
                      <span className="text-gray-500"> — {quizVersions[e.versionId]?.name ?? e.versionId}</span>
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatScore(e.totalMean)}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {selected.length < 2 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Selecione pelo menos 2 avaliações.</p>
              </div>
            ) : (
              <>
                {/* Radar overlay */}
                <section className="mb-8">
                  <SchemaRadarChart
                    schemas={newest.schemas}
                    series={selected.map(e => ({
                      label: formatDate(e.answeredAt),
                      schemas: e.schemas
                    }))}
                  />
                </section>

                {/* Tabela de deltas */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    📊 Variação por Esquema
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-200">
                          <th className="py-2 pr-4 font-medium">Esquema</th>
                          {selected.map(e => (
                            <th key={e.id} className="py-2 px-3 font-medium text-right">
                              {formatDate(e.answeredAt)}
                            </th>
                          ))}
                          <th className="py-2 px-3 font-medium text-right">Δ</th>
                          <th className="py-2 pl-3 font-medium">Nível</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map(row => (
                          <tr key={row.code} className="border-b border-gray-100">
                            <td className="py-2 pr-4 text-gray-700">{row.name}</td>
                            {row.means.map((m, i) => (
                              <td key={selected[i].id} className="py-2 px-3 text-right text-gray-700">
                                {formatScore(m)}
                              </td>
                            ))}
                            <td className="py-2 px-3 text-right font-semibold whitespace-nowrap">
                              {row.delta > 0 && <span className="text-red-600">▲ {formatScore(row.delta)}</span>}
                              {row.delta < 0 && <span className="text-green-600">▼ {formatScore(-row.delta)}</span>}
                              {row.delta === 0 && <span className="text-gray-400">—</span>}
                            </td>
                            <td className="py-2 pl-3 text-gray-600 whitespace-nowrap">{row.levelChange}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
