import { useState, useEffect, useCallback } from 'react';
import { Cliente } from '../modelo';
import { ClienteService, type ClienteComID } from '../servicos/ClienteService';

interface UseClientesReturn {
  clientes: ClienteComID[];
  loading: boolean;
  error: string | null;
  carregarClientes: () => Promise<void>;
  adicionarCliente: (cliente: Cliente) => Promise<void>;
  atualizarCliente: (clienteExistente: ClienteComID, novosDados: Cliente) => Promise<void>;
  excluirCliente: (clienteExistente: ClienteComID) => Promise<void>;
  limparErro: () => void;
}

export function useClientes(): UseClientesReturn {
  const [clientes, setClientes] = useState<ClienteComID[]>([]);
  const [loading, setLoading] = useState(true); // Inicia como true para mostrar carregando
  const [error, setError] = useState<string | null>(null);

  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  const carregarClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const clientesAPI = await ClienteService.listarClientes();
      setClientes(clientesAPI);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarCliente = useCallback(async (cliente: Cliente) => {
    setLoading(true);
    setError(null);
    
    try {
      const novoCliente = await ClienteService.cadastrarCliente(cliente);
      setClientes(prev => [...prev, novoCliente]);
      setError(null); 
      
      // Recarrega a lista para garantir sincronização com o backend
      setTimeout(() => {
        carregarClientes();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao adicionar cliente');
      throw err; 
    } finally {
      setLoading(false);
    }
  }, [carregarClientes]);

  const atualizarCliente = useCallback(async (clienteExistente: ClienteComID, novosDados: Cliente) => {
    if (!clienteExistente.id) {
      throw new Error('Cliente não possui ID para atualização');
    }

    setLoading(true);
    setError(null);
    
    try {
      const clienteAtualizado = await ClienteService.atualizarCliente(clienteExistente.id, novosDados);
      setClientes(prev => 
        prev.map(c => 
          c.id === clienteExistente.id ? clienteAtualizado : c
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao atualizar cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const excluirCliente = useCallback(async (clienteExistente: ClienteComID) => {
    if (!clienteExistente.id) {
      throw new Error('Cliente não possui ID para exclusão');
    }

    setLoading(true);
    setError(null);
    
    try {
      await ClienteService.excluirCliente(clienteExistente.id);
      setClientes(prev => prev.filter(c => c.id !== clienteExistente.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao excluir cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega os clientes automaticamente quando o hook é inicializado
  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  return {
    clientes,
    loading,
    error,
    carregarClientes,
    adicionarCliente,
    atualizarCliente,
    excluirCliente,
    limparErro
  };
}
