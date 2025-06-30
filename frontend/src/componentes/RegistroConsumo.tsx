import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import type { PropsComEmpresa } from '../tipos';

interface StateRegistroConsumo {
  clienteSelecionado: number;
  tipoConsumo: 'produto' | 'servico';
  itemSelecionado: number;
  mensagem: string;
  tipoMensagem: 'success' | 'error' | 'info';
}

export default function RegistroConsumo({ empresa, atualizarInterface }: PropsComEmpresa) {
  const [state, setState] = useState<StateRegistroConsumo>({
    clienteSelecionado: -1,
    tipoConsumo: 'produto',
    itemSelecionado: -1,
    mensagem: '',
    tipoMensagem: 'info',
  });

  const handleInputChange = useCallback((field: string, value: any) => {
    setState(prev => ({
      ...prev,
      [field]: value,
      mensagem: ''
    }));
  }, []);

  const validarFormulario = useCallback((): boolean => {
    const { clienteSelecionado, itemSelecionado } = state;

    if (clienteSelecionado === -1) {
      setState(prev => ({
        ...prev,
        mensagem: 'Selecione um cliente',
        tipoMensagem: 'error'
      }));
      return false;
    }

    if (itemSelecionado === -1) {
      setState(prev => ({
        ...prev,
        mensagem: 'Selecione um produto ou serviço',
        tipoMensagem: 'error'
      }));
      return false;
    }

    return true;
  }, [state]);

  const registrarConsumo = useCallback(() => {
    if (!validarFormulario()) {
      return;
    }

    try {
      const { clienteSelecionado, tipoConsumo, itemSelecionado } = state;
      const clientes = empresa.getClientes;
      const cliente = clientes[clienteSelecionado];

      if (tipoConsumo === 'produto') {
        const produtos = empresa.getProdutos;
        const produto = produtos[itemSelecionado];
        cliente.adicionarProdutoConsumido(produto);
      } else {
        const servicos = empresa.getServicos;
        const servico = servicos[itemSelecionado];
        cliente.adicionarServicoConsumido(servico);
      }

      if (atualizarInterface) {
        atualizarInterface();
      }

      setState(prev => ({
        ...prev,
        mensagem: 'Consumo registrado com sucesso!',
        tipoMensagem: 'success',
        clienteSelecionado: -1,
        itemSelecionado: -1,
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        mensagem: 'Erro ao registrar consumo.',
        tipoMensagem: 'error'
      }));
    }
  }, [state, validarFormulario, empresa, atualizarInterface]);

  const { clienteSelecionado, tipoConsumo, itemSelecionado, mensagem, tipoMensagem } = state;
  const clientes = empresa.getClientes;
  const produtos = empresa.getProdutos;
  const servicos = empresa.getServicos;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Registro de Consumo
      </Typography>

      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ p: 3 }}>
          {mensagem && (
            <Alert severity={tipoMensagem} sx={{ mb: 3 }}>
              {mensagem}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={clienteSelecionado}
                onChange={(e) => handleInputChange('clienteSelecionado', e.target.value)}
              >
                <MenuItem value={-1}>Selecione um cliente</MenuItem>
                {clientes.map((cliente, index) => (
                  <MenuItem key={index} value={index}>
                    {cliente.nome} - {cliente.nomeSocial}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Tipo de Consumo</InputLabel>
              <Select
                value={tipoConsumo}
                onChange={(e) => handleInputChange('tipoConsumo', e.target.value)}
              >
                <MenuItem value="produto">Produto</MenuItem>
                <MenuItem value="servico">Serviço</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>
                {tipoConsumo === 'produto' ? 'Produto' : 'Serviço'}
              </InputLabel>
              <Select
                value={itemSelecionado}
                onChange={(e) => handleInputChange('itemSelecionado', e.target.value)}
              >
                <MenuItem value={-1}>
                  Selecione um {tipoConsumo === 'produto' ? 'produto' : 'serviço'}
                </MenuItem>
                {(tipoConsumo === 'produto' ? produtos : servicos).map((item, index) => (
                  <MenuItem key={index} value={index}>
                    {item.nome} - R$ {item.preco.toFixed(2).replace('.', ',')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button 
              onClick={registrarConsumo}
              variant="contained" 
              fullWidth
              size="large"
            >
              Registrar Consumo
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Informações adicionais */}
      <Card sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Como usar:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            1. Selecione o cliente que realizou o consumo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            2. Escolha o tipo de consumo (Produto ou Serviço)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            3. Selecione o item consumido
          </Typography>
          <Typography variant="body2" color="text.secondary">
            4. Clique em "Registrar Consumo"
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            O consumo ficará associado ao cliente e será considerado nos relatórios.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
