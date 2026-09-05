import { Question, SchemaCode, SchemaMeta, DomainName, QuizVersion } from '../types';
import { quizVersionLong } from './questions-long';

// ============================================
// Metadados dos 18 Esquemas
// ============================================

export const schemasMeta: Record<SchemaCode, SchemaMeta> = {
  ed: {
    code: 'ed',
    name: 'Privação Emocional',
    domain: 'Desconexão/Rejeição',
    description: 'Expectativa de que não se receberá apoio emocional adequado dos outros.'
  },
  ab: {
    code: 'ab',
    name: 'Abandono/Instabilidade',
    domain: 'Desconexão/Rejeição',
    description: 'Expectativa de que as pessoas próximas irão abandonar ou morrer.'
  },
  ma: {
    code: 'ma',
    name: 'Desconfiança/Abuso',
    domain: 'Desconexão/Rejeição',
    description: 'Expectativa de que os outros irão machucar, abusar ou enganar.'
  },
  si: {
    code: 'si',
    name: 'Isolamento Social',
    domain: 'Desconexão/Rejeição',
    description: 'Sensação de ser diferente dos outros e não pertencer a nenhum grupo.'
  },
  ds: {
    code: 'ds',
    name: 'Defectividade/Vergonha',
    domain: 'Desconexão/Rejeição',
    description: 'Sentimento de ser fundamentalmente defeituoso e indigno de amor.'
  },
  fa: {
    code: 'fa',
    name: 'Fracasso',
    domain: 'Autonomia Prejudicada',
    description: 'Crença de que se é um fracasso em relação aos pares.'
  },
  di: {
    code: 'di',
    name: 'Dependência/Incompetência',
    domain: 'Autonomia Prejudicada',
    description: 'Crença de que não se é capaz de lidar com responsabilidades diárias.'
  },
  vh: {
    code: 'vh',
    name: 'Vulnerabilidade a Danos/Doenças',
    domain: 'Autonomia Prejudicada',
    description: 'Medo exagerado de catástrofes médicas, financeiras ou naturais.'
  },
  em: {
    code: 'em',
    name: 'Emaranhamento/Self Indiferenciado',
    domain: 'Autonomia Prejudicada',
    description: 'Envolvimento emocional excessivo com pais ou parceiros.'
  },
  sb: {
    code: 'sb',
    name: 'Subjugação',
    domain: 'Orientação ao Outro',
    description: 'Submissão excessiva para evitar raiva ou abandono dos outros.'
  },
  ss: {
    code: 'ss',
    name: 'Autossacrifício',
    domain: 'Orientação ao Outro',
    description: 'Foco excessivo em atender às necessidades dos outros às custas de si mesmo.'
  },
  ei: {
    code: 'ei',
    name: 'Inibição Emocional',
    domain: 'Vigilância Excessiva e Inibição',
    description: 'Supressão de emoções para evitar vergonha ou perda de controle.'
  },
  us: {
    code: 'us',
    name: 'Padrões Inflexíveis/Hipercrítica',
    domain: 'Vigilância Excessiva e Inibição',
    description: 'Exigência interna de perfeição e autoconsciência excessiva.'
  },
  et: {
    code: 'et',
    name: 'Grandiosidade/Entitlement',
    domain: 'Limites Prejudicados',
    description: 'Crença de que se é superior e não deve seguir regras normais.'
  },
  is: {
    code: 'is',
    name: 'Autocontrole Insuficiente',
    domain: 'Limites Prejudicados',
    description: 'Dificuldade em tolerar frustração ou seguir metas de longo prazo.'
  },
  as: {
    code: 'as',
    name: 'Busca de Aprovação/Reconhecimento',
    domain: 'Orientação ao Outro',
    description: 'Autoestima baseada na aprovação e reconhecimento dos outros.'
  },
  np: {
    code: 'np',
    name: 'Negatividade/Pessimismo',
    domain: 'Vigilância Excessiva e Inibição',
    description: 'Foco persistente nos aspectos negativos da vida.'
  },
  pu: {
    code: 'pu',
    name: 'Punitividade',
    domain: 'Vigilância Excessiva e Inibição',
    description: 'Crença de que erros merecem punição severa.'
  }
};

// ============================================
// Mapeamento Questão → Schema
// ============================================

// Padrão: schema X tem questões X, X+18, X+36, X+54, X+72
const schemaQuestionMap: Record<SchemaCode, number[]> = {
  ed: [1, 19, 37, 55, 73],
  ab: [2, 20, 38, 56, 74],
  ma: [3, 21, 39, 57, 75],
  si: [4, 22, 40, 58, 76],
  ds: [5, 23, 41, 59, 77],
  fa: [6, 24, 42, 60, 78],
  di: [7, 25, 43, 61, 79],
  vh: [8, 26, 44, 62, 80],
  em: [9, 27, 45, 63, 81],
  sb: [10, 28, 46, 64, 82],
  ss: [11, 29, 47, 65, 83],
  ei: [12, 30, 48, 66, 84],
  us: [13, 31, 49, 67, 85],
  et: [14, 32, 50, 68, 86],
  is: [15, 33, 51, 69, 87],
  as: [16, 34, 52, 70, 88],
  np: [17, 35, 53, 71, 89],
  pu: [18, 36, 54, 72, 90]
};

// Função auxiliar para obter schema de uma questão
function getSchemaForQuestion(questionId: number): SchemaCode {
  for (const [schema, questions] of Object.entries(schemaQuestionMap)) {
    if (questions.includes(questionId)) {
      return schema as SchemaCode;
    }
  }
  throw new Error(`Questão ${questionId} não mapeada para nenhum schema`);
}

// ============================================
// 90 Questões da Versão Curta (YSQ-S3)
// ============================================

const questionsData: Array<{ id: number; text: string }> = [
  { id: 1, text: 'Eu não tive ninguém para me dar afeto, cuidado e proteção, que partilhasse sua vida comigo, ou que se importasse de verdade com as coisas que me acontecem.' },
  { id: 2, text: 'Eu percebo que me agarro às pessoas que são próximas de mim com medo de que elas me abandonem.' },
  { id: 3, text: 'Eu sinto que as pessoas vão tirar vantagem de mim.' },
  { id: 4, text: 'Eu não me encaixo.' },
  { id: 5, text: 'Nenhum homem/mulher que eu deseje seria capaz de me amar depois de ver meus defeitos ou falhas.' },
  { id: 6, text: 'Quase nada do que eu faço no trabalho (ou nos estudos) é tão bom quanto o que os outros são capazes de fazer.' },
  { id: 7, text: 'Eu não me sinto capaz de me virar sem a ajuda dos outros no dia a dia.' },
  { id: 8, text: 'Parece que eu não consigo parar de sentir que algo ruim está prestes a acontecer.' },
  { id: 9, text: 'Eu ainda não consegui me separar dos meus pais (ambos ou um deles) do jeito que as outras pessoas da minha idade parecem ter se separado.' },
  { id: 10, text: 'Eu sinto que, se eu fizer o que quero, os outros não me apoiarão e poderão ficar bravos ou chateados comigo.' },
  { id: 11, text: 'Geralmente sou eu quem acaba cuidando das pessoas que são próximas de mim.' },
  { id: 12, text: 'Eu sou envergonhado demais para demonstrar sentimentos positivos para os outros (por ex.: afeto; demonstrar que me importo com eles).' },
  { id: 13, text: 'Eu tenho que ser o melhor na maioria das coisas que eu faço; não consigo aceitar o segundo lugar.' },
  { id: 14, text: 'Eu tenho muita dificuldade de aceitar um "não" quando quero algo dos outros.' },
  { id: 15, text: 'Parece que eu não consigo me disciplinar para concluir a maioria das tarefas rotineiras ou entediantes.' },
  { id: 16, text: 'Ter dinheiro e conhecer pessoas importantes faz com que eu me sinta uma pessoa com valor.' },
  { id: 17, text: 'Mesmo quando as coisas parecem estar indo bem, eu sinto que é apenas questão de tempo para que elas comecem a dar errado.' },
  { id: 18, text: 'Se eu cometer algum erro, mereço ser punido.' },
  { id: 19, text: 'Eu não tenho quem me dê carinho, apoio e afeto.' },
  { id: 20, text: 'Eu preciso tanto das pessoas que fico muito preocupado com a possibilidade de perdê-las.' },
  { id: 21, text: 'Eu sinto que não posso baixar a guarda na presença de outras pessoas, senão elas irão me machucar de propósito.' },
  { id: 22, text: 'Eu sou fundamentalmente diferente das outras pessoas.' },
  { id: 23, text: 'Ninguém que eu deseje iria querer ficar perto de mim se conhecesse quem eu sou de verdade.' },
  { id: 24, text: 'Eu sou incompetente quando se refere a realizações pessoais/profissionais.' },
  { id: 25, text: 'Eu me vejo como uma pessoa dependente dos outros no que se refere ao meu funcionamento diário.' },
  { id: 26, text: 'Eu sinto que uma tragédia (natural, financeira, criminal ou de saúde) pode acontecer a qualquer momento.' },
  { id: 27, text: 'Eu e meu pai/mãe temos a tendência de nos envolver demais nos problemas e na vida uns dos outros.' },
  { id: 28, text: 'Eu sinto como se eu não tivesse outra opção a não ser ceder aos desejos dos outros, senão eles irão ficar bravos, me rejeitar ou retaliar de alguma forma.' },
  { id: 29, text: 'Sou uma boa pessoa por pensar mais nos outros do que em mim.' },
  { id: 30, text: 'Eu acho constrangedor demonstrar o que eu sinto para as outras pessoas.' },
  { id: 31, text: 'Eu tento fazer o meu melhor; eu não consigo me conformar em ser "bom o suficiente".' },
  { id: 32, text: 'Eu sou diferenciado e não deveria ter que aceitar muitas das restrições ou limitações impostas às outras pessoas.' },
  { id: 33, text: 'Se não consigo atingir um objetivo, eu logo me frustro e desisto.' },
  { id: 34, text: 'Minhas conquistas têm mais valor para mim se forem notadas pelas outras pessoas.' },
  { id: 35, text: 'Se algo de bom acontece, fico preocupado e pensando que algo ruim provavelmente vai acontecer depois.' },
  { id: 36, text: 'Se eu não der o meu melhor, eu tenho que me dar mal mesmo.' },
  { id: 37, text: 'Eu nunca me senti especial para ninguém.' },
  { id: 38, text: 'Eu me preocupo muito com a possibilidade de que pessoas próximas a mim me deixem ou me abandonem.' },
  { id: 39, text: 'É só uma questão de tempo até alguém me trair.' },
  { id: 40, text: 'Eu não faço parte: sou uma pessoa solitária.' },
  { id: 41, text: 'Eu não sou digno de receber amor, atenção e o respeito dos outros.' },
  { id: 42, text: 'A maioria das pessoas é mais capaz do que eu no trabalho e nas realizações pessoais.' },
  { id: 43, text: 'Me falta bom senso.' },
  { id: 44, text: 'Eu me preocupo muito em ser agredido fisicamente por alguém.' },
  { id: 45, text: 'Eu e meu pai/mãe temos dificuldades de deixar de contar detalhes íntimos uns para os outros sem nos sentirmos culpados.' },
  { id: 46, text: 'Nos relacionamentos, eu geralmente deixo que a outra pessoa tome as decisões e esteja no controle.' },
  { id: 47, text: 'Eu passo tanto tempo fazendo coisas para as pessoas com quem me importo que acabo tendo pouco tempo para mim mesmo.' },
  { id: 48, text: 'Eu acho difícil me sentir livre e ser espontâneo perto de outras pessoas.' },
  { id: 49, text: 'Eu tenho que dar conta de todas as minhas responsabilidades.' },
  { id: 50, text: 'Eu detesto me sentir obrigado a fazer algo ou que me impeçam de fazer aquilo que eu quero.' },
  { id: 51, text: 'Para mim, é muito difícil abrir mão de prazeres imediatos para atingir objetivos de longo prazo.' },
  { id: 52, text: 'Se as pessoas não me dão muita atenção, eu me sinto menos importante.' },
  { id: 53, text: 'Todo cuidado é pouco, quase sempre algo vai dar errado.' },
  { id: 54, text: 'Se eu não fizer minhas tarefas de forma correta, devo sofrer as consequências.' },
  { id: 55, text: 'Eu não tive ninguém que realmente me escutasse, compreendesse, ou estivesse conectado com as minhas verdadeiras necessidades e sentimentos.' },
  { id: 56, text: 'Quando alguém importante para mim parece estar se fechando ou se afastando, eu fico desesperado.' },
  { id: 57, text: 'Eu desconfio bastante das intenções das outras pessoas.' },
  { id: 58, text: 'Eu me sinto isolado ou desconectado dos outros.' },
  { id: 59, text: 'Eu sinto que sou alguém que não pode ser amado.' },
  { id: 60, text: 'Eu não sou tão talentoso no trabalho quanto a maioria das pessoas.' },
  { id: 61, text: 'Não se pode contar com meu julgamento em situações do dia a dia.' },
  { id: 62, text: 'Eu tenho medo de perder todo o meu dinheiro, de passar necessidades ou ficar muito pobre.' },
  { id: 63, text: 'Eu frequentemente sinto como se meus pais vivessem a minha vida ou vivessem através de mim – é como se eu não tivesse uma vida própria.' },
  { id: 64, text: 'Eu sempre deixei as outras pessoas escolherem por mim, então nem sei o que eu quero para mim mesmo.' },
  { id: 65, text: 'Eu sempre fui aquele que escuta os problemas de todo mundo.' },
  { id: 66, text: 'Eu me controlo tanto que muitas pessoas acham que eu não tenho emoções ou sou insensível.' },
  { id: 67, text: 'Sinto que há uma pressão constante para que eu conquiste e termine as coisas.' },
  { id: 68, text: 'Eu sinto que não deveria ter que seguir as regras e normas que as outras pessoas têm que seguir.' },
  { id: 69, text: 'Eu não consigo me forçar a fazer coisas que eu não goste, mesmo quando sei que é para o meu próprio bem.' },
  { id: 70, text: 'Quando eu faço comentários em uma reunião, ou sou apresentado a alguém em uma situação social, para mim é importante receber reconhecimento e admiração.' },
  { id: 71, text: 'Independentemente de quanto eu trabalhe, preocupo-me com a ideia de ter problemas financeiros sérios e perder quase tudo que tenho.' },
  { id: 72, text: 'Não importa os motivos que me levaram a cometer um erro. Quando faço algo errado, devo sofrer as consequências.' },
  { id: 73, text: 'Eu não tenho tido uma pessoa forte ou sábia para me dar conselhos úteis ou orientação quando não tenho certeza do que fazer.' },
  { id: 74, text: 'Às vezes eu me preocupo tanto que as pessoas possam me abandonar que as afasto de mim.' },
  { id: 75, text: 'Eu geralmente estou atento aos motivos ocultos e às segundas intenções das outras pessoas.' },
  { id: 76, text: 'Eu sempre me sinto deslocado ou de fora dos grupos.' },
  { id: 77, text: 'Sou inaceitável demais para mostrar para as pessoas como eu sou ou deixar que elas me conheçam bem.' },
  { id: 78, text: 'Não sou tão inteligente no trabalho (ou estudos) quanto a maioria das pessoas.' },
  { id: 79, text: 'Não tenho confiança na minha habilidade de resolver os problemas que surgem no dia a dia.' },
  { id: 80, text: 'Eu me preocupo com a possibilidade de desenvolver uma doença grave, mesmo que nada sério tenha sido diagnosticado por um médico.' },
  { id: 81, text: 'Eu muitas vezes sinto que não tenho uma identidade separada da do meu pai/mãe ou companheiro(a).' },
  { id: 82, text: 'Para mim, é muito difícil exigir que meus direitos sejam respeitados e que meus sentimentos sejam levados em consideração.' },
  { id: 83, text: 'As pessoas consideram que faço demais pelos outros e não faço o suficiente por mim mesmo.' },
  { id: 84, text: 'As pessoas me veem como alguém mais fechado emocionalmente.' },
  { id: 85, text: 'Eu não posso "pegar leve" comigo mesmo ou ficar arranjando desculpas pelos meus erros.' },
  { id: 86, text: 'Eu sinto que o que tenho a oferecer tem muito mais valor quando comparado ao que os outros têm para dar.' },
  { id: 87, text: 'Eu raramente consigo seguir com minhas resoluções ou projetos pessoais/profissionais.' },
  { id: 88, text: 'Receber muitos elogios dos outros faz com que eu me sinta uma pessoa de valor.' },
  { id: 89, text: 'Eu me preocupo que uma decisão errada possa causar um desastre.' },
  { id: 90, text: 'Sou uma pessoa má e que merece ser punida.' }
];

// Construir array de questões com schema
export const questions: Question[] = questionsData.map(q => ({
  id: q.id,
  order: q.id,
  text: q.text,
  schemaCode: getSchemaForQuestion(q.id)
}));

// ============================================
// Versões do Quiz
// ============================================

export const quizVersions: Record<string, QuizVersion> = {
  'short-v1': {
    id: 'short-v1',
    name: 'Versão Curta (YSQ-S3)',
    description: '90 questões, aproximadamente 20 minutos',
    totalQuestions: 90,
    questions: questions
  },
  'long-v1': quizVersionLong
};

// ============================================
// Funções auxiliares
// ============================================

export function getQuestionsByVersion(versionId: string): Question[] {
  const version = quizVersions[versionId];
  if (!version) {
    throw new Error(`Versão não encontrada: ${versionId}`);
  }
  return version.questions.sort((a, b) => a.order - b.order);
}

export function getSchemaMeta(code: SchemaCode): SchemaMeta {
  return schemasMeta[code];
}

export function getAllSchemas(): SchemaMeta[] {
  return Object.values(schemasMeta);
}

export function getDomains(): DomainName[] {
  return [
    'Desconexão/Rejeição',
    'Autonomia Prejudicada',
    'Limites Prejudicados',
    'Orientação ao Outro',
    'Vigilância Excessiva e Inibição'
  ];
}
