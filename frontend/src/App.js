import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Header from './components/Header';
import CipherAnalyzer from './pages/CipherAnalyzer';
import ResultsHistory from './pages/ResultsHistory';
import Settings from './pages/Settings';
import ApiKeySetup from './components/ApiKeySetup';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  }
});

function App() {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.electronAPI) {
      const apiKey = await window.electronAPI.getApiKey();
      setHasApiKey(!!apiKey);
      if (!apiKey) {
        setApiKeyDialogOpen(true);
      }
    }
  };

  const handleApiKeySetup = (apiKey) => {
    setApiKeyDialogOpen(false);
    if (apiKey) {
      setHasApiKey(true);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Header onOpenApiKeyDialog={() => setApiKeyDialogOpen(true)} hasApiKey={hasApiKey} />
          <Routes>
            <Route path="/" element={<CipherAnalyzer />} />
            <Route path="/history" element={<ResultsHistory />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
      
      <ApiKeySetup 
        open={apiKeyDialogOpen} 
        onClose={handleApiKeySetup}
      />
    </ThemeProvider>
  );
}

export default App;
