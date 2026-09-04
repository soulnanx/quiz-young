import { QuizResult } from '../types';
import { jsPDF } from 'jspdf';
import { formatScore, formatDate, getLevelLabel } from '../lib/utils';
import { quizVersions } from '../data/questions';

// ============================================
// Exportação de Resultados
// ============================================

/**
 * Exporta resultado como JSON
 */
export function exportAsJson(result: QuizResult): void {
  const filename = `quiz-young-${result.id}.json`;
  const data = {
    metadata: {
      exportDate: new Date().toISOString(),
      application: 'Quiz de Young',
      version: '1.0.0'
    },
    result
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exporta resultado como PDF
 */
export function exportAsPdf(result: QuizResult): void {
  const doc = new jsPDF();
  const version = quizVersions[result.versionId];
  const date = formatDate(result.answeredAt);

  // Cabeçalho
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Questionário de Esquemas de Young', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${version?.name || result.versionId}`, 105, 30, { align: 'center' });
  doc.text(`Realizado em: ${date}`, 105, 38, { align: 'center' });

  // Score total
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Score Total: ${formatScore(result.totalMean)} / 6.00`, 20, 55);

  // Resultados por domínio
  let yPos = 70;
  doc.setFontSize(16);
  doc.text('Resultados por Domínio', 20, yPos);
  yPos += 10;

  result.domains.forEach(domain => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${domain.name}`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`Score: ${formatScore(domain.mean)}`, 150, yPos);
    yPos += 6;

    domain.schemas.forEach(schema => {
      doc.setFontSize(10);
      doc.text(`  • ${schema.name}`, 25, yPos);
      doc.text(`${formatScore(schema.mean)} (${getLevelLabel(schema.level)})`, 150, yPos);
      yPos += 5;
    });

    yPos += 3;

    // Quebrar página se necessário
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Resultados detalhados por schema
  doc.addPage();
  yPos = 20;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Resultados Detalhados por Esquema', 20, yPos);
  yPos += 10;

  result.schemas.forEach(schema => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${schema.name} (${schema.code.toUpperCase()})`, 20, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Score: ${formatScore(schema.mean)} / 6.00 - ${getLevelLabel(schema.level)}`, 20, yPos);
    yPos += 5;
    doc.text(`Domínio: ${schema.domain}`, 20, yPos);
    yPos += 5;
    doc.text(`Descrição: ${schema.description}`, 20, yPos);
    yPos += 5;

    // Respostas individuais
    doc.text('Respostas:', 20, yPos);
    yPos += 5;
    schema.items.forEach((itemId, idx) => {
      const value = schema.values[idx];
      doc.text(`  Questão ${itemId}: ${value}`, 25, yPos);
      yPos += 4;
    });

    yPos += 5;

    // Quebrar página se necessário
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Disclaimer
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Aviso Importante', 105, yPos, { align: 'center' });
  yPos += 15;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const disclaimer = [
    'Este relatório é gerado automaticamente e tem caráter informativo.',
    '',
    'Os resultados NÃO substituem uma avaliação profissional realizada',
    'por um psicólogo qualificado.',
    '',
    'A interpretação dos esquemas deve ser feita por um profissional de',
    'saúde mental, considerando o contexto clínico completo do paciente.',
    '',
    'Este documento não constitui diagnóstico médico ou psicológico.',
    '',
    'Para interpretação adequada dos resultados, consulte um psicólogo',
    'especializado em Terapia do Esquema.'
  ];

  disclaimer.forEach(line => {
    doc.text(line, 105, yPos, { align: 'center' });
    yPos += 6;
  });

  // Salvar PDF
  const filename = `quiz-young-${result.id}.pdf`;
  doc.save(filename);
}
