import { QuizResult, EvaluationHistory } from '../types';

// ============================================
// Persistência em localStorage
// ============================================

const STORAGE_KEY = 'quiz-young-history';

/**
 * Carrega histórico de avaliações do localStorage
 */
export function loadHistory(): EvaluationHistory {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { evaluations: [] };
    }
    return JSON.parse(data) as EvaluationHistory;
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return { evaluations: [] };
  }
}

/**
 * Salva uma avaliação no histórico
 */
export function saveEvaluation(result: QuizResult): void {
  try {
    const history = loadHistory();
    history.evaluations.unshift(result); // Adiciona no início
    // Manter apenas as últimas 10 avaliações
    if (history.evaluations.length > 10) {
      history.evaluations = history.evaluations.slice(0, 10);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
  }
}

/**
 * Remove uma avaliação do histórico
 */
export function removeEvaluation(id: string): void {
  try {
    const history = loadHistory();
    history.evaluations = history.evaluations.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Erro ao remover avaliação:', error);
  }
}

/**
 * Limpa todo o histórico
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
  }
}

/**
 * Obtém a avaliação mais recente
 */
export function getLatestEvaluation(): QuizResult | null {
  const history = loadHistory();
  return history.evaluations.length > 0 ? history.evaluations[0] : null;
}
