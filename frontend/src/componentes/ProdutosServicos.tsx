import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import type { PropsComponente } from '../tipos';
import type { Produto as ProdutoModelo, Servico as ServicoModelo } from '../modelo';

interface PropsProdutosServicos extends PropsComponente {
  produtos?: ProdutoModelo[];
  servicos?: ServicoModelo[];
}

export default function ProdutosServicos({ produtos = [], servicos = [] }: PropsProdutosServicos) {
  const [tabAtiva, setTabAtiva] = useState(0);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabAtiva(newValue);
  }, []);

  const renderizarProdutos = useCallback(() => {
    if (produtos.length === 0) {
      return (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum produto cadastrado
          </Typography>
        </Card>
      );
    }

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
        {produtos.map((produto, index) => (
          <Card key={index}>
            <CardContent>
              <Typography variant="h6" component="h3">
                {produto.nome}
              </Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                R$ {produto.preco.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }, [produtos]);

  const renderizarServicos = useCallback(() => {
    if (servicos.length === 0) {
      return (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum serviço cadastrado
          </Typography>
        </Card>
      );
    }

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
        {servicos.map((servico, index) => (
          <Card key={index}>
            <CardContent>
              <Typography variant="h6" component="h3">
                {servico.nome}
              </Typography>
              <Typography variant="h5" color="secondary" sx={{ fontWeight: 'bold', mt: 1 }}>
                R$ {servico.preco.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }, [servicos]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Produtos & Serviços
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabAtiva} onChange={handleTabChange}>
          <Tab 
            label={`Produtos (${produtos.length})`}
            icon={<ShoppingCartIcon />}
            iconPosition="start"
          />
          <Tab 
            label={`Serviços (${servicos.length})`}
            icon={<ContentCutIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {tabAtiva === 0 ? renderizarProdutos() : renderizarServicos()}
    </Box>
  );
}
