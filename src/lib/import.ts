import { QuizResult } from '../types';
import { saveEvaluation } from './storage';

/**
 * Importa um resultado de avaliação a partir de um arquivo JSON
 */
export function importEvaluation(file: File): Promise<QuizResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        
        // Validar estrutura
        if (!data.result || !data.result.schemas || !data.result.domains) {
          throw new Error('Formato de arquivo inválido');
        }
        
        const result = data.result as QuizResult;
        
        // Salvar no histórico
        saveEvaluation(result);
        
        resolve(result);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsText(file);
  });
}
