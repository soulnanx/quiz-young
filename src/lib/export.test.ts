import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildCsv, exportAsCsv } from './export';
import { schemasMeta } from '../data/questions';
import { formatDate, formatScore } from './utils';
import { QuizResult, SchemaCode, SchemaScore } from '../types';

// Ordem dos códigos conforme schemasMeta (insertion order), não por score
const META_CODES: SchemaCode[] = Object.values(schemasMeta).map(m => m.code);

const ANSWERED_AT = '2026-09-05T10:30:00.000Z';

function makeResult(): QuizResult {
  const means = new Map<SchemaCode, number>(
    META_CODES.map((code, i) => [code, 1 + i * 0.25])
  );

  // result.schemas em ordem DESC de score — 'pu' primeiro, 'ed' por último.
  // buildCsv deve ignorar essa ordem e usar a do schemasMeta.
  const schemas: SchemaScore[] = [...META_CODES].reverse().map(code => {
    const meta = schemasMeta[code];
    return {
      code,
      name: meta.name,
      domain: meta.domain,
      description: meta.description,
      items: [1],
      values: [3],
      mean: means.get(code)!,
      level: 'moderado'
    };
  });

  return {
    id: 'eval_teste1',
    versionId: 'short-v1',
    schemas,
    domains: [],
    totalMean: 3.75,
    answers: [],
    answeredAt: ANSWERED_AT
  };
}

const EXPECTED_HEADER =
  '\uFEFFid;data;versao;score_total;ed;ab;ma;si;ds;fa;di;vh;em;sb;ss;ei;us;et;is;as;np;pu';

describe('buildCsv', () => {
  it('emite cabeçalho exato com códigos na ordem do schemasMeta', () => {
    const csv = buildCsv(makeResult());
    expect(csv.split('\n')[0]).toBe(EXPECTED_HEADER);
  });

  it('emite uma linha de dados com 22 colunas e valores formatados', () => {
    const csv = buildCsv(makeResult());
    const rows = csv.split('\n');
    expect(rows).toHaveLength(2);

    const cells = rows[1].split(';');
    expect(cells).toHaveLength(22); // 4 + 18 schemas
    expect(cells[0]).toBe('eval_teste1');
    expect(cells[1]).toBe(formatDate(ANSWERED_AT));
    expect(cells[2]).toBe('short-v1');
    expect(cells[3]).toBe('3.75'); // totalMean formatado com ponto decimal
  });

  it('usa a ordem do schemasMeta, não a ordem de result.schemas', () => {
    const result = makeResult();
    expect(result.schemas[0].code).toBe('pu'); // score-desc: pu primeiro

    const row = buildCsv(result).split('\n')[1].split(';');
    const schemaValues = row.slice(4);

    expect(schemaValues).toHaveLength(18);
    expect(schemaValues.join(';')).toBe(
      META_CODES.map((_, i) => formatScore(1 + i * 0.25)).join(';')
    );
  });

  it('prefixa BOM \\uFEFF para Excel UTF-8', () => {
    expect(buildCsv(makeResult()).charCodeAt(0)).toBe(0xfeff);
  });

  it('não quebra com schemas vazio: emite apenas o cabeçalho', () => {
    const result = makeResult();
    result.schemas = [];
    expect(buildCsv(result)).toBe(EXPECTED_HEADER);
  });
});

describe('exportAsCsv', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('baixa CSV inline via Blob/anchor com filename e mime corretos', async () => {
    const result = makeResult();
    const clicked = vi.fn();
    let captured: Blob | null = null;

    const fakeAnchor: Record<string, unknown> = { href: '', download: '' };
    fakeAnchor.click = () => clicked(String(fakeAnchor.href), String(fakeAnchor.download));

    vi.stubGlobal('URL', {
      createObjectURL: (blob: Blob) => {
        captured = blob;
        return 'blob:fake-url';
      },
      revokeObjectURL: vi.fn()
    });
    vi.stubGlobal('document', {
      body: { appendChild: vi.fn(), removeChild: vi.fn() },
      createElement: vi.fn(() => fakeAnchor)
    });

    exportAsCsv(result);

    expect(clicked).toHaveBeenCalledWith('blob:fake-url', 'quiz-young-eval_teste1.csv');
    expect(captured).not.toBeNull();
    expect(captured!.type).toBe('text/csv;charset=utf-8');
    // Blob.text() decodifica UTF-8 e consome o BOM inicial; o restante deve
    // bater com buildCsv (prova que o BOM está presente no conteúdo do blob).
    await expect(captured!.text()).resolves.toBe(buildCsv(result).slice(1));
  });
});
