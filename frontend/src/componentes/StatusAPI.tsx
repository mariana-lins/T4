import { Box, Chip, Tooltip, CircularProgress } from '@mui/material';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState } from 'react';
import { verificarStatusAPI } from '../utils/statusAPI';

interface StatusAPIProps {
  conectado: boolean;
  loading?: boolean;
  erro?: string | null;
  tentarReconectar?: () => void;
}

export default function StatusAPI({ conectado, loading = false, erro, tentarReconectar }: StatusAPIProps) {
  const [testando, setTestando] = useState(false);

  const handleTentarReconectar = async () => {
    if (testando) return;
    
    setTestando(true);
    try {
      const statusOnline = await verificarStatusAPI();
      if (statusOnline && tentarReconectar) {
        tentarReconectar();
      }
    } catch (error) {
      console.warn('Falha no teste de reconexão:', error);
    } finally {
      setTestando(false);
    }
  };

  const getStatusIcon = () => {
    if (loading || testando) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={16} />
          <Chip 
            label={testando ? "Testando conexão..." : "Conectando..."} 
            color="primary" 
            variant="outlined" 
            size="small" 
          />
        </Box>
      );
    }
    
    if (conectado) {
      return (
        <Tooltip title="Conectado à API">
          <Chip 
            icon={<CloudDoneIcon />} 
            label="API Online" 
            color="success" 
            variant="outlined" 
            size="small"
          />
        </Tooltip>
      );
    }
    
    return (
      <Tooltip title={erro || "Desconectado da API - clique para tentar reconectar"}>
        <Chip 
          icon={<CloudOffIcon />} 
          label="API Offline" 
          color="warning" 
          variant="outlined" 
          size="small"
          onClick={handleTentarReconectar}
          clickable={true}
          deleteIcon={<RefreshIcon />}
          onDelete={handleTentarReconectar}
        />
      </Tooltip>
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {getStatusIcon()}
    </Box>
  );
}
