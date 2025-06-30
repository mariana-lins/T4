import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import type { PropsComEmpresa } from '../tipos';
import FormularioCadastroCliente from './FormularioCadastroCliente';
import FormularioCadastroProduto from './FormularioCadastroProduto';
import FormularioCadastroServico from './FormularioCadastroServico';

export default function Cadastros({ empresa, atualizarInterface, clientesAPI }: PropsComEmpresa) {
  const [tabAtiva, setTabAtiva] = useState(0);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabAtiva(newValue);
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Cadastros
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabAtiva} onChange={handleTabChange}>
          <Tab 
            label="Clientes"
            icon={<PersonAddIcon />}
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

      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ p: 3 }}>
          {tabAtiva === 0 && (
            <FormularioCadastroCliente 
              empresa={empresa}
              atualizarInterface={atualizarInterface}
              clientesAPI={clientesAPI}
            />
          )}
          {tabAtiva === 1 && (
            <FormularioCadastroProduto 
              empresa={empresa}
              atualizarInterface={atualizarInterface}
            />
          )}
          {tabAtiva === 2 && (
            <FormularioCadastroServico 
              empresa={empresa}
              atualizarInterface={atualizarInterface}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
