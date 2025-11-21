import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip
} from '@mui/material';
import { Home, History, Settings, VpnKey } from '@mui/icons-material';

function Header({ onOpenApiKeyDialog, hasApiKey }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Rúnaleysir
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            startIcon={<Home />}
            onClick={() => navigate('/')}
            variant={location.pathname === '/' ? 'outlined' : 'text'}
          >
            Analyzer
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<History />}
            onClick={() => navigate('/history')}
            variant={location.pathname === '/history' ? 'outlined' : 'text'}
          >
            History
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<Settings />}
            onClick={() => navigate('/settings')}
            variant={location.pathname === '/settings' ? 'outlined' : 'text'}
          >
            Settings
          </Button>
          
          <Tooltip title={hasApiKey ? "API Key Configured" : "Configure API Key"}>
            <IconButton 
              color={hasApiKey ? "success" : "error"}
              onClick={onOpenApiKeyDialog}
            >
              <VpnKey />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
