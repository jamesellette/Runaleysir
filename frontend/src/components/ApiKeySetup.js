import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Alert, Box,
  FormControl, InputLabel, OutlinedInput,
  InputAdornment, IconButton, Chip
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle, Error } from '@mui/icons-material';

function ApiKeySetup({ open, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const validateApiKey = async (key) => {
    if (!key || key.length < 20) {
      return { valid: false, message: 'API key appears to be too short' };
    }

    setIsValidating(true);
    try {
      // Test the API key with a simple request
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Runaleysir'
        }
      });

      if (response.ok) {
        return { valid: true, message: 'API key is valid!' };
      } else {
        return { valid: false, message: 'Invalid API key or network error' };
      }
    } catch (error) {
      return { valid: false, message: 'Could not validate API key' };
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidate = async () => {
    const result = await validateApiKey(apiKey);
    setValidationResult(result);
  };

  const handleSave = async () => {
    if (validationResult?.valid && window.electronAPI) {
      // Save to electron store
      await window.electronAPI.saveApiKey(apiKey);
      onClose(apiKey);
    }
  };

  const handleSkip = () => {
    onClose(null);
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Setup OpenRouter API Key</Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
          Runaleysir uses AI models from OpenRouter to analyze ciphers. All models listed below are free to use.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box style={{ marginBottom: 24 }}>
          <Typography variant="h6" gutterBottom>
            Models We'll Use:
          </Typography>
          
          <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <Chip label="🔍 Gemini Flash 2.0 - Pattern Analysis" variant="outlined" />
            <Chip label="🧠 Qwen3 235B - Deep Reasoning" variant="outlined" />
            <Chip label="💻 Qwen Coder 32B - Tool Generation" variant="outlined" />
            <Chip label="🎯 Hermes 3 405B - Orchestration" variant="outlined" />
            <Chip label="📚 Tongyi Research - Historical Context" variant="outlined" />
            <Chip label="👁️ Nemotron Vision - Image Analysis" variant="outlined" />
            <Chip label="⚡ DeepSeek R1 - Fast Reasoning" variant="outlined" />
            <Chip label="🤖 Grok 4.1 - Workflow Automation" variant="outlined" />
          </Box>

          <Alert severity="info" style={{ marginBottom: 20 }}>
            <strong>Get your free API key:</strong>
            <br />1. Go to openrouter.ai (opens in your browser)
            <br />2. Sign up for an account
            <br />3. Navigate to "Keys" in your dashboard
            <br />4. Create a new API key
            <br />5. Paste it below
          </Alert>

          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="api-key-input">OpenRouter API Key</InputLabel>
            <OutlinedInput
              id="api-key-input"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowKey(!showKey)}
                    edge="end"
                  >
                    {showKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="OpenRouter API Key"
            />
          </FormControl>

          {validationResult && (
            <Alert 
              severity={validationResult.valid ? "success" : "error"}
              style={{ marginTop: 16 }}
              icon={validationResult.valid ? <CheckCircle /> : <Error />}
            >
              {validationResult.message}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions style={{ padding: '16px 24px' }}>
        <Button onClick={handleSkip} color="secondary">
          Skip for Now
        </Button>
        <Button 
          onClick={handleValidate}
          disabled={!apiKey || isValidating}
          color="primary"
        >
          {isValidating ? 'Validating...' : 'Test API Key'}
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!validationResult?.valid}
          variant="contained"
          color="primary"
        >
          Save & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApiKeySetup;
