# Rúnaleysir
(Rune-loosener / Secret-unraveler): A compound name using rúna (secret/rune) and a form of leysa (to loosen/solve). This directly translates to the core function of the software.

## AI-Powered Historical Cipher Analysis Desktop Application

Rúnaleysir is an Electron-based desktop application that uses multiple specialized AI models to analyze and decrypt historical ciphers. It leverages the power of 9 different free AI models from OpenRouter, each specialized for different aspects of cipher analysis.

![Architecture](https://img.shields.io/badge/Electron-28.x-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![License](https://img.shields.io/badge/License-See%20LICENSE-yellow)

## Features

### 🔍 Multi-Model AI Analysis
- **Pattern Recognition**: Gemini Flash 2.0 analyzes cipher structure and frequency
- **Deep Reasoning**: Qwen3 235B generates and tests hypotheses
- **Code Generation**: Qwen Coder 32B creates custom analysis tools
- **Historical Research**: Tongyi DeepResearch provides context
- **Vision Analysis**: Nemotron Vision handles image-based ciphers
- **Fast Reasoning**: DeepSeek R1 for rapid hypothesis testing
- **Workflow Orchestration**: Hermes 3 405B coordinates the analysis
- **Mathematical Analysis**: Qwen3 14B for number-based ciphers

### 🎯 Key Capabilities
- Analyze text-based ciphers of various types
- Load cipher text from files
- Get historical context and background research
- Generate custom analysis code
- Save analysis results as JSON
- Track API usage and model statistics
- Configure which AI models to use

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai))

### Installation

```bash
# Clone the repository
git clone https://github.com/jamesellette/Runaleysir.git
cd Runaleysir

# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && pip install -r requirements.txt && cd ..

# Run the application
npm run dev
```

The application will:
1. Start the Python backend API
2. Launch the React development server
3. Open the Electron desktop app

On first launch, you'll be prompted to enter your OpenRouter API key.

## Usage

1. **Enter Cipher Text**: Type or paste your cipher into the input area
2. **Add Context** (optional): Provide historical context or hints
3. **Analyze**: Click "Analyze Cipher" to start the multi-model analysis
4. **Review Results**: See detailed analysis from each AI model
5. **Save Results**: Export your analysis as JSON

See [TEST_CIPHERS.md](TEST_CIPHERS.md) for sample ciphers to try.

## Architecture

```
Rúnaleysir/
├── electron/              # Electron main process
│   ├── main.js           # App entry point & IPC handlers
│   ├── preload.js        # Secure API bridge
│   ├── models/           # AI model configuration
│   │   ├── config.js     # Model definitions
│   │   └── manager.js    # OpenRouter integration
│   └── analysis/         # Analysis engine
│       └── engine.js     # Multi-model workflow
├── frontend/             # React frontend
│   └── src/
│       ├── components/   # UI components
│       ├── pages/        # Main pages
│       └── App.js        # Root component
├── backend/              # Python FastAPI backend
│   └── api.py           # REST API server
└── build_sheet.md       # Development blueprint
```

## AI Models (All Free via OpenRouter)

| Model | Purpose | Strengths |
|-------|---------|-----------|
| Gemini Flash 2.0 | Pattern Analysis | Fast, large context (1M tokens) |
| Qwen3 235B | Deep Reasoning | Thinking mode, logical analysis |
| Qwen Coder 32B | Code Generation | Creates analysis tools |
| Hermes 3 405B | Orchestration | Workflow coordination |
| Tongyi Research | Historical Context | Research capabilities |
| Nemotron Vision | Image Analysis | OCR, symbol recognition |
| DeepSeek R1 | Fast Reasoning | Transparent thinking |
| Grok 4.1 Fast | Automation | Agentic workflows |
| Qwen3 14B | Math Analysis | Number patterns |

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development instructions.

### Building for Distribution

```bash
# Build all components
npm run build

# Create installers for all platforms
npm run dist-all
```

This creates distributable packages in the `dist/` folder.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

See [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [Material-UI](https://mui.com/)
- AI models from [OpenRouter](https://openrouter.ai/)
- Backend with [FastAPI](https://fastapi.tiangolo.com/)

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
