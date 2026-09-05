import { QuizResult, EvaluationHistory, QuizDraft } from '../types';

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

// ============================================
// Rascunho de quiz em andamento
// ============================================

const DRAFT_KEY = 'quiz-young-draft';
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

export function saveDraft(draft: QuizDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('Erro ao salvar rascunho:', error);
  }
}

export function loadDraft(): QuizDraft | null {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    if (!data) {
      return null;
    }
    const draft = JSON.parse(data) as QuizDraft;
    if (Date.now() - new Date(draft.updatedAt).getTime() > DRAFT_TTL_MS) {
      clearDraft();
      return null;
    }
    return draft;
  } catch (error) {
    console.error('Erro ao carregar rascunho:', error);
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Erro ao limpar rascunho:', error);
  }
}
