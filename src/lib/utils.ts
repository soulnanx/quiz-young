import { ScoreLevel } from '../types';

// ============================================
// Formatters
// ============================================

export function formatScore(value: number): string {
  return value.toFixed(2);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ============================================
// Interpretação
// ============================================

export function getLevelLabel(level: ScoreLevel): string {
  const labels: Record<ScoreLevel, string> = {
    'desativado': 'Desativado',
    'leve': 'Leve',
    'moderado': 'Moderado',
    'alto': 'Alto',
    'muito-alto': 'Muito Alto'
  };
  return labels[level];
}

export function getLevelColor(level: ScoreLevel): string {
  const colors: Record<ScoreLevel, string> = {
    'desativado': 'text-gray-600',
    'leve': 'text-yellow-600',
    'moderado': 'text-orange-600',
    'alto': 'text-red-600',
    'muito-alto': 'text-red-800'
  };
  return colors[level];
}

export function getLevelBgColor(level: ScoreLevel): string {
  const colors: Record<ScoreLevel, string> = {
    'desativado': 'bg-gray-100',
    'leve': 'bg-yellow-100',
    'moderado': 'bg-orange-100',
    'alto': 'bg-red-100',
    'muito-alto': 'bg-red-200'
  };
  return colors[level];
}

// ============================================
// Utilitários
// ============================================

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
