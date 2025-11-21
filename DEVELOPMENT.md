# Rúnaleysir Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jamesellette/Runaleysir.git
cd Runaleysir
```

2. **Install root dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

5. **Configure API Key**
- Get a free API key from [OpenRouter](https://openrouter.ai)
- The application will prompt you to enter it on first run
- Or manually create a `.env` file (see `.env.example`)

### Running in Development Mode

**Option 1: Run all services together (recommended)**
```bash
npm run dev
```

This starts:
- Frontend React app (http://localhost:3000)
- Python backend API (http://localhost:8001)
- Electron desktop app

**Option 2: Run services separately**

Terminal 1 - Backend:
```bash
npm run backend-dev
```

Terminal 2 - Frontend:
```bash
npm run frontend-dev
```

Terminal 3 - Electron:
```bash
npm run electron-dev
```

### Building for Production

```bash
# Build frontend and backend
npm run build

# Create distributable packages for all platforms
npm run dist-all

# Or for specific platform
npm run dist
```

Distributables will be in the `dist/` folder.

## Project Structure

```
Runaleysir/
├── electron/           # Electron main process
│   ├── main.js        # App entry point
│   ├── preload.js     # IPC bridge
│   ├── models/        # AI model configuration
│   └── analysis/      # Analysis engine
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── public/
├── backend/           # Python FastAPI backend
│   └── api.py
└── package.json       # Root package file
```

## Features

- **Multi-Model AI Analysis**: Uses 9 specialized AI models for different aspects of cipher analysis
- **Pattern Recognition**: Gemini Flash 2.0 for initial pattern detection
- **Deep Reasoning**: Qwen3 235B for hypothesis generation
- **Code Generation**: Qwen Coder for creating analysis tools
- **Historical Research**: Tongyi DeepResearch for context
- **Vision Analysis**: Nemotron Vision for image-based ciphers
- **Fast Reasoning**: DeepSeek R1 for rapid analysis
- **Workflow Orchestration**: Hermes 3 405B and Grok 4.1

## AI Models Used

All models are accessed through OpenRouter and are **free to use**:

1. **Gemini Flash 2.0** - Pattern Analysis
2. **Qwen3 235B** - Deep Reasoning
3. **Qwen Coder 32B** - Tool Generation
4. **Hermes 3 405B** - Orchestration
5. **Tongyi Research 30B** - Historical Context
6. **Nemotron Vision 12B** - Image Analysis
7. **DeepSeek R1** - Fast Reasoning
8. **Grok 4.1 Fast** - Workflow Automation
9. **Qwen3 14B** - Mathematical Analysis

## Troubleshooting

**Electron app doesn't start:**
- Ensure all dependencies are installed
- Check that ports 3000 and 8001 are available

**API Key issues:**
- Verify your API key at [OpenRouter](https://openrouter.ai)
- Check the key is properly saved (Settings page)

**Build failures:**
- Run `npm install` in root and frontend directories
- Run `pip install -r requirements.txt` in backend directory
- Clear build caches: `rm -rf node_modules frontend/node_modules dist build`

## License

See LICENSE file for details.
