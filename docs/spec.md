# Spec: Quiz de Young (YSQ-S3)

## 1. Visão Geral

Aplicação web estática para aplicar o **Young Schema Questionnaire — Short Form 3 (YSQ-S3)** de forma interativa. O usuário responde 90 questões em escala Likert 1–6 e recebe ao final um perfil de scores por esquema e por domínio, com interpretação clínica.

**Deploy**: GitHub Pages (push to `master`), mesmo padrão do `calculadora-nobre`.

---

## 2. Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | React | 18.x |
| Linguagem | TypeScript | 5.x |
| Build | Vite | 5.x |
| CSS | Tailwind CSS | 3.x |
| Roteamento | react-router-dom (HashRouter) | 6.x |
| Gráficos | Recharts (RadarChart) | 2.x |
| Testes | Vitest | 1.x |
| PWA | vite-plugin-pwa | 1.x |
| Deploy | GitHub Actions → Pages | — |

**Sem backend.** Estado em memória durante o quiz. Persistência opcional via `localStorage` para retomar quiz interrompido.

---

## 3. Estrutura de Arquivos

```
quiz-young/
├── .github/workflows/deploy.yml
├── docs/
│   └── spec.md                          ← este arquivo
├── public/
│   ├── favicon.svg
│   ├── pwa-192.png
│   ├── pwa-512.png
│   └── pwa-maskable-512.png
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
│
└── src/
    ├── main.tsx                         ← entry point
    ├── App.tsx                          ← HashRouter + rotas
    ├── index.css                        ← tailwind directives
    │
    ├── data/
    │   └── questions.ts                 ← 90 questões + mapeamento schema
    │
    ├── types/
    │   └── index.ts                     ← interfaces centralizadas
    │
    ├── scoring/
    │   ├── scoring.ts                   ← lógica de cálculo
    │   └── scoring.test.ts              ← testes vitest
    │
    ├── lib/
    │   └── utils.ts                     ← formatters + interpretação
    │
    ├── components/
    │   ├── LikertScale.tsx              ← 6 botões radio (1-6)
    │   ├── QuestionCard.tsx             ← pergunta + LikertScale
    │   ├── ProgressBar.tsx              ← barra de progresso
    │   ├── ResultCard.tsx               ← card de score (reutiliza padrão calc-nobre)
    │   ├── SchemaRadarChart.tsx         ← gráfico radar dos 18 esquemas
    │   └── DomainBar.tsx                ← barra horizontal por domínio
    │
    └── pages/
        ├── Home.tsx                     ← hub: escolha curta/estendida
        ├── Quiz.tsx                     ← fluxo de perguntas
        └── Result.tsx                   ← compilação de resultados
```

---

## 4. Dados: Questões e Esquemas

### 4.1 Os 18 Esquemas (EMS)

| # | Código | Nome (PT) | Domínio |
|---|--------|-----------|---------|
| 1 | ed | Privação Emocional | Desconexão/Rejeição |
| 2 | ab | Abandono/Instabilidade | Desconexão/Rejeição |
| 3 | ma | Desconfiança/Abuso | Desconexão/Rejeição |
| 4 | si | Isolamento Social | Desconexão/Rejeição |
| 5 | ds | Defectividade/Vergonha | Desconexão/Rejeição |
| 6 | fa | Fracasso | Autonomia Prejudicada |
| 7 | di | Dependência/Incompetência | Autonomia Prejudicada |
| 8 | vh | Vulnerabilidade a Danos/Doenças | Autonomia Prejudicada |
| 9 | em | Emaranhamento/Self Indiferenciado | Autonomia Prejudicada |
| 10 | sb | Subjugação | Orientação ao Outro |
| 11 | ss | Autossacrifício | Orientação ao Outro |
| 12 | ei | Inibição Emocional | Vigilância Excessiva |
| 13 | us | Padrões Inflexíveis/Hipercrítica | Vigilância Excessiva |
| 14 | et | Grandiosidade/Entitlement | Limites Prejudicados |
| 15 | is | Autocontrole Insuficiente | Limites Prejudicados |
| 16 | as | Busca de Aprovação/Reconhecimento | Orientação ao Outro |
| 17 | np | Negatividade/Pessimismo | Vigilância Excessiva |
| 18 | pu | Punitividade | Vigilância Excessiva |

### 4.2 Os 5 Domínios

| Domínio | Esquemas |
|---------|----------|
| Desconexão/Rejeição | ed, ab, ma, si, ds |
| Autonomia Prejudicada | fa, di, vh, em |
| Limites Prejudicados | et, is |
| Orientação ao Outro | sb, ss, as |
| Vigilância Excessiva e Inibição | ei, us, np, pu |

### 4.3 Mapeamento Questão → Schema

Padrão: itens 1–18 cobrem o primeiro item de cada schema, 19–36 o segundo, etc.

```
Schema ed: questões 1, 19, 37, 55, 73
Schema ab: questões 2, 20, 38, 56, 74
Schema ma: questões 3, 21, 39, 57, 75
Schema si: questões 4, 22, 40, 58, 76
Schema ds: questões 5, 23, 41, 59, 77
Schema fa: questões 6, 24, 42, 60, 78
Schema di: questões 7, 25, 43, 61, 79
Schema vh: questões 8, 26, 44, 62, 80
Schema em: questões 9, 27, 45, 63, 81
Schema sb: questões 10, 28, 46, 64, 82
Schema ss: questões 11, 29, 47, 65, 83
Schema ei: questões 12, 30, 48, 66, 84
Schema us: questões 13, 31, 49, 67, 85
Schema et: questões 14, 32, 50, 68, 86
Schema is: questões 15, 33, 51, 69, 87
Schema as: questões 16, 34, 52, 70, 88
Schema np: questões 17, 35, 53, 71, 89
Schema pu: questões 18, 36, 54, 72, 90
```

### 4.4 Estrutura de Dados (`data/questions.ts`)

```typescript
export interface Question {
  id: number;           // 1-90
  text: string;         // texto da afirmação
  schemaCode: string;   // 'ed' | 'ab' | ... | 'pu'
}

export const questions: Question[] = [
  { id: 1, text: 'Eu não tive ninguém para me dar afeto, cuidado e proteção...', schemaCode: 'ed' },
  // ... 90 itens
];
```

---

## 5. Scoring (`scoring/scoring.ts`)

### 5.1 Regras

- **Score por schema** = média aritmética dos 5 itens (soma ÷ 5)
- **Score por domínio** = média dos scores dos schemas do domínio
- **Score total** = média dos 90 itens (referência geral)

### 5.2 Interpretação

| Score médio | Nível | Descrição |
|-------------|-------|-----------|
| 1.0 – 1.9 | Desativado | Esquema provavelmente não presente |
| 2.0 – 2.9 | Leve | Alguma ativação, vale explorar |
| 3.0 – 3.9 | Moderado | Esquema moderadamente ativo |
| 4.0 – 4.9 | Alto | Esquema clinicamente significativo |
| 5.0 – 6.0 | Muito Alto | Esquema fortemente ativo |

### 5.3 Interfaces

```typescript
// types/index.ts

export interface Answer {
  questionId: number;
  value: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface SchemaScore {
  code: string;           // 'ed'
  name: string;           // 'Privação Emocional'
  domain: string;         // 'Desconexão/Rejeição'
  items: number[];        // [1, 19, 37, 55, 73]
  values: number[];       // respostas do usuário
  mean: number;           // média (1.0 - 6.0)
  level: 'desativado' | 'leve' | 'moderado' | 'alto' | 'muito-alto';
}

export interface DomainScore {
  name: string;
  schemas: SchemaScore[];
  mean: number;
}

export interface QuizResult {
  schemas: SchemaScore[];
  domains: DomainScore[];
  totalMean: number;
  answeredAt: string;     // ISO timestamp
}
```

### 5.4 Funções

```typescript
// scoring/scoring.ts

export function computeSchemaScores(answers: Answer[]): SchemaScore[]
export function computeDomainScores(schemas: SchemaScore[]): DomainScore[]
export function computeQuizResult(answers: Answer[]): QuizResult
export function interpretLevel(mean: number): SchemaScore['level']
```

---

## 6. Componentes

### 6.1 `LikertScale`

6 botões horizontais (1–6), cada um com label curto abaixo:

```
[1]  [2]  [3]  [4]  [5]  [6]
Com- Em   Um   Mo-  Em   Me
ple- gran- pou- de-  gran- des-
ta-  te    co   ra-  te    cre-
men-       mais do    per-  ve
te              que    fei-
falso            falso  ta-
                 mente
```

Props: `value: number | null`, `onChange: (v: number) => void`

### 6.2 `QuestionCard`

Exibe:
- Número da questão (ex: "Questão 12 de 90")
- Texto da afirmação
- `LikertScale` abaixo

Props: `question: Question`, `value: number | null`, `onChange: (v: number) => void`

### 6.3 `ProgressBar`

Barra de progresso + texto "12 / 90"

Props: `current: number`, `total: number`

### 6.4 `ResultCard`

Card com score de um schema. Reutiliza padrão visual do `calculadora-nobre`.

Props: `schema: SchemaScore`

Exibe: nome do schema, score médio (ex: 3.8), nível (ex: "Alto"), barra visual colorida.

### 6.5 `SchemaRadarChart`

Gráfico radar (Recharts `RadarChart`) com os 18 esquemas.

Props: `schemas: SchemaScore[]`

### 6.6 `DomainBar`

Barra horizontal com score do domínio.

Props: `domain: DomainScore`

---

## 7. Páginas e Fluxo

### 7.1 `Home` (`/`)

- Header com título "Quiz de Young" + versão
- Card "Versão Curta" (90 questões, ~20 min) → link para `/quiz`
- Card "Versão Estendida" (232 questões) → desabilitado com label "Em breve" (preparar estrutura para futuro)
- Texto breve explicando o que é o YSQ

### 7.2 `Quiz` (`/quiz`)

**Estado:**
```typescript
const [currentIndex, setCurrentIndex] = useState(0);
const [answers, setAnswers] = useState<Answer[]>([]);
```

**Fluxo:**
1. Tela de instruções (texto do PDF) + botão "Começar"
2. Uma questão por vez, com:
   - `ProgressBar` no topo
   - `QuestionCard` no centro
   - Botões "Anterior" / "Próxima"
   - "Próxima" desabilitada se não respondeu
3. Na última questão, botão muda para "Ver Resultado"
4. Ao clicar "Ver Resultado" → calcula scores → navega para `/resultado`

**Persistência opcional:** salvar `answers` no `localStorage` a cada resposta. Ao voltar em `/quiz`, restaurar.

### 7.3 `Result` (`/resultado`)

**Seções:**

1. **Resumo geral** — score total médio + interpretação
2. **Perfil por esquema** — 18 cards `ResultCard`, ordenados por score (maior primeiro)
3. **Perfil por domínio** — 5 barras `DomainBar`
4. **Gráfico radar** — `SchemaRadarChart` com os 18 esquemas
5. **Disclaimer** — "Este resultado não substitui avaliação profissional"
6. **Botão "Refazer quiz"** → volta para `/`

---

## 8. Rotas (`App.tsx`)

```typescript
<HashRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/quiz" element={<Quiz />} />
    <Route path="/resultado" element={<Result />} />
  </Routes>
</HashRouter>
```

---

## 9. Deploy (`deploy.yml`)

Idêntico ao `calculadora-nobre`, ajustando apenas `base` no `vite.config.ts`:

```typescript
// vite.config.ts
export default defineConfig({
  base: '/quiz-young/',
  // ...
});
```

---

## 10. Plano de Implementação (fases)

### Fase 1: Setup (infra)
- [ ] Inicializar projeto Vite + React + TS
- [ ] Configurar Tailwind, PWA, Vitest
- [ ] Configurar `deploy.yml`
- [ ] Criar `index.html`, `main.tsx`, `App.tsx` com rotas vazias

### Fase 2: Dados e Scoring
- [ ] Criar `types/index.ts` com todas as interfaces
- [ ] Criar `data/questions.ts` com as 90 questões + mapeamento
- [ ] Implementar `scoring/scoring.ts`
- [ ] Escrever `scoring/scoring.test.ts` (testar médias, níveis, domínios)

### Fase 3: Componentes
- [ ] `LikertScale` — 6 botões, seleção visual
- [ ] `QuestionCard` — pergunta + escala
- [ ] `ProgressBar` — progresso
- [ ] `ResultCard` — card de score com cor por nível
- [ ] `DomainBar` — barra por domínio
- [ ] `SchemaRadarChart` — gráfico radar

### Fase 4: Páginas
- [ ] `Home` — hub com cards
- [ ] `Quiz` — fluxo de perguntas com navegação
- [ ] `Result` — compilação de resultados

### Fase 5: Polish e Deploy
- [ ] Responsividade mobile
- [ ] PWA icons
- [ ] Testes passando
- [ ] Deploy no GitHub Pages

---

## 11. Decisões de Design

| Decisão | Justificativa |
|---------|---------------|
| HashRouter (não BrowserRouter) | GitHub Pages não suporta SPA fallback; hash funciona sem config |
| Estado em memória (não Context/Redux) | Quiz é linear, 90 respostas cabem em state local |
| localStorage opcional | Permite retomar quiz fechado acidentalmente |
| Recharts RadarChart | Já usado no calc-nobre, familiaridade |
| Sem i18n | Projeto PT-BR only, sem necessidade de multi-idioma |
| Versão estendida "Em breve" | Estrutura pronta para adicionar sem refatorar |

---

## 12. Critérios de Aceite

- [ ] Usuário consegue responder as 90 questões sequencialmente
- [ ] Cada resposta é acumulada corretamente (pergunta + valor)
- [ ] Score por schema = média dos 5 itens (verificar com teste)
- [ ] Score por domínio = média dos schemas do domínio
- [ ] Gráfico radar exibe os 18 esquemas
- [ ] Nível de interpretação correto para cada score
- [ ] Responsivo (mobile-first)
- [ ] Deploy funciona no GitHub Pages
- [ ] Testes de scoring passam
