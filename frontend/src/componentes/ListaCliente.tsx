import { useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import type { PropsComponente } from '../tipos';
import type { Cliente as ClienteModelo } from '../modelo';

interface PropsListaCliente extends PropsComponente {
  clientes?: ClienteModelo[];
}

export default function ListaCliente({ clientes = [] }: PropsListaCliente) {
  const gerarListaClientes = useCallback(() => {
    return clientes.map((cliente, index) => (
      <Card 
        key={index} 
        sx={{ mb: 2 }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2">
                  {cliente.nome} ({cliente.nomeSocial})
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                CPF: {cliente.getCpf.getValor}
              </Typography>
              
              {cliente.getTelefones.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Telefone: {cliente.getTelefones[0].getCompleto}
                </Typography>
              )}
              
              <Typography variant="body2" color="text.secondary">
                Gênero: {cliente.genero}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    ));
  }, [clientes]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, color: 'primary.main' }}>
        Lista de Clientes
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Total de clientes: {clientes.length}
      </Typography>

      {clientes.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nenhum cliente cadastrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Clique em "Cadastros" para adicionar o primeiro cliente.
          </Typography>
        </Card>
      ) : (
        <Box>
          {gerarListaClientes()}
        </Box>
      )}
    </Box>
  );
}
