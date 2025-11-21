// electron/main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let pythonBackend;

// Start Python backend server
function startBackend() {
  const pythonPath = isDev 
    ? 'python' 
    : path.join(process.resourcesPath, 'backend', 'api.exe');
    
  pythonBackend = spawn(pythonPath, ['backend/api.py'], {
    cwd: __dirname
  });
  
  pythonBackend.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });
  
  pythonBackend.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets', 'icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load frontend
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../frontend/build/index.html')}`;
    
  mainWindow.loadURL(startUrl);
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  if (!isDev) {
    startBackend();
    setTimeout(createWindow, 2000); // Wait for backend to start
  } else {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (pythonBackend) pythonBackend.kill();
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for secure communication
ipcMain.handle('select-cipher-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'cipher'] },
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePaths[0]) {
    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    return { filePath, content };
  }
  
  return null;
});

ipcMain.handle('save-analysis-result', async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: `cipher-analysis-${Date.now()}.json`,
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });
  
  if (!result.canceled) {
    fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2));
    return { success: true, path: result.filePath };
  }
  
  return { success: false };
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('show-about', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'About Runaleysir',
    message: 'Runaleysir',
    detail: `Version: ${app.getVersion()}\n\nAI-powered historical cipher analysis tool`
  });
});

// API Key management
const Store = require('electron-store');
const store = new Store();

ipcMain.handle('save-api-key', async (event, apiKey) => {
  store.set('openrouter_api_key', apiKey);
  return { success: true };
});

ipcMain.handle('get-api-key', async () => {
  return store.get('openrouter_api_key');
});

ipcMain.handle('delete-api-key', async () => {
  store.delete('openrouter_api_key');
  return { success: true };
});

// Model configuration management
ipcMain.handle('get-model-configuration', async () => {
  const { AI_MODELS } = require('./models/config');
  const savedSettings = store.get('model_settings', {});
  
  return Object.entries(AI_MODELS).map(([key, model]) => ({
    key,
    ...model,
    enabled: savedSettings[key]?.enabled !== false // Default to enabled
  }));
});

ipcMain.handle('update-model-settings', async (event, modelKey, settings) => {
  const currentSettings = store.get('model_settings', {});
  currentSettings[modelKey] = { ...currentSettings[modelKey], ...settings };
  store.set('model_settings', currentSettings);
  return { success: true };
});

ipcMain.handle('get-usage-stats', async () => {
  return store.get('usage_stats', {
    models: {},
    total_calls: 0,
    total_tokens: 0
  });
});

ipcMain.handle('update-usage-stats', async (event, stats) => {
  store.set('usage_stats', stats);
  return { success: true };
});
