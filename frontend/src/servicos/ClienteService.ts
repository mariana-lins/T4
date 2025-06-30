import axios from 'axios';
import { Cliente, CPF, RG, Telefone } from '../modelo';
import { API_CONFIG } from '../config/api';

// Configuração base da API
const API_BASE_URL = API_CONFIG.baseURL;

// Interface para o formato de dados que a API espera/retorna
interface ClienteAPI {
  id?: number;
  nome: string;
  sobreNome: string;
  email?: string | null;
  endereco?: {
    id: number;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    codigoPostal: string;
    informacoesAdicionais: string;
  };
  telefones: Array<{
    id: number;
    ddd: string;
    numero: string;
  }>;
  links?: Array<any>;
}

// Interface estendida do Cliente para incluir ID
export interface ClienteComID extends Cliente {
  id?: number;
}

export class ClienteService {
  
  /**
   * Busca todos os clientes da API
   */
  static async listarClientes(): Promise<ClienteComID[]> {
    try {
      const response = await axios.get<ClienteAPI[]>(`${API_BASE_URL}/clientes`, {
        headers: {
          'Accept': 'application/json; charset=utf-8'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Aceita 2xx e 3xx (incluindo 302)
        }
      });
      return response.data.map(clienteAPI => this.converterAPIParaModelo(clienteAPI));
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw new Error('Erro ao buscar clientes do servidor');
    }
  }

  /**
   * Busca um cliente específico por ID
   */
  static async buscarClientePorId(id: number): Promise<ClienteComID> {
    try {
      const response = await axios.get<ClienteAPI>(`${API_BASE_URL}/cliente/${id}`, {
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
      return this.converterAPIParaModelo(response.data);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw new Error('Erro ao buscar cliente do servidor');
    }
  }

  /**
   * Cadastra um novo cliente na API
   */
  static async cadastrarCliente(cliente: Cliente): Promise<ClienteComID> {
    try {
      const clienteAPI = this.converterModeloParaAPI(cliente);
      const response = await axios.post<ClienteAPI>(`${API_BASE_URL}/cliente/cadastrar`, clienteAPI, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
      
      console.log('Resposta do cadastro:', response.status, response.data);
      
      // Se o backend retornar vazio (status 200/201), considera como sucesso
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log('Backend retornou resposta vazia, considerando como sucesso');
        const clienteComId = this.converterAPIParaModelo({
          ...clienteAPI,
          id: Date.now(), // ID temporário até a próxima listagem
          endereco: {
            ...clienteAPI.endereco,
            id: Date.now() + 1 // ID temporário para o endereço
          },
          telefones: clienteAPI.telefones.map((t, index) => ({ 
            id: index + 1, 
            ...t 
          }))
        });
        return clienteComId;
      }
      
      return this.converterAPIParaModelo(response.data);
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      throw new Error('Erro ao cadastrar cliente no servidor');
    }
  }

  /**
   * Atualiza um cliente existente na API
   */
  static async atualizarCliente(id: number, cliente: Cliente): Promise<ClienteComID> {
    try {
      const clienteAPI = this.converterModeloParaAPI(cliente);
      // Adiciona o ID no objeto para atualização
      (clienteAPI as any).id = id;
      
      const response = await axios.put<ClienteAPI>(`${API_BASE_URL}/cliente/atualizar`, clienteAPI, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
      
      console.log('Resposta da atualização:', response.status, response.data);
      
      // Se o backend retornar vazio (status 200), considera como sucesso
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log('Backend retornou resposta vazia na atualização, considerando como sucesso');
        const clienteComId = this.converterAPIParaModelo({
          ...clienteAPI,
          id: id,
          endereco: {
            ...clienteAPI.endereco,
            id: Date.now() + 1
          },
          telefones: clienteAPI.telefones.map((t, index) => ({ 
            id: index + 1, 
            ...t 
          }))
        });
        return clienteComId;
      }
      
      return this.converterAPIParaModelo(response.data);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw new Error('Erro ao atualizar cliente no servidor');
    }
  }

  /**
   * Exclui um cliente da API
   */
  static async excluirCliente(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/cliente/excluir`, {
        data: { id },
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw new Error('Erro ao excluir cliente do servidor');
    }
  }

  /**
   * Converte dados da API para o modelo do front-end
   */
  private static converterAPIParaModelo(clienteAPI: ClienteAPI): ClienteComID {
    // Cria um CPF fictício já que a API não tem CPF
    const cpf = new CPF('000.000.000-00');
    
    // Usa sobreNome como nomeSocial e nome completo como nome
    const cliente = new Cliente(
      clienteAPI.nome,
      clienteAPI.sobreNome || clienteAPI.nome,
      cpf,
      'Não informado' // genero padrão
    ) as ClienteComID;

    // Adiciona o ID da API
    cliente.id = clienteAPI.id;

    // Adiciona um RG fictício
    const rg = new RG('00.000.000-0');
    cliente.adicionarRG(rg);

    // Adiciona telefones
    clienteAPI.telefones.forEach(telefoneAPI => {
      const telefone = new Telefone(telefoneAPI.ddd, telefoneAPI.numero);
      cliente.adicionarTelefone(telefone);
    });

    return cliente;
  }

  /**
   * Converte modelo do front-end para formato da API
   */
  private static converterModeloParaAPI(cliente: Cliente): {
    nome: string;
    sobreNome: string;
    email: null;
    endereco: {
      estado: string;
      cidade: string;
      bairro: string;
      rua: string;
      numero: string;
      codigoPostal: string;
      informacoesAdicionais: string;
    };
    telefones: Array<{
      ddd: string;
      numero: string;
    }>;
  } {
    return {
      nome: cliente.nome,
      sobreNome: cliente.nomeSocial,
      email: null,
      endereco: {
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Centro',
        rua: 'Rua Padrão',
        numero: '123',
        codigoPostal: '01000-000',
        informacoesAdicionais: ''
      },
      telefones: cliente.getTelefones.map(telefone => ({
        ddd: telefone.getDdd,
        numero: telefone.getNumero
      }))
    };
  }
}
