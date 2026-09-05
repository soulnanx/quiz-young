# Quiz de Young

Questionário de Esquemas de Young (YSQ) - Ferramenta de avaliação psicológica baseada na Terapia do Esquema de Jeffrey Young.

## ⚖️ Aviso Legal e Natureza do Projeto

> **Este projeto tem fins estritamente acadêmicos e de demonstração técnica (prova de conceito/algoritmo).**

- **Não possui cunho comercial ou financeiro.**
- **Não é um produto médico ou psicológico certificado.**
- **Não substitui avaliação profissional realizada por psicólogo qualificado.**
- **Não gera receita, cobrança ou qualquer tipo de transação financeira.**
- **Os resultados são meramente informativos e educacionais.**

O Questionário de Esquemas de Young (YSQ) é uma marca registrada de Jeffrey Young, Ph.D. e do Schema Therapy Institute. Este projeto é uma implementação não-oficial, desenvolvida exclusivamente para fins de estudo acadêmico e demonstração de capacidade técnica de desenvolvimento de software.

Os autores deste projeto não se responsabilizam pelo uso inadequado das informações aqui contidas. Nenhuma relação médico-paciente é estabelecida através desta aplicação.

---

## ✨ Funcionalidades (Features)

### 🧪 Três Versões do Questionário

| Versão | Questões | Tempo Estimado | Uso |
|--------|----------|----------------|-----|
| **YSQ-S3** (Curta) | 90 | ~20 min | Triagem rápida |
| **YSQ-200** (Intermediária) | 200 | ~45 min | Equilíbrio entre rapidez e profundidade |
| **YSQ-L3** (Estendida) | 232 | ~60 min | Avaliação clínica detalhada |

### 📝 Fluxo do Quiz

- **Tela de instruções** detalhada antes de iniciar
- **Uma pergunta por tela** com contador de progresso (ex: "Questão 12 de 90")
- **Escala Likert de 1 a 6** com slider no mobile e botões no desktop
- **Navegação por teclado**: Espaço = próxima, Backspace = anterior
- **Botão de debug** (`?debug=true`) para preenchimento automático durante desenvolvimento

### 📊 Scoring e Resultados

- **18 Esquemas Iniciais Desadaptativos (EIDs)** avaliados
- **5 Domínios** organizacionais
- **Cálculo automático** de média por schema e por domínio
- **Classificação por nível**: Desativado, Leve, Moderado, Alto, Muito Alto
- **Gráfico radar** com perfil visual dos 18 esquemas (Recharts)
- **Cards individuais** por esquema com score, nível e descrição
- **Barras de domínio** com score agregado e schemas internos

### 💾 Persistência e Histórico

- **Salvamento automático** no localStorage do navegador
- **Histórico de avaliações** na tela inicial
- **Últimas 10 avaliações** mantidas no histórico
- **Visualização** de resultados anteriores a qualquer momento
- **Remoção individual** de avaliações do histórico

### 📤 Exportação

- **PDF**: Relatório formatado com scores, domínios, esquemas e disclaimer (jsPDF)
- **JSON**: Dados estruturados completos para integração com outros sistemas

### 📥 Importação

- **Importar JSON**: Carregar avaliação exportada anteriormente
- **Botão na tela inicial** para fácil acesso
- **Validação de estrutura** do arquivo antes de importar
- **Feedback visual** de sucesso ou erro

###  PWA (Progressive Web App)

- **Instalável** em dispositivos móveis e desktop
- **Funcionamento offline** após primeiro carregamento (Service Worker)
- **Ícones adaptativos** (192x192, 512x512, maskable 512x512)
- **Manifest completo** com tema e cores

###  Design e UX

- **Design responsivo** (mobile-first, funciona em qualquer tela)
- **Gradiente azul/índigo** profissional
- **Cards com sombras** e bordas arredondadas
- **Animações suaves** de transição
- **Altura fixa** nos cards de pergunta para evitar "pulos" visuais
- **Acessibilidade**: labels semânticos, navegação por teclado

### 🔧 Técnico

- **TypeScript** com tipagem estrita
- **React 18** com hooks
- **Vite** para build rápido
- **Tailwind CSS** para estilização
- **Vitest** para testes unitários (8 testes de scoring)
- **GitHub Actions** para deploy automático no GitHub Pages

---

## 🚀 Deploy

O projeto está configurado para deploy automático no GitHub Pages via GitHub Actions.

- **Repositório**: https://github.com/soulnanx/quiz-young
- **URL pública**: https://soulnanx.github.io/quiz-young/
- **Branch**: `master`
- **Trigger**: Push para `master` dispara deploy automático

---

## 📋 Versionamento

### Estratégia de Versionamento

Este projeto usa versionamento semântico (Semantic Versioning) no formato `MAJOR.MINOR.PATCH`.

#### Quando atualizar cada versão:

**MAJOR** (1.0.0 → 2.0.0)
- Mudanças incompatíveis com versões anteriores
- Redesign completo da interface
- Mudança na estrutura de dados do resultado

**MINOR** (1.0.0 → 1.1.0)
- Novas features (ex: adicionar versão estendida YSQ-L3)
- Novos esquemas ou domínios
- Novas formas de exportação

**PATCH** (1.0.0 → 1.0.1)
- Bug fixes
- Correções de texto/tradução
- Ajustes de layout
- Performance improvements

### Processo de Release

1. **Atualizar versão no `package.json`**:
   ```json
   {
     "version": "1.1.0"
   }
   ```

2. **Atualizar versão no `src/pages/Home.tsx`**:
   ```typescript
   const APP_VERSION = '1.1.0';
   ```

3. **Commit com tag**:
   ```bash
   git add .
   git commit -m "chore: release v1.1.0"
   git tag -a v1.1.0 -m "Release v1.1.0 - Descrição das mudanças"
   git push origin master --tags
   ```

### Histórico de Versões

#### v1.1.0 (2026-09-05)
- ✅ Versão Intermediária YSQ-200 (200 questões)
- ✅ Importação de questionários via JSON
- ✅ PWA com ícones e service worker
- ✅ README completo com features e aviso legal
- ✅ Correções de layout mobile (altura fixa, legenda estável)
- ✅ Botão importar movido para tela inicial

#### v1.0.0 (2026-09-04)
- ✅ Implementação inicial
- ✅ Versão Curta (YSQ-S3) - 90 questões
- ✅ Versão Estendida (YSQ-L3) - 232 questões
- ✅ Scoring automático por schema e domínio
- ✅ Exportação PDF e JSON
- ✅ Design responsivo (mobile + desktop)
- ✅ Persistência local (localStorage)
- ✅ Histórico de avaliações
- ✅ Atalhos de teclado (Espaço/Backspace)
- ✅ Modo debug (?debug=true)

---

## 🛠️ Desenvolvimento Local

### Pré-requisitos

- Node.js 20+
- npm 10+

### Instalação

```bash
git clone https://github.com/soulnanx/quiz-young.git
cd quiz-young
npm install
```

### Comandos

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Testes
npm test

# Preview do build
npm run preview
```

### Estrutura do Projeto

```
quiz-young/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── data/            # Questões (short, medium, long)
│   ├── lib/             # Utils, storage, export, import
│   ├── pages/           # Home, Quiz, Result
│   ├── scoring/         # Lógica de cálculo de scores
│   └── types/           # Interfaces TypeScript
├── public/              # Assets estáticos (PWA icons)
├── docs/                # Documentação e specs
└── artifacts/           # Screenshots de teste
```

---

## 📊 Esquemas e Domínios

18 Early Maladaptive Schemas (EMS) organizados em 5 domínios:

1. **Desconexão/Rejeição**
   - Abandono, Desconfiança/Abuso, Privação Emocional, Defectividade/Vergonha, Isolamento Social

2. **Autonomia Prejudicada**
   - Dependência/Incompetência, Vulnerabilidade a Danos/Doenças, Emaranhamento/Self Indiferenciado, Fracasso

3. **Limites Prejudicados**
   - Grandiosidade/Entitlement, Autocontrole Insuficiente

4. **Orientação ao Outro**
   - Subjugação, Autossacrifício, Busca de Aprovação/Reconhecimento

5. **Vigilância Excessiva e Inibição**
   - Inibição Emocional, Padrões Inflexíveis/Hipercrítica, Negatividade/Pessimismo, Punitividade

---

## 📄 Licença

© 2026 - Projeto acadêmico e de demonstração técnica.

Este software é fornecido "como está", sem garantias de qualquer tipo. O uso é de inteira responsabilidade do usuário.

O Questionário de Esquemas de Young (YSQ) é uma marca registrada de Jeffrey Young, Ph.D. e do Schema Therapy Institute. Este projeto não é afiliado, endossado ou patrocinado pelo Schema Therapy Institute ou por Jeffrey Young.

---

## 🔗 Links

- [Schema Therapy Institute](https://schematherapy.com)
- [Young Institute](https://www.schematherapynyc.com)
- [Repositório GitHub](https://github.com/soulnanx/quiz-young)
- [Deploy GitHub Pages](https://soulnanx.github.io/quiz-young/)
