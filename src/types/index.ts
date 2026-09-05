// ============================================
// Types para Quiz de Young (YSQ-S3)
// ============================================

// Escala Likert
export type LikertValue = 1 | 2 | 3 | 4 | 5 | 6;

// Questão individual
export interface Question {
  id: number;           // ID estável (1-90 para curta)
  order: number;        // Ordem de exibição
  text: string;         // Texto da afirmação
  schemaCode: SchemaCode;
}

// Códigos dos 18 esquemas
export type SchemaCode =
  | 'ed'  // Privação Emocional
  | 'ab'  // Abandono/Instabilidade
  | 'ma'  // Desconfiança/Abuso
  | 'si'  // Isolamento Social
  | 'ds'  // Defectividade/Vergonha
  | 'fa'  // Fracasso
  | 'di'  // Dependência/Incompetência
  | 'vh'  // Vulnerabilidade a Danos/Doenças
  | 'em'  // Emaranhamento/Self Indiferenciado
  | 'sb'  // Subjugação
  | 'ss'  // Autossacrifício
  | 'ei'  // Inibição Emocional
  | 'us'  // Padrões Inflexíveis/Hipercrítica
  | 'et'  // Grandiosidade/Entitlement
  | 'is'  // Autocontrole Insuficiente
  | 'as'  // Busca de Aprovação/Reconhecimento
  | 'np'  // Negatividade/Pessimismo
  | 'pu'; // Punitividade

// Metadados do esquema
export interface SchemaMeta {
  code: SchemaCode;
  name: string;
  domain: DomainName;
  description: string;
}

// Nomes dos 5 domínios
export type DomainName =
  | 'Desconexão/Rejeição'
  | 'Autonomia Prejudicada'
  | 'Limites Prejudicados'
  | 'Orientação ao Outro'
  | 'Vigilância Excessiva e Inibição';

// Versão do quiz
export interface QuizVersion {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
  questions: Question[];
}

// Resposta do usuário
export interface Answer {
  questionId: number;
  value: LikertValue;
}

// Nível de interpretação
export type ScoreLevel = 'desativado' | 'leve' | 'moderado' | 'alto' | 'muito-alto';

// Score de um schema
export interface SchemaScore {
  code: SchemaCode;
  name: string;
  domain: DomainName;
  description: string;
  items: number[];      // IDs das questões
  values: number[];     // Respostas do usuário
  mean: number;         // Média (1.0 - 6.0)
  level: ScoreLevel;
}

// Score de um domínio
export interface DomainScore {
  name: DomainName;
  schemas: SchemaScore[];
  mean: number;
}

// Resultado completo do quiz
export interface QuizResult {
  id: string;
  versionId: string;
  schemas: SchemaScore[];
  domains: DomainScore[];
  totalMean: number;
  answers: Answer[];
  answeredAt: string;   // ISO timestamp
}

// Histórico de avaliações
export interface EvaluationHistory {
  evaluations: QuizResult[];
}

export interface QuizDraft {
  versionId: string;
  answers: Answer[];
  currentIndex: number;
  updatedAt: string;
}
