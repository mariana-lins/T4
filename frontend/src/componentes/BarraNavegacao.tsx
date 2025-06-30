import React, { useState, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import type { PropsBarraNavegacao } from '../tipos';

export default function BarraNavegacao({ botoes, seletorView }: PropsBarraNavegacao) {
  const [drawerAberto, setDrawerAberto] = useState(false);

  const toggleDrawer = useCallback(() => {
    setDrawerAberto(prev => !prev);
  }, []);

  const gerarBotoes = useCallback(() => {
    return botoes.map((botao) => (
      <Button
        key={botao}
        color="inherit"
        onClick={(e) => seletorView(botao, e)}
        sx={{ 
          ml: 2,
          fontWeight: 500,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        {botao}
      </Button>
    ));
  }, [botoes, seletorView]);

  const gerarListaDrawer = useCallback(() => {
    return botoes.map((botao) => (
      <ListItem 
        key={botao}
        onClick={(e) => {
          seletorView(botao, e);
          toggleDrawer();
        }}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(156, 39, 176, 0.1)',
          }
        }}
      >
        <ListItemText primary={botao} />
      </ListItem>
    ));
  }, [botoes, seletorView, toggleDrawer]);

  return (
    <ResponsiveNavigation
      drawerAberto={drawerAberto}
      toggleDrawer={toggleDrawer}
      gerarBotoes={gerarBotoes}
      gerarListaDrawer={gerarListaDrawer}
    />
  );
}

interface ResponsiveNavigationProps {
  drawerAberto: boolean;
  toggleDrawer: () => void;
  gerarBotoes: () => React.ReactNode[];
  gerarListaDrawer: () => React.ReactNode[];
}

function ResponsiveNavigation({ 
  drawerAberto, 
  toggleDrawer, 
  gerarBotoes, 
  gerarListaDrawer 
}: ResponsiveNavigationProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            World Beauty
          </Typography>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex' }}>
              {gerarBotoes()}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerAberto}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: 250 }
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Menu
          </Typography>
          <List>
            {gerarListaDrawer()}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
