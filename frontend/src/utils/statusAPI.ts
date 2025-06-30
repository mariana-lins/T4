/**
 * Utilidades para verificar o status da API
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Configuração base da API
const API_BASE_URL = API_CONFIG.baseURL;

/**
 * Verifica se a API está online
 */
export async function verificarStatusAPI(): Promise<boolean> {
  try {
    await axios.get(`${API_BASE_URL}/clientes`, {
      timeout: 3000, // 3 segundos de timeout
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      }
    });
    return true;
  } catch (error) {
    console.warn('API offline:', error);
    return false;
  }
}

/**
 * Alias para verificarStatusAPI (compatibilidade)
 */
export const checkAPIStatus = verificarStatusAPI;

/**
 * Obtém o status detalhado da API
 */
export async function obterStatusDetalhado(): Promise<{
  online: boolean;
  tempoResposta: number;
  erro?: string;
}> {
  const inicio = Date.now();
  
  try {
    await axios.get(`${API_BASE_URL}/clientes`, {
      timeout: 5000,
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      }
    });
    
    const tempoResposta = Date.now() - inicio;
    return {
      online: true,
      tempoResposta
    };
  } catch (error) {
    const tempoResposta = Date.now() - inicio;
    return {
      online: false,
      tempoResposta,
      erro: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}
