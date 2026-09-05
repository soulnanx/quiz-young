# Quiz de Young

Questionário de Esquemas de Young (YSQ) - Ferramenta profissional de avaliação psicológica baseada na Terapia do Esquema de Jeffrey Young.

## 🚀 Deploy

O projeto está configurado para deploy automático no GitHub Pages via GitHub Actions.

### Configuração do Deploy

1. **Repositório GitHub**: https://github.com/soulnanx/quiz-young
2. **URL pública**: https://soulnanx.github.io/quiz-young/
3. **Branch**: `master`
4. **Trigger**: Push para `master` dispara deploy automático

### Workflow de Deploy

```yaml
# .github/workflows/deploy.yml
- Build: `npm ci && npm run build`
- Deploy: GitHub Pages via actions/deploy-pages@v4
```

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

#### v1.0.0 (2026-09-04)
- ✅ Implementação inicial
- ✅ Versão Curta (YSQ-S3) - 90 questões
- ✅ Versão Estendida (YSQ-L3) - 232 questões
- ✅ Scoring automático por schema e domínio
- ✅ Exportação PDF e JSON
- ✅ Importação de questionários
- ✅ PWA (Progressive Web App)
- ✅ Design responsivo (mobile + desktop)
- ✅ Persistência local (localStorage)
- ✅ Histórico de avaliações

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
│   ├── data/            # Questões (short + long)
│   ├── lib/             # Utils, storage, export, import
│   ├── pages/           # Home, Quiz, Result
│   ├── scoring/         # Lógica de cálculo de scores
│   └── types/           # Interfaces TypeScript
── public/              # Assets estáticos (PWA icons)
├── docs/                # Documentação e specs
└── artifacts/           # Screenshots de teste
```

## 📊 Funcionalidades

### Versões do Questionário

| Versão | Questões | Tempo | Uso |
|--------|----------|-------|-----|
| YSQ-S3 (Curta) | 90 | ~20 min | Triagem rápida |
| YSQ-L3 (Estendida) | 232 | ~60 min | Avaliação clínica completa |

### Esquemas Avaliados

18 Early Maladaptive Schemas (EMS) organizados em 5 domínios:

1. **Desconexão/Rejeição**
   - Abandono, Desconfiança, Privação Emocional, Defectividade, Isolamento Social

2. **Autonomia Prejudicada**
   - Dependência, Vulnerabilidade, Emaranhamento, Fracasso

3. **Limites Prejudicados**
   - Entitlement, Autocontrole Insuficiente

4. **Orientação ao Outro**
   - Subjugação, Autossacrifício, Busca de Aprovação

5. **Vigilância Excessiva e Inibição**
   - Inibição Emocional, Padrões Inflexíveis, Negatividade, Punitividade

### Exportação e Importação

- **Exportar PDF**: Relatório formatado para impressão
- **Exportar JSON**: Dados estruturados para integração
- **Importar JSON**: Carregar avaliação anterior para revisão

## ⚠️ Aviso Importante

Este questionário é uma ferramenta de **triagem e avaliação** e **NÃO substitui** o diagnóstico clínico realizado por um psicólogo qualificado. Os resultados devem ser interpretados por um profissional especializado em Terapia do Esquema.

## 📄 Licença

© 2026 - Projeto educacional/profissional

O Questionário de Esquemas de Young (YSQ) é uma marca registrada de Jeffrey Young, Ph.D. Este projeto é uma implementação não-oficial para fins educacionais e de pesquisa.

## 🔗 Links

- [Schema Therapy Institute](https://schematherapy.com)
- [Young Institute](https://www.schematherapynyc.com)
- [Repositório GitHub](https://github.com/soulnanx/quiz-young)
- [Deploy GitHub Pages](https://soulnanx.github.io/quiz-young/)
