import React, { useState } from 'react';
import { 
  Container, Paper, TextField, Button,
  LinearProgress, Typography, Grid, Alert, Box, Card, CardContent,
  Snackbar
} from '@mui/material';
import { Send, FolderOpen, Save } from '@mui/icons-material';

function CipherAnalyzer() {
  const [cipherText, setCipherText] = useState('');
  const [historicalContext, setHistoricalContext] = useState('');
  const [analysis, setAnalysis] = useState({
    isAnalyzing: false,
    currentStage: '',
    progress: 0,
    results: null,
    error: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleAnalyze = async () => {
    if (!window.electronAPI) {
      setAnalysis({
        ...analysis,
        error: 'Electron API not available. Please run in Electron environment.'
      });
      return;
    }

    const apiKey = await window.electronAPI.getApiKey();
    if (!apiKey) {
      setAnalysis({
        ...analysis,
        error: 'Please configure your OpenRouter API key first (click the key icon in the header).'
      });
      return;
    }

    setAnalysis({ 
      isAnalyzing: true, 
      currentStage: 'Starting analysis...', 
      progress: 10, 
      results: null,
      error: null 
    });

    try {
      // Call backend API through electronAPI
      const result = await window.electronAPI.analyzeCipher({
        cipher_text: cipherText,
        historical_context: historicalContext,
        api_key: apiKey
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setAnalysis({
        isAnalyzing: false,
        currentStage: 'Complete',
        progress: 100,
        results: result,
        error: null
      });

    } catch (error) {
      setAnalysis({
        isAnalyzing: false,
        currentStage: '',
        progress: 0,
        results: null,
        error: `Analysis failed: ${error.message}`
      });
    }
  };

  const handleLoadFile = async () => {
    if (!window.electronAPI) return;
    
    const result = await window.electronAPI.selectCipherFile();
    if (result) {
      setCipherText(result.content);
    }
  };

  const handleSaveResults = async () => {
    if (!window.electronAPI || !analysis.results) return;
    
    const result = await window.electronAPI.saveAnalysisResult(analysis.results);
    if (result.success) {
      setSnackbar({
        open: true,
        message: `Results saved to: ${result.path}`,
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Failed to save results',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="xl" style={{ marginTop: 20, marginBottom: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h5" gutterBottom>
              Cipher Input
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={10}
              value={cipherText}
              onChange={(e) => setCipherText(e.target.value)}
              placeholder="Enter cipher text here..."
              style={{ marginBottom: 20 }}
              variant="outlined"
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              value={historicalContext}
              onChange={(e) => setHistoricalContext(e.target.value)}
              placeholder="Optional: Add historical context or additional information..."
              style={{ marginBottom: 20 }}
              variant="outlined"
              label="Historical Context"
            />
            
            <Box style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                startIcon={<Send />}
                onClick={handleAnalyze}
                disabled={!cipherText || analysis.isAnalyzing}
                size="large"
              >
                {analysis.isAnalyzing ? 'Analyzing...' : 'Analyze Cipher'}
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<FolderOpen />}
                onClick={handleLoadFile}
                disabled={analysis.isAnalyzing}
              >
                Load from File
              </Button>
              
              {analysis.results && (
                <Button 
                  variant="outlined" 
                  startIcon={<Save />}
                  onClick={handleSaveResults}
                  color="success"
                >
                  Save Results
                </Button>
              )}
            </Box>

            {analysis.isAnalyzing && (
              <Box style={{ marginTop: 20 }}>
                <Typography variant="body2" color="textSecondary">
                  {analysis.currentStage}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={analysis.progress} 
                  style={{ marginTop: 10 }}
                />
              </Box>
            )}

            {analysis.error && (
              <Alert severity="error" style={{ marginTop: 20 }}>
                {analysis.error}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {analysis.results ? (
            <Paper style={{ padding: 20 }}>
              <Typography variant="h5" gutterBottom>
                Analysis Results
              </Typography>
              
              <Card style={{ marginBottom: 16, backgroundColor: '#1e1e1e' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Final Analysis
                  </Typography>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {analysis.results.final_analysis}
                  </Typography>
                </CardContent>
              </Card>

              <Typography variant="h6" gutterBottom>
                Analysis Stages
              </Typography>
              
              {analysis.results.stages.map((stage, index) => (
                <Card key={index} style={{ marginBottom: 12, backgroundColor: '#1e1e1e' }}>
                  <CardContent>
                    <Typography variant="subtitle1" color="secondary" gutterBottom>
                      {stage.stage.replace(/_/g, ' ').toUpperCase()} - {stage.model_used}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      {stage.model_role}
                    </Typography>
                    <Typography variant="body2" style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
                      {stage.result.substring(0, 500)}
                      {stage.result.length > 500 && '...'}
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              <Typography variant="caption" color="textSecondary" display="block" style={{ marginTop: 16 }}>
                Models used: {analysis.results.models_used.join(', ')}
              </Typography>
            </Paper>
          ) : (
            <Paper style={{ padding: 20, textAlign: 'center', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No Analysis Yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Enter cipher text and click "Analyze Cipher" to begin
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CipherAnalyzer;
