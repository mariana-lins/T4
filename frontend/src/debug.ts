import { ClienteService } from './servicos/ClienteService';
import { verificarStatusAPI } from './utils/statusAPI';

// Função de debug para testar diretamente no browser
(window as any).debugWB = {
  async testarAPI() {
    console.log('Testando comunicação com API...');
    
    try {
      // Testa status da API
      const statusOK = await verificarStatusAPI();
      console.log(' Status da API:', statusOK ? 'Online' : 'Offline');
      
      if (statusOK) {
        // Testa listagem
        const clientes = await ClienteService.listarClientes();
        console.log('Clientes carregados:', clientes.length);
        console.log('Dados:', clientes);
        
        return clientes;
      }
    } catch (error) {
      console.error('Erro no teste:', error);
    }
  },
  
  async testarCadastro() {
    console.log('Testando cadastro...');
    
    try {
      const { Cliente, CPF } = await import('./modelo');
      
      const cpf = new CPF('123.456.789-00');
      const novoCliente = new Cliente('Teste Debug', 'Debug API', cpf, 'Masculino');
      
      const resultado = await ClienteService.cadastrarCliente(novoCliente);
      console.log('Cliente cadastrado:', resultado);
      
      return resultado;
    } catch (error) {
      console.error('Erro no cadastro:', error);
    }
  }
};

console.log('Debug WB carregado! Use window.debugWB.testarAPI() ou window.debugWB.testarCadastro() no console do browser');
