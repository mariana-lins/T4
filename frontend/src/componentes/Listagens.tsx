import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { PropsComEmpresa } from '../tipos';
import { Cliente, CPF, RG, Telefone, Produto, Servico } from '../modelo';

interface StateListagens {
  tabAtiva: number;
  modalEdicaoAberto: boolean;
  modalExclusaoAberto: boolean;
  tipoModal: 'cliente' | 'produto' | 'servico' | null;
  itemSelecionado: any;
  indexSelecionado: number;
  // Campos do formulário de edição
  nome: string;
  nomeSocial: string;
  cpf: string;
  rg: string;
  telefone: string;
  genero: string;
  preco: string;
  mensagem: string;
  tipoMensagem: 'success' | 'error' | 'info';
}

export default function Listagens({ empresa, atualizarInterface, clientesAPI }: PropsComEmpresa) {
  const [state, setState] = useState<StateListagens>({
    tabAtiva: 0,
    modalEdicaoAberto: false,
    modalExclusaoAberto: false,
    tipoModal: null,
    itemSelecionado: null,
    indexSelecionado: -1,
    nome: '',
    nomeSocial: '',
    cpf: '',
    rg: '',
    telefone: '',
    genero: '',
    preco: '',
    mensagem: '',
    tipoMensagem: 'info',
  });

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setState(prev => ({ ...prev, tabAtiva: newValue }));
  }, []);

  const abrirModalEdicao = useCallback((tipo: 'cliente' | 'produto' | 'servico', item: any, index: number) => {
    if (tipo === 'cliente') {
      // Garantir valores padrão para campos simulados se estiverem vazios
      const cpfValor = item.getCpf?.getValor || '000.000.000-00';
      const rgValor = item.getRgs && item.getRgs.length > 0 ? item.getRgs[0].getValor : '00.000.000-0';
      const generoValor = item.genero || 'Não informado';
      const telefoneValor = item.getTelefones && item.getTelefones.length > 0 ? 
        `${item.getTelefones[0].getDdd}${item.getTelefones[0].getNumero}` : '';

      setState(prev => ({
        ...prev,
        modalEdicaoAberto: true,
        tipoModal: tipo,
        itemSelecionado: item,
        indexSelecionado: index,
        nome: item.nome || '',
        nomeSocial: item.nomeSocial || '',
        cpf: cpfValor,
        rg: rgValor,
        telefone: telefoneValor,
        genero: generoValor,
      }));
    } else {
      setState(prev => ({
        ...prev,
        modalEdicaoAberto: true,
        tipoModal: tipo,
        itemSelecionado: item,
        indexSelecionado: index,
        nome: item.nome,
        preco: item.preco.toString(),
      }));
    }
  }, []);

  const abrirModalExclusao = useCallback((tipo: 'cliente' | 'produto' | 'servico', item: any, index: number) => {
    setState(prev => ({
      ...prev,
      modalExclusaoAberto: true,
      tipoModal: tipo,
      itemSelecionado: item,
      indexSelecionado: index,
    }));
  }, []);

  const fecharModais = useCallback(() => {
    setState(prev => ({
      ...prev,
      modalEdicaoAberto: false,
      modalExclusaoAberto: false,
      tipoModal: null,
      itemSelecionado: null,
      indexSelecionado: -1,
      nome: '',
      nomeSocial: '',
      cpf: '',
      rg: '',
      telefone: '',
      genero: '',
      preco: '',
      mensagem: '',
    }));
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setState(prev => ({
      ...prev,
      [field]: value,
      mensagem: ''
    }));
  }, []);

  const salvarEdicao = useCallback(async () => {
    const { tipoModal, indexSelecionado, nome, nomeSocial, cpf, rg, telefone, genero, preco } = state;

    try {
      if (tipoModal === 'cliente') {
        // Validações básicas
        if (!nome.trim()) {
          setState(prev => ({
            ...prev,
            mensagem: 'Nome é obrigatório',
            tipoMensagem: 'error'
          }));
          return;
        }

        // Garantir valores válidos para campos simulados
        const cpfValor = cpf.trim() || '000.000.000-00';
        const rgValor = rg.trim() || '00.000.000-0';
        const generoValor = genero.trim() || 'Não informado';
        
        const novoCpf = new CPF(cpfValor);
        const novoRg = new RG(rgValor);
        
        const telefoneNumeros = telefone.replace(/\D/g, '');
        let ddd = '';
        let numeroTelefone = '';
        
        if (telefoneNumeros.length >= 10) {
          ddd = telefoneNumeros.substring(0, 2);
          numeroTelefone = telefoneNumeros.substring(2);
        } else if (telefoneNumeros.length > 0) {
          // Se o telefone for muito curto, usar valores padrão
          ddd = '11';
          numeroTelefone = telefoneNumeros.padEnd(8, '0');
        } else {
          // Telefone vazio, usar padrão
          ddd = '11';
          numeroTelefone = '00000000';
        }
        
        const novoTelefone = new Telefone(ddd, numeroTelefone);
        const clienteEditado = new Cliente(nome.trim(), nomeSocial.trim() || nome.trim(), novoCpf, generoValor);
        clienteEditado.adicionarRG(novoRg);
        clienteEditado.adicionarTelefone(novoTelefone);

        // Se é uma edição (indexSelecionado >= 0), atualiza no backend
        if (indexSelecionado >= 0 && clientesAPI?.atualizarCliente) {
          const listaClientes = clientesAPI.clientes || empresa.getClientes;
          const clienteExistente = listaClientes[indexSelecionado];
          
          if (clienteExistente) {
            try {
              // Tenta atualizar no backend
              await clientesAPI.atualizarCliente(clienteExistente, clienteEditado);
              
              setState(prev => ({
                ...prev,
                mensagem: 'Cliente atualizado com sucesso!',
                tipoMensagem: 'success'
              }));
              
            } catch (error) {
              console.warn('Erro ao atualizar no backend, atualizando apenas localmente:', error);
              
              // Se falhar no backend, atualiza apenas localmente
              const clientes = empresa.getClientes;
              if (clientes[indexSelecionado]) {
                clientes[indexSelecionado] = clienteEditado;
              }
              
              setState(prev => ({
                ...prev,
                mensagem: 'Cliente atualizado localmente (API temporariamente indisponível)',
                tipoMensagem: 'info'
              }));
            }
          }
        } 
        // Se é um novo cadastro (indexSelecionado === -1)
        else if (indexSelecionado === -1) {
          if (clientesAPI?.adicionarCliente) {
            try {
              await clientesAPI.adicionarCliente(clienteEditado);
              setState(prev => ({
                ...prev,
                mensagem: 'Cliente cadastrado com sucesso!',
                tipoMensagem: 'success'
              }));
            } catch (error) {
              console.warn('Erro ao cadastrar no backend, cadastrando apenas localmente:', error);
              empresa.getClientes.push(clienteEditado);
              setState(prev => ({
                ...prev,
                mensagem: 'Cliente cadastrado localmente (API temporariamente indisponível)',
                tipoMensagem: 'info'
              }));
            }
          } else {
            // Fallback para dados locais
            empresa.getClientes.push(clienteEditado);
            setState(prev => ({
              ...prev,
              mensagem: 'Cliente cadastrado localmente!',
              tipoMensagem: 'success'
            }));
          }
        }
        // Fallback para atualização local se não há API
        else {
          const clientes = empresa.getClientes;
          if (clientes[indexSelecionado]) {
            clientes[indexSelecionado] = clienteEditado;
            setState(prev => ({
              ...prev,
              mensagem: 'Cliente atualizado localmente!',
              tipoMensagem: 'success'
            }));
          }
        }

      } else if (tipoModal === 'produto') {
        const precoNumerico = parseFloat(preco.replace(',', '.'));
        if (isNaN(precoNumerico)) {
          setState(prev => ({
            ...prev,
            mensagem: 'Preço deve ser um número válido',
            tipoMensagem: 'error'
          }));
          return;
        }
        
        const produtoEditado = new Produto(nome.trim(), precoNumerico);
        const produtos = empresa.getProdutos;
        if (produtos[indexSelecionado]) {
          produtos[indexSelecionado] = produtoEditado;
        }
        
        setState(prev => ({
          ...prev,
          mensagem: 'Produto editado com sucesso!',
          tipoMensagem: 'success'
        }));

      } else if (tipoModal === 'servico') {
        const precoNumerico = parseFloat(preco.replace(',', '.'));
        if (isNaN(precoNumerico)) {
          setState(prev => ({
            ...prev,
            mensagem: 'Preço deve ser um número válido',
            tipoMensagem: 'error'
          }));
          return;
        }
        
        const servicoEditado = new Servico(nome.trim(), precoNumerico);
        const servicos = empresa.getServicos;
        if (servicos[indexSelecionado]) {
          servicos[indexSelecionado] = servicoEditado;
        }
        
        setState(prev => ({
          ...prev,
          mensagem: 'Serviço editado com sucesso!',
          tipoMensagem: 'success'
        }));
      }

      // Força atualização da interface
      if (atualizarInterface) {
        atualizarInterface();
      }

      // Fecha o modal após sucesso
      setTimeout(() => fecharModais(), 1500);

    } catch (error) {
      console.error('Erro ao salvar:', error);
      const acao = indexSelecionado === -1 ? 'cadastrar' : 'editar';
      const tipo = tipoModal || 'item';
      setState(prev => ({
        ...prev,
        mensagem: `Erro ao ${acao} ${tipo}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        tipoMensagem: 'error'
      }));
    }
  }, [state, empresa, atualizarInterface, fecharModais, clientesAPI]);

  const confirmarExclusao = useCallback(async () => {
    const { tipoModal, indexSelecionado } = state;

    try {
      if (tipoModal === 'cliente') {
        // Usa API se disponível
        if (clientesAPI?.excluirCliente) {
          const listaClientes = clientesAPI?.clientes || empresa.getClientes;
          const clienteParaExcluir = listaClientes[indexSelecionado];
          if (clienteParaExcluir) {
            await clientesAPI.excluirCliente(clienteParaExcluir);
          }
        } else {
          // Fallback para dados locais
          const clientes = empresa.getClientes;
          clientes.splice(indexSelecionado, 1);
        }
      } else if (tipoModal === 'produto') {
        const produtos = empresa.getProdutos;
        produtos.splice(indexSelecionado, 1);
      } else if (tipoModal === 'servico') {
        const servicos = empresa.getServicos;
        servicos.splice(indexSelecionado, 1);
      }

      if (atualizarInterface) {
        atualizarInterface();
      }

      fecharModais();

    } catch (error) {
      setState(prev => ({
        ...prev,
        mensagem: 'Erro ao excluir item.',
        tipoMensagem: 'error'
      }));
    }
  }, [state, empresa, atualizarInterface, fecharModais, clientesAPI]);

  const renderizarClientes = useCallback(() => {
    // Usa dados da API se disponível, senão usa dados locais
    const clientes = clientesAPI?.clientes || empresa.getClientes;
    const isLoading = clientesAPI?.loading || false;
    const hasError = clientesAPI?.error;

    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (hasError) {
      return (
        <Alert severity="error" sx={{ mt: 3 }}>
          {hasError}
          {clientesAPI?.limparErro && (
            <Button onClick={clientesAPI.limparErro} sx={{ ml: 2 }}>
              Tentar novamente
            </Button>
          )}
        </Alert>
      );
    }

    if (clientes.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
          Nenhum cliente cadastrado.
        </Typography>
      );
    }

    return (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        {clientes.map((cliente, index) => {
          // Garantir valores seguros para exibição
          const nomeExibicao = cliente.nome || 'Nome não informado';
          const nomeSocialExibicao = cliente.nomeSocial || cliente.nome || 'Nome social não informado';
          const cpfExibicao = cliente.getCpf?.getValor || '000.000.000-00';
          const rgExibicao = cliente.getRgs && cliente.getRgs.length > 0 ? cliente.getRgs[0].getValor : '00.000.000-0';
          const telefoneExibicao = cliente.getTelefones && cliente.getTelefones.length > 0 ? 
            `(${cliente.getTelefones[0].getDdd}) ${cliente.getTelefones[0].getNumero}` : '(00) 00000-0000';
          
          // Converter gênero para exibição amigável
          let generoExibicao = 'Não informado';
          if (cliente.genero) {
            const genero = cliente.genero.toLowerCase();
            if (genero === 'm' || genero === 'masculino') {
              generoExibicao = 'Masculino';
            } else if (genero === 'f' || genero === 'feminino') {
              generoExibicao = 'Feminino';
            } else if (genero !== 'não informado') {
              generoExibicao = cliente.genero;
            }
          }

          return (
            <Card key={(cliente as any).id || index}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6">{nomeExibicao}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nome Social: {nomeSocialExibicao}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      CPF: {cpfExibicao}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      RG: {rgExibicao}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Telefone: {telefoneExibicao}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gênero: {generoExibicao}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() => abrirModalEdicao('cliente', cliente, index)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => abrirModalExclusao('cliente', cliente, index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  }, [clientesAPI, empresa, abrirModalEdicao, abrirModalExclusao]);

  const renderizarProdutos = useCallback(() => {
    const produtos = empresa.getProdutos;

    if (produtos.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
          Nenhum produto cadastrado.
        </Typography>
      );
    }

    return (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        {produtos.map((produto, index) => (
          <Card key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">{produto.nome}</Typography>
                  <Typography variant="body1" color="primary">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => abrirModalEdicao('produto', produto, index)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => abrirModalExclusao('produto', produto, index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }, [empresa, abrirModalEdicao, abrirModalExclusao]);

  const renderizarServicos = useCallback(() => {
    const servicos = empresa.getServicos;

    if (servicos.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
          Nenhum serviço cadastrado.
        </Typography>
      );
    }

    return (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        {servicos.map((servico, index) => (
          <Card key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">{servico.nome}</Typography>
                  <Typography variant="body1" color="primary">
                    R$ {servico.preco.toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => abrirModalEdicao('servico', servico, index)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => abrirModalExclusao('servico', servico, index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }, [empresa, abrirModalEdicao, abrirModalExclusao]);

  const { 
    tabAtiva, 
    modalEdicaoAberto, 
    modalExclusaoAberto, 
    tipoModal,
    nome, 
    nomeSocial, 
    cpf, 
    rg, 
    telefone, 
    genero, 
    preco, 
    mensagem, 
    tipoMensagem 
  } = state;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Listagens
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabAtiva} onChange={handleTabChange}>
          <Tab 
            label="Clientes"
            icon={<PersonIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Produtos"
            icon={<ShoppingCartIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Serviços"
            icon={<ContentCutIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {tabAtiva === 0 && renderizarClientes()}
      {tabAtiva === 1 && renderizarProdutos()}
      {tabAtiva === 2 && renderizarServicos()}

      {/* Modal de Edição */}
      <Dialog open={modalEdicaoAberto} onClose={fecharModais} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editar {tipoModal === 'cliente' ? 'Cliente' : tipoModal === 'produto' ? 'Produto' : 'Serviço'}
        </DialogTitle>
        <DialogContent>
          {mensagem && (
            <Alert severity={tipoMensagem} sx={{ mb: 2 }}>
              {mensagem}
            </Alert>
          )}

          {tipoModal === 'cliente' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Nome"
                value={nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                fullWidth
              />
              <TextField
                label="Nome Social"
                value={nomeSocial}
                onChange={(e) => handleInputChange('nomeSocial', e.target.value)}
                fullWidth
              />
              <TextField
                label="CPF"
                value={cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                fullWidth
              />
              <TextField
                label="RG"
                value={rg}
                onChange={(e) => handleInputChange('rg', e.target.value)}
                fullWidth
              />
              <TextField
                label="Telefone"
                value={telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Gênero</InputLabel>
                <Select
                  value={genero}
                  onChange={(e) => handleInputChange('genero', e.target.value)}
                >
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Feminino</MenuItem>
                  <MenuItem value="O">Outro</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {(tipoModal === 'produto' || tipoModal === 'servico') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label={`Nome do ${tipoModal === 'produto' ? 'Produto' : 'Serviço'}`}
                value={nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                fullWidth
              />
              <TextField
                label="Preço"
                value={preco}
                onChange={(e) => handleInputChange('preco', e.target.value)}
                fullWidth
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModais}>
            Cancelar
          </Button>
          <Button onClick={salvarEdicao} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Exclusão */}
      <Dialog open={modalExclusaoAberto} onClose={fecharModais}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este {tipoModal}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModais}>
            Cancelar
          </Button>
          <Button onClick={confirmarExclusao} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
