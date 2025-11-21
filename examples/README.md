# Rúnaleysir Examples

This directory contains example scripts and demonstrations of the Rúnaleysir cipher analysis engine.

## demo.js

A simple command-line demonstration of the multi-model cipher analysis pipeline.

### Usage

```bash
# Using command-line argument
node examples/demo.js YOUR_OPENROUTER_API_KEY

# Or using environment variable
export OPENROUTER_API_KEY=your_key_here
node examples/demo.js
```

### What it does

1. Analyzes a sample Caesar cipher
2. Uses all 5 analysis stages:
   - Initial pattern analysis (Gemini Flash 2.0)
   - Deep reasoning (Qwen3 235B)
   - Tool generation (Qwen Coder 32B)
   - Historical research (Tongyi DeepResearch)
   - Final synthesis (Hermes 3 405B)
3. Shows progress updates
4. Displays the final analysis
5. Reports usage statistics

### Expected Output

The demo will show:
- Progress through each analysis stage
- The models used for each stage
- The final synthesized analysis
- API usage statistics (calls and tokens)

For the sample Caesar cipher, the AI models should correctly identify it as a Caesar shift cipher and potentially determine the shift value.

## Adding More Examples

To add more examples:

1. Create a new `.js` file in this directory
2. Import the analysis engine: `const { CipherAnalysisEngine } = require('../electron/analysis/engine');`
3. Initialize with your API key
4. Call `analyzeCipher()` with your test cipher
5. Document your example in this README

## See Also

- [TEST_CIPHERS.md](../TEST_CIPHERS.md) - Sample ciphers to analyze
- [DEVELOPMENT.md](../DEVELOPMENT.md) - Development guide
- [build_sheet.md](../build_sheet.md) - Architecture blueprint
