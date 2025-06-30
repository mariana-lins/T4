/**
 * ROTEADOR - CENTRO DE CONTROLE DO SISTEMA WB
 * ==========================================
 * 
 * Gerencia estado centralizado e navegação entre telas.
 * Convertido para componente funcional com hooks.
 * Utiliza useState e useCallback para controle de estado e ciclo de vida.
 */

import { useState, useCallback, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import BarraNavegacao from './BarraNavegacao';
import Home from './Home';
import Cadastros from './Cadastros';
import Listagens from './Listagens';
import RegistroConsumo from './RegistroConsumo';
import Relatorios from './Relatorios';
import { temaPrincipal } from '../tema';
import { Empresa } from '../modelo';
import { PopuladorDados } from '../dados/PopuladorDados';
import { useClientes } from '../hooks/useClientes';
import type { TelasDisponiveis } from '../tipos';

export default function Roteador() {
  // Estado usando hooks
  const [tela, setTela] = useState<TelasDisponiveis>('Home');
  const [empresa] = useState<Empresa>(() => {
    // Inicializa empresa com dados de teste usando lazy initial state
    const empresaInicial = new Empresa();
    PopuladorDados.popularDados(empresaInicial);
    return empresaInicial;
  });

  // Hook para gerenciar clientes via API
  const {
    clientes,
    loading: loadingClientes,
    error: errorClientes,
    carregarClientes,
    adicionarCliente,
    atualizarCliente,
    excluirCliente,
    limparErro
  } = useClientes();

  // Funções de controle usando useCallback para otimização
  const atualizarInterface = useCallback(() => {
    // Força re-render e recarrega dados da API
    carregarClientes();
    console.log('Interface atualizada - dados recarregados da API');
  }, [carregarClientes]);

  const selecionarView = useCallback((novaTela: string, evento?: React.MouseEvent) => {
    if (evento) {
      evento.preventDefault();
    }
    console.log('Navegando para:', novaTela);
    setTela(novaTela as TelasDisponiveis);
  }, []);

  // Carregar clientes da API na inicialização
  useEffect(() => {
    console.log('🚀 Carregando clientes da API na inicialização...');
    carregarClientes();
  }, [carregarClientes]);

  // Função para renderizar conteúdo baseado na tela atual
  const renderizarConteudo = () => {
    switch (tela) {
      case 'Home':
        return <Home 
          clientes={clientes}
          produtos={empresa.getProdutos}
          servicos={empresa.getServicos}
        />;
      case 'Cadastros':
        return <Cadastros 
          empresa={empresa}
          atualizarInterface={atualizarInterface}
          clientesAPI={{
            adicionarCliente,
            loading: loadingClientes,
            error: errorClientes,
            limparErro
          }}
        />;
      case 'Listagens':
        return <Listagens 
          empresa={empresa}
          atualizarInterface={atualizarInterface}
          clientesAPI={{
            clientes,
            excluirCliente,
            atualizarCliente,
            loading: loadingClientes,
            error: errorClientes,
            limparErro
          }}
        />;
      case 'Consumo':
        return <RegistroConsumo 
          empresa={empresa}
          atualizarInterface={atualizarInterface}
        />;
      case 'Relatórios':
        return <Relatorios 
          empresa={empresa}
        />;
      default:
        return <Home 
          clientes={clientes}
          produtos={empresa.getProdutos}
          servicos={empresa.getServicos}
        />;
    }
  };

  const botoes = ['Home', 'Cadastros', 'Listagens', 'Consumo', 'Relatórios'];

  return (
    <ThemeProvider theme={temaPrincipal}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <BarraNavegacao 
          seletorView={selecionarView} 
          botoes={botoes} 
        />
        <Box component="main">
          {renderizarConteudo()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
