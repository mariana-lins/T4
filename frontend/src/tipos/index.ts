// Tipos principais do sistema WB - compatíveis com as classes do modelo
import type { Empresa, Cliente, Produto, Servico } from '../modelo';
import type { ClienteComID } from '../servicos/ClienteService';

// Tipos para integração com API
export interface ClientesAPI {
  clientes?: ClienteComID[];
  adicionarCliente?: (cliente: Cliente) => Promise<void>;
  atualizarCliente?: (clienteExistente: ClienteComID, novosDados: Cliente) => Promise<void>;
  excluirCliente?: (clienteExistente: ClienteComID) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  limparErro?: () => void;
}

// Tipos para componentes
export interface PropsComponente {
  // Interface base - sem tema pois usamos ThemeProvider global
}

export interface PropsBarraNavegacao extends PropsComponente {
  botoes: string[];
  seletorView: (novaTela: string, evento: React.MouseEvent) => void;
}

export interface PropsHome extends PropsComponente {
  clientes?: Cliente[];
  produtos?: Produto[];
  servicos?: Servico[];
}

export interface PropsComEmpresa extends PropsComponente {
  empresa: Empresa;
  atualizarInterface?: () => void;
  clientesAPI?: ClientesAPI;
}

export type TelasDisponiveis = 'Home' | 'Cadastros' | 'Listagens' | 'Consumo' | 'Relatórios';
