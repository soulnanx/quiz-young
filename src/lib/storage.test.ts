import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveDraft, loadDraft, clearDraft } from './storage';
import { QuizDraft } from '../types';

// Mock in-memory de localStorage (ambiente node do vitest não possui)
const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null =>
      Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
    setItem: (key: string, value: string): void => {
      store[key] = String(value);
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
  };
})();

vi.stubGlobal('localStorage', mockStorage);

const DRAFT_KEY = 'quiz-young-draft';

function makeDraft(updatedAt?: string): QuizDraft {
  return {
    versionId: 'short',
    answers: [
      { questionId: 1, value: 4 },
      { questionId: 2, value: 2 },
    ],
    currentIndex: 2,
    updatedAt: updatedAt ?? new Date().toISOString(),
  };
}

describe('storage: draft do quiz', () => {
  beforeEach(() => {
    mockStorage.removeItem(DRAFT_KEY);
  });

  it('salva e carrega o draft (roundtrip)', () => {
    const draft = makeDraft();
    saveDraft(draft);
    expect(loadDraft()).toEqual(draft);
  });

  it('clearDraft remove o draft', () => {
    saveDraft(makeDraft());
    clearDraft();
    expect(loadDraft()).toBeNull();
    expect(mockStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it('loadDraft retorna null quando não há draft', () => {
    expect(loadDraft()).toBeNull();
  });

  it('loadDraft retorna null (sem lançar) com JSON corrompido', () => {
    mockStorage.setItem(DRAFT_KEY, '{invalid json!!');
    expect(() => loadDraft()).not.toThrow();
    expect(loadDraft()).toBeNull();
  });

  it('ignora draft com updatedAt mais antigo que 7 dias e o remove', () => {
    const oldDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
    saveDraft(makeDraft(oldDate));
    expect(loadDraft()).toBeNull();
    expect(mockStorage.getItem(DRAFT_KEY)).toBeNull();
  });
});
