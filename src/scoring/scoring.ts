import { Answer, SchemaScore, DomainScore, QuizResult, SchemaCode, ScoreLevel } from '../types';
import { schemasMeta, getDomains } from '../data/questions';

// ============================================
// Funções de Scoring
// ============================================

/**
 * Determina o nível de interpretação baseado na média
 */
export function interpretLevel(mean: number): ScoreLevel {
  if (mean < 2) return 'desativado';
  if (mean < 3) return 'leve';
  if (mean < 4) return 'moderado';
  if (mean < 5) return 'alto';
  return 'muito-alto';
}

/**
 * Calcula scores para cada um dos 18 esquemas
 */
export function computeSchemaScores(answers: Answer[]): SchemaScore[] {
  // Agrupar respostas por schema
  const schemaAnswers = new Map<SchemaCode, { items: number[]; values: number[] }>();

  // Inicializar todos os schemas
  Object.keys(schemasMeta).forEach(code => {
    schemaAnswers.set(code as SchemaCode, { items: [], values: [] });
  });

  // Preencher com as respostas
  answers.forEach(answer => {
    const questionId = answer.questionId;
    const schemaCode = getSchemaCodeForQuestion(questionId);
    const data = schemaAnswers.get(schemaCode)!;
    data.items.push(questionId);
    data.values.push(answer.value);
  });

  // Calcular médias
  const scores: SchemaScore[] = [];

  schemaAnswers.forEach((data, code) => {
    const meta = schemasMeta[code];
    const mean = data.values.length > 0
      ? data.values.reduce((sum, v) => sum + v, 0) / data.values.length
      : 0;

    scores.push({
      code,
      name: meta.name,
      domain: meta.domain,
      description: meta.description,
      items: data.items.sort((a, b) => a - b),
      values: data.values,
      mean,
      level: interpretLevel(mean)
    });
  });

  return scores.sort((a, b) => b.mean - a.mean);
}

/**
 * Calcula scores para cada um dos 5 domínios
 */
export function computeDomainScores(schemas: SchemaScore[]): DomainScore[] {
  const domains = getDomains();
  const domainScores: DomainScore[] = [];

  domains.forEach(domainName => {
    const domainSchemas = schemas.filter(s => s.domain === domainName);
    const mean = domainSchemas.length > 0
      ? domainSchemas.reduce((sum, s) => sum + s.mean, 0) / domainSchemas.length
      : 0;

    domainScores.push({
      name: domainName,
      schemas: domainSchemas,
      mean
    });
  });

  return domainScores.sort((a, b) => b.mean - a.mean);
}

/**
 * Calcula o resultado completo do quiz
 */
export function computeQuizResult(answers: Answer[], versionId: string): QuizResult {
  const schemas = computeSchemaScores(answers);
  const domains = computeDomainScores(schemas);
  const totalMean = answers.length > 0
    ? answers.reduce((sum, a) => sum + a.value, 0) / answers.length
    : 0;

  return {
    id: generateId(),
    versionId,
    schemas,
    domains,
    totalMean,
    answers,
    answeredAt: new Date().toISOString()
  };
}

// ============================================
// Funções auxiliares
// ============================================

/**
 * Obtém o schema code para uma questão baseada no ID
 * Padrão: schema X tem questões X, X+18, X+36, X+54, X+72
 */
function getSchemaCodeForQuestion(questionId: number): SchemaCode {
  const schemaOrder: SchemaCode[] = [
    'ed', 'ab', 'ma', 'si', 'ds', 'fa', 'di', 'vh', 'em',
    'sb', 'ss', 'ei', 'us', 'et', 'is', 'as', 'np', 'pu'
  ];

  const index = (questionId - 1) % 18;
  return schemaOrder[index];
}

/**
 * Gera ID único para avaliação
 */
function generateId(): string {
  return `eval_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Valida se todas as questões foram respondidas
 */
export function validateAnswers(answers: Answer[], expectedCount: number): boolean {
  if (answers.length !== expectedCount) return false;
  
  const questionIds = new Set(answers.map(a => a.questionId));
  if (questionIds.size !== expectedCount) return false;

  // Verificar se todas as respostas são válidas (1-6)
  return answers.every(a => a.value >= 1 && a.value <= 6);
}
