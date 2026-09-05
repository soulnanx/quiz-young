import { describe, it, expect } from 'vitest';
import { computeSchemaScores, computeDomainScores, computeQuizResult, interpretLevel } from './scoring';
import { Answer, Question } from '../types';

describe('interpretLevel', () => {
  it('deve classificar scores corretamente', () => {
    expect(interpretLevel(1.0)).toBe('desativado');
    expect(interpretLevel(1.5)).toBe('desativado');
    expect(interpretLevel(1.9)).toBe('desativado');
    expect(interpretLevel(2.0)).toBe('leve');
    expect(interpretLevel(2.5)).toBe('leve');
    expect(interpretLevel(2.9)).toBe('leve');
    expect(interpretLevel(3.0)).toBe('moderado');
    expect(interpretLevel(3.5)).toBe('moderado');
    expect(interpretLevel(3.9)).toBe('moderado');
    expect(interpretLevel(4.0)).toBe('alto');
    expect(interpretLevel(4.5)).toBe('alto');
    expect(interpretLevel(4.9)).toBe('alto');
    expect(interpretLevel(5.0)).toBe('muito-alto');
    expect(interpretLevel(5.5)).toBe('muito-alto');
    expect(interpretLevel(6.0)).toBe('muito-alto');
  });
});

describe('computeSchemaScores', () => {
  it('deve calcular média correta para um schema', () => {
    // Schema 'ed' tem questões: 1, 19, 37, 55, 73
    const answers: Answer[] = [
      { questionId: 1, value: 2 },
      { questionId: 19, value: 3 },
      { questionId: 37, value: 4 },
      { questionId: 55, value: 3 },
      { questionId: 73, value: 3 }
    ];

    const scores = computeSchemaScores(answers);
    const edScore = scores.find(s => s.code === 'ed');

    expect(edScore).toBeDefined();
    expect(edScore!.mean).toBe(3.0); // (2+3+4+3+3)/5 = 3.0
    expect(edScore!.level).toBe('moderado');
    expect(edScore!.items).toEqual([1, 19, 37, 55, 73]);
  });

  it('deve calcular scores para todos os 18 schemas', () => {
    // Criar respostas para todas as 90 questões (todas com valor 3)
    const answers: Answer[] = Array.from({ length: 90 }, (_, i) => ({
      questionId: i + 1,
      value: 3 as const
    }));

    const scores = computeSchemaScores(answers);

    expect(scores.length).toBe(18);
    scores.forEach(score => {
      expect(score.mean).toBe(3.0);
      expect(score.level).toBe('moderado');
    });
  });

  it('deve ordenar schemas por score (maior primeiro)', () => {
    // Schema 'ed' com score alto
    const answers: Answer[] = [
      { questionId: 1, value: 5 },
      { questionId: 19, value: 5 },
      { questionId: 37, value: 5 },
      { questionId: 55, value: 5 },
      { questionId: 73, value: 5 },
      // Schema 'ab' com score baixo
      { questionId: 2, value: 2 },
      { questionId: 20, value: 2 },
      { questionId: 38, value: 2 },
      { questionId: 56, value: 2 },
      { questionId: 74, value: 2 }
    ];

    const scores = computeSchemaScores(answers);
    const edIndex = scores.findIndex(s => s.code === 'ed');
    const abIndex = scores.findIndex(s => s.code === 'ab');

    expect(edIndex).toBeLessThan(abIndex); // ed (5.0) deve vir antes de ab (2.0)
  });
});

describe('computeDomainScores', () => {
  it('deve calcular média dos schemas do domínio', () => {
    // Criar scores manuais para testar
    const schemas = [
      {
        code: 'ed' as const,
        name: 'Privação Emocional',
        domain: 'Desconexão/Rejeição' as const,
        description: '',
        items: [1, 19, 37, 55, 73],
        values: [4, 4, 4, 4, 4],
        mean: 4.0,
        level: 'alto' as const
      },
      {
        code: 'ab' as const,
        name: 'Abandono',
        domain: 'Desconexão/Rejeição' as const,
        description: '',
        items: [2, 20, 38, 56, 74],
        values: [2, 2, 2, 2, 2],
        mean: 2.0,
        level: 'leve' as const
      }
    ];

    const domainScores = computeDomainScores(schemas);
    const disconnectionDomain = domainScores.find(d => d.name === 'Desconexão/Rejeição');

    expect(disconnectionDomain).toBeDefined();
    expect(disconnectionDomain!.mean).toBe(3.0); // (4.0 + 2.0) / 2
    expect(disconnectionDomain!.schemas.length).toBe(2);
  });
});

describe('computeQuizResult', () => {
  it('deve calcular resultado completo', () => {
    const answers: Answer[] = Array.from({ length: 90 }, (_, i) => ({
      questionId: i + 1,
      value: 4 as const
    }));

    const result = computeQuizResult(answers, 'short-v1');

    expect(result.versionId).toBe('short-v1');
    expect(result.schemas.length).toBe(18);
    expect(result.domains.length).toBe(5);
    expect(result.totalMean).toBe(4.0);
    expect(result.answers.length).toBe(90);
    expect(result.answeredAt).toBeDefined();
    expect(result.id).toMatch(/^eval_/);
  });

  it('deve calcular totalMean correto', () => {
    const answers: Answer[] = [
      { questionId: 1, value: 2 },
      { questionId: 2, value: 4 },
      { questionId: 3, value: 6 }
    ];

    const result = computeQuizResult(answers, 'short-v1');
    expect(result.totalMean).toBe(4.0); // (2+4+6)/3
  });

  it('deve funcionar com número variável de itens por schema (versão longa)', () => {
    // Simular versão longa: ed tem 9 itens (1-9), ab tem 17 itens (10-26)
    const questions: Question[] = [
      { id: 1, order: 1, text: 'Q1', schemaCode: 'ed' },
      { id: 2, order: 2, text: 'Q2', schemaCode: 'ed' },
      { id: 3, order: 3, text: 'Q3', schemaCode: 'ed' },
      { id: 4, order: 4, text: 'Q4', schemaCode: 'ab' },
      { id: 5, order: 5, text: 'Q5', schemaCode: 'ab' },
    ];

    const answers: Answer[] = [
      { questionId: 1, value: 4 },
      { questionId: 2, value: 4 },
      { questionId: 3, value: 4 },
      { questionId: 4, value: 2 },
      { questionId: 5, value: 2 },
    ];

    const scores = computeSchemaScores(answers, questions);
    const edScore = scores.find(s => s.code === 'ed');
    const abScore = scores.find(s => s.code === 'ab');

    expect(edScore).toBeDefined();
    expect(edScore!.mean).toBe(4.0); // (4+4+4)/3
    expect(edScore!.items).toEqual([1, 2, 3]);

    expect(abScore).toBeDefined();
    expect(abScore!.mean).toBe(2.0); // (2+2)/2
    expect(abScore!.items).toEqual([4, 5]);
  });
});
