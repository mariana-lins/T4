import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import type { PropsComEmpresa } from '../tipos';

export default function Relatorios({ empresa }: PropsComEmpresa) {
  const [tabAtiva, setTabAtiva] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 900);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabAtiva(newValue);
  }, []);

  const handleSelectChange = useCallback((event: any) => {
    setTabAtiva(event.target.value);
  }, []);

  const getClientesQueMaisConsumiram = useCallback(() => {
    const clientes = empresa.getClientes;
    
    return clientes.map(cliente => ({
      nome: cliente.nome,
      nomeSocial: cliente.nomeSocial,
      totalItens: cliente.getProdutosConsumidos.length + cliente.getServicosConsumidos.length,
      valorTotal: [
        ...cliente.getProdutosConsumidos,
        ...cliente.getServicosConsumidos
      ].reduce((total, item) => total + item.preco, 0)
    }))
    .sort((a, b) => b.totalItens - a.totalItens)
    .slice(0, 10);
  }, [empresa]);

  const getProdutosMaisConsumidos = useCallback(() => {
    const clientes = empresa.getClientes;
    const produtos = empresa.getProdutos;
    
    const consumoPorProduto = new Map();
    
    // Inicializar contadores
    produtos.forEach(produto => {
      consumoPorProduto.set(produto.nome, {
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 0,
        receita: 0
      });
    });
    
    // Contar consumos
    clientes.forEach(cliente => {
      cliente.getProdutosConsumidos.forEach(produto => {
        const dados = consumoPorProduto.get(produto.nome);
        if (dados) {
          dados.quantidade++;
          dados.receita += produto.preco;
        }
      });
    });
    
    return Array.from(consumoPorProduto.values())
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }, [empresa]);

  const getServicosMaisConsumidos = useCallback(() => {
    const clientes = empresa.getClientes;
    const servicos = empresa.getServicos;
    
    const consumoPorServico = new Map();
    
    // Inicializar contadores
    servicos.forEach(servico => {
      consumoPorServico.set(servico.nome, {
        nome: servico.nome,
        preco: servico.preco,
        quantidade: 0,
        receita: 0
      });
    });
    
    // Contar consumos
    clientes.forEach(cliente => {
      cliente.getServicosConsumidos.forEach(servico => {
        const dados = consumoPorServico.get(servico.nome);
        if (dados) {
          dados.quantidade++;
          dados.receita += servico.preco;
        }
      });
    });
    
    return Array.from(consumoPorServico.values())
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }, [empresa]);

  const getClientesPorGenero = useCallback(() => {
    const clientes = empresa.getClientes;
    
    const contadores = {
      'M': 0,
      'F': 0,
      'O': 0
    };
    
    clientes.forEach(cliente => {
      const genero = cliente.genero;
      if (genero in contadores) {
        contadores[genero as keyof typeof contadores]++;
      }
    });
    
    const total = clientes.length;
    
    return [
      {
        genero: 'Masculino',
        quantidade: contadores.M,
        percentual: total > 0 ? (contadores.M / total * 100).toFixed(1) : '0.0'
      },
      {
        genero: 'Feminino',
        quantidade: contadores.F,
        percentual: total > 0 ? (contadores.F / total * 100).toFixed(1) : '0.0'
      },
      {
        genero: 'Outro',
        quantidade: contadores.O,
        percentual: total > 0 ? (contadores.O / total * 100).toFixed(1) : '0.0'
      }
    ];
  }, [empresa]);

  const renderTabela = useCallback((dados: any[], colunas: any[], titulo: string) => {
    return (
      <Card sx={{ mt: 2 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {titulo}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {colunas.map((coluna, index) => (
                    <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                      {coluna.titulo}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={colunas.length} align="center">
                      Nenhum dado disponível
                    </TableCell>
                  </TableRow>
                ) : (
                  dados.map((item, index) => (
                    <TableRow key={index}>
                      {colunas.map((coluna, colIndex) => (
                        <TableCell key={colIndex}>
                          {coluna.formato ? coluna.formato(item[coluna.campo]) : item[coluna.campo]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    );
  }, []);

  const renderizarClientesQueMaisConsumiram = useCallback(() => {
    const dados = getClientesQueMaisConsumiram();
    const colunas = [
      { titulo: 'Posição', campo: 'posicao', formato: (_: any, index: number) => index + 1 },
      { titulo: 'Nome', campo: 'nome' },
      { titulo: 'Nome Social', campo: 'nomeSocial' },
      { titulo: 'Total de Itens', campo: 'totalItens' },
      { titulo: 'Valor Total', campo: 'valorTotal', formato: (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}` }
    ];
    
    return renderTabela(dados, colunas, 'Top 10 Clientes que Mais Consumiram');
  }, [getClientesQueMaisConsumiram, renderTabela]);

  const renderizarProdutosMaisConsumidos = useCallback(() => {
    const dados = getProdutosMaisConsumidos();
    const colunas = [
      { titulo: 'Posição', campo: 'posicao', formato: (_: any, index: number) => index + 1 },
      { titulo: 'Produto', campo: 'nome' },
      { titulo: 'Preço Unit.', campo: 'preco', formato: (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}` },
      { titulo: 'Quantidade Vendida', campo: 'quantidade' },
      { titulo: 'Receita Total', campo: 'receita', formato: (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}` }
    ];
    
    return renderTabela(dados, colunas, 'Top 10 Produtos Mais Consumidos');
  }, [getProdutosMaisConsumidos, renderTabela]);

  const renderizarServicosMaisConsumidos = useCallback(() => {
    const dados = getServicosMaisConsumidos();
    const colunas = [
      { titulo: 'Posição', campo: 'posicao', formato: (_: any, index: number) => index + 1 },
      { titulo: 'Serviço', campo: 'nome' },
      { titulo: 'Preço Unit.', campo: 'preco', formato: (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}` },
      { titulo: 'Quantidade Realizada', campo: 'quantidade' },
      { titulo: 'Receita Total', campo: 'receita', formato: (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}` }
    ];
    
    return renderTabela(dados, colunas, 'Top 10 Serviços Mais Consumidos');
  }, [getServicosMaisConsumidos, renderTabela]);

  const renderizarClientesPorGenero = useCallback(() => {
    const dados = getClientesPorGenero();
    const colunas = [
      { titulo: 'Gênero', campo: 'genero' },
      { titulo: 'Quantidade', campo: 'quantidade' },
      { titulo: 'Percentual', campo: 'percentual', formato: (valor: string) => `${valor}%` }
    ];
    
    return renderTabela(dados, colunas, 'Distribuição de Clientes por Gênero');
  }, [getClientesPorGenero, renderTabela]);

  const renderizarConteudo = useCallback(() => {
    switch (tabAtiva) {
      case 0:
        return renderizarClientesQueMaisConsumiram();
      case 1:
        return renderizarProdutosMaisConsumidos();
      case 2:
        return renderizarServicosMaisConsumidos();
      case 3:
        return renderizarClientesPorGenero();
      default:
        return renderizarClientesQueMaisConsumiram();
    }
  }, [tabAtiva, renderizarClientesQueMaisConsumiram, renderizarProdutosMaisConsumidos, renderizarServicosMaisConsumidos, renderizarClientesPorGenero]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Relatórios
      </Typography>

      {/* Seletor mobile */}
      {isMobile ? (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Selecione o Relatório</InputLabel>
          <Select value={tabAtiva} onChange={handleSelectChange}>
            <MenuItem value={0}>Clientes que Mais Consumiram</MenuItem>
            <MenuItem value={1}>Produtos Mais Consumidos</MenuItem>
            <MenuItem value={2}>Serviços Mais Consumidos</MenuItem>
            <MenuItem value={3}>Clientes por Gênero</MenuItem>
          </Select>
        </FormControl>
      ) : (
        // Tabs para desktop
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabAtiva} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              label="Clientes que Mais Consumiram"
              icon={<TrendingUpIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Produtos Mais Consumidos"
              icon={<ShoppingCartIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Serviços Mais Consumidos"
              icon={<ContentCutIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Clientes por Gênero"
              icon={<PersonIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      )}

      {renderizarConteudo()}

      {/* Informações adicionais */}
      <Card sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Sobre os Relatórios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • <strong>Clientes que Mais Consumiram:</strong> Lista os clientes ordenados pela quantidade total de produtos e serviços consumidos.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • <strong>Produtos/Serviços Mais Consumidos:</strong> Mostra os itens mais populares com quantidade vendida e receita gerada.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • <strong>Clientes por Gênero:</strong> Apresenta a distribuição demográfica da base de clientes.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Os dados são atualizados automaticamente conforme novos consumos são registrados no sistema.
        </Typography>
      </Card>
    </Box>
  );
}
