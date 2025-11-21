#!/usr/bin/env node

/**
 * Simple demo of the CipherAnalysisEngine
 * This demonstrates how the multi-model analysis works
 * 
 * Usage: node examples/demo.js [API_KEY]
 */

const { CipherAnalysisEngine } = require('../electron/analysis/engine');

// Sample cipher (Caesar shift of 3)
const SAMPLE_CIPHER = "Wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj";
const SAMPLE_CONTEXT = "This appears to be a simple substitution cipher";

async function runDemo(apiKey) {
  console.log('='.repeat(60));
  console.log('Rúnaleysir - Cipher Analysis Demo');
  console.log('='.repeat(60));
  console.log();
  
  console.log('Cipher Text:');
  console.log(SAMPLE_CIPHER);
  console.log();
  console.log('Context:', SAMPLE_CONTEXT);
  console.log();
  
  console.log('Initializing analysis engine...');
  const engine = new CipherAnalysisEngine(apiKey);
  
  console.log('Starting multi-model analysis...');
  console.log();
  
  try {
    const result = await engine.analyzeCipher(
      SAMPLE_CIPHER,
      SAMPLE_CONTEXT,
      (progress) => {
        console.log(`[${Math.round(progress.progress)}%] ${progress.message}`);
      }
    );
    
    console.log();
    console.log('='.repeat(60));
    console.log('Analysis Complete!');
    console.log('='.repeat(60));
    console.log();
    
    console.log('Models Used:', result.models_used.join(', '));
    console.log();
    
    console.log('FINAL ANALYSIS:');
    console.log('-'.repeat(60));
    console.log(result.final_analysis);
    console.log();
    
    console.log('='.repeat(60));
    console.log('Usage Statistics:');
    const stats = engine.getUsageStatistics();
    console.log(`Total API Calls: ${stats.total_calls}`);
    console.log(`Total Tokens: ${stats.total_tokens}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Analysis failed:', error.message);
    process.exit(1);
  }
}

// Get API key from command line or environment
const apiKey = process.argv[2] || process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('Error: OpenRouter API key required');
  console.error('Usage: node examples/demo.js YOUR_API_KEY');
  console.error('Or set OPENROUTER_API_KEY environment variable');
  process.exit(1);
}

runDemo(apiKey).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
