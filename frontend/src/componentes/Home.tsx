import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import type { PropsHome } from '../tipos';

export default function Home({ clientes = [], produtos = [], servicos = [] }: PropsHome) {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, color: 'primary.main' }}>
        Sistema WB 
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Bem-vindo ao sistema de gerenciamento do Grupo World Beauty
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" component="h2">
              Clientes
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {clientes.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <ShoppingCartIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" component="h2">
              Produtos
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {produtos.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <ContentCutIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" component="h2">
              Serviços
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {servicos.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Navegação
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Use a barra de navegação acima para acessar as diferentes funcionalidades:
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">• <strong>Home:</strong> Visão geral do sistema e estatísticas</Typography>
            <Typography variant="body2">• <strong>Cadastros:</strong> Cadastrar novos clientes, produtos e serviços</Typography>
            <Typography variant="body2">• <strong>Listagens:</strong> Visualizar, editar e excluir clientes, produtos e serviços</Typography>
            <Typography variant="body2">• <strong>Consumo:</strong> Registrar consumo de produtos/serviços pelos clientes</Typography>
            <Typography variant="body2">• <strong>Relatórios:</strong> Clientes que mais consumiram, produtos/serviços mais consumidos, etc.</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
