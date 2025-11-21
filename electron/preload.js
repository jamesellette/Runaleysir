// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  selectCipherFile: () => ipcRenderer.invoke('select-cipher-file'),
  saveAnalysisResult: (data) => ipcRenderer.invoke('save-analysis-result', data),
  
  // Backend communication
  analyzeCipher: async (cipherData) => {
    try {
      const response = await fetch('http://localhost:8001/analyze/cipher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cipherData)
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },
  
  checkBackendHealth: async () => {
    try {
      const response = await fetch('http://localhost:8001/health');
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },
  
  // App controls
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  showAbout: () => ipcRenderer.invoke('show-about'),
  
  // API Key management
  saveApiKey: (apiKey) => ipcRenderer.invoke('save-api-key', apiKey),
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  deleteApiKey: () => ipcRenderer.invoke('delete-api-key'),
  
  // Model configuration
  getModelConfiguration: () => ipcRenderer.invoke('get-model-configuration'),
  updateModelSettings: (modelKey, settings) => ipcRenderer.invoke('update-model-settings', modelKey, settings),
  getUsageStats: () => ipcRenderer.invoke('get-usage-stats'),
  updateUsageStats: (stats) => ipcRenderer.invoke('update-usage-stats', stats)
});
