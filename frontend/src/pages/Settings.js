import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Card, CardContent,
  Switch, FormControlLabel, Accordion, AccordionSummary,
  AccordionDetails, Chip, Button, Alert, Divider
} from '@mui/material';
import { ExpandMore, Refresh } from '@mui/icons-material';

function Settings() {
  const [models, setModels] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    loadModelConfiguration();
    loadUsageStats();
    loadApiKey();
  }, []);

  const loadModelConfiguration = async () => {
    if (!window.electronAPI) return;
    const config = await window.electronAPI.getModelConfiguration();
    setModels(config);
  };

  const loadUsageStats = async () => {
    if (!window.electronAPI) return;
    const stats = await window.electronAPI.getUsageStats();
    setUsageStats(stats);
  };

  const loadApiKey = async () => {
    if (!window.electronAPI) return;
    const key = await window.electronAPI.getApiKey();
    setApiKey(key);
  };

  const toggleModel = async (modelKey, enabled) => {
    if (!window.electronAPI) return;
    await window.electronAPI.updateModelSettings(modelKey, { enabled });
    setModels(prev => prev.map(model => 
      model.key === modelKey ? { ...model, enabled } : model
    ));
  };

  const handleDeleteApiKey = async () => {
    if (!window.electronAPI) return;
    if (window.confirm('Are you sure you want to delete your API key?')) {
      await window.electronAPI.deleteApiKey();
      setApiKey(null);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 20, marginBottom: 20 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper style={{ padding: 20, marginBottom: 20 }}>
        <Typography variant="h5" gutterBottom>
          API Configuration
        </Typography>
        
        {apiKey ? (
          <Box>
            <Alert severity="success" style={{ marginBottom: 16 }}>
              API Key is configured
            </Alert>
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleDeleteApiKey}
            >
              Delete API Key
            </Button>
          </Box>
        ) : (
          <Alert severity="warning">
            No API key configured. Click the key icon in the header to set one up.
          </Alert>
        )}
      </Paper>

      <Paper style={{ padding: 20, marginBottom: 20 }}>
        <Typography variant="h5" gutterBottom>
          AI Model Configuration
        </Typography>

        {usageStats && (
          <Alert severity="info" style={{ marginBottom: 20 }}>
            <strong>Usage Summary:</strong> {usageStats.total_calls} API calls, 
            {' '}{Math.round(usageStats.total_tokens / 1000)}K tokens used
          </Alert>
        )}

        {models.length === 0 && (
          <Typography color="textSecondary">
            Loading model configuration...
          </Typography>
        )}

        {models.map((model) => (
          <Accordion key={model.key} style={{ marginBottom: 12 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                <Box style={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    {model.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {model.role}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={model.enabled}
                      onChange={(e) => toggleModel(model.key, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  }
                  label={model.enabled ? "Enabled" : "Disabled"}
                  onClick={(e) => e.stopPropagation()}
                />
                <Chip 
                  label={model.cost_tier} 
                  color={model.cost_tier === 'free' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Typography paragraph>
                {model.description}
              </Typography>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Capabilities:
              </Typography>
              <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {model.capabilities.map((capability) => (
                  <Chip
                    key={capability}
                    label={capability.replace(/_/g, ' ')}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Primary Use:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {model.primary_use}
              </Typography>

              {usageStats?.models[model.id] && (
                <Box style={{ marginTop: 16 }}>
                  <Typography variant="subtitle2">Usage Statistics:</Typography>
                  <Typography variant="body2">
                    Calls: {usageStats.models[model.id].calls}, 
                    Tokens: {Math.round(usageStats.models[model.id].total_tokens / 1000)}K
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={loadUsageStats}
          style={{ marginTop: 16 }}
        >
          Refresh Usage Stats
        </Button>
      </Paper>

      <Paper style={{ padding: 20 }}>
        <Typography variant="h5" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Rúnaleysir</strong> (Rune-loosener / Secret-unraveler)
        </Typography>
        <Typography variant="body2" color="textSecondary">
          AI-powered historical cipher analysis tool
        </Typography>
      </Paper>
    </Container>
  );
}

export default Settings;
