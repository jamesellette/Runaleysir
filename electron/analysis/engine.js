// electron/analysis/engine.js
const { ModelManager } = require('../models/manager');

class CipherAnalysisEngine {
  constructor(apiKey) {
    this.modelManager = new ModelManager(apiKey);
    this.analysisSteps = [
      { name: 'initial_analysis', task: 'pattern_analysis' },
      { name: 'deep_reasoning', task: 'deep_reasoning' },
      { name: 'tool_generation', task: 'code_generation' },
      { name: 'historical_research', task: 'historical_research' },
      { name: 'synthesis', task: 'workflow_coordination' }
    ];
  }

  async analyzeCipher(cipherText, context = '', progressCallback = null) {
    const results = {
      cipher_text: cipherText,
      context: context,
      timestamp: new Date().toISOString(),
      stages: [],
      final_analysis: null,
      models_used: []
    };

    try {
      for (let i = 0; i < this.analysisSteps.length; i++) {
        const step = this.analysisSteps[i];
        
        if (progressCallback) {
          progressCallback({
            stage: step.name,
            progress: (i / this.analysisSteps.length) * 100,
            message: `Running ${step.name} analysis...`
          });
        }

        const stageResult = await this.runAnalysisStage(step, cipherText, context, results);
        results.stages.push(stageResult);
        results.models_used.push(stageResult.model_used);
      }

      // Final synthesis
      if (progressCallback) {
        progressCallback({
          stage: 'synthesis',
          progress: 95,
          message: 'Synthesizing final results...'
        });
      }

      results.final_analysis = await this.synthesizeResults(results);

      if (progressCallback) {
        progressCallback({
          stage: 'complete',
          progress: 100,
          message: 'Analysis complete!'
        });
      }

      return results;

    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    }
  }

  async runAnalysisStage(step, cipherText, context, previousResults) {
    const prompt = this.buildPromptForStage(step, cipherText, context, previousResults);
    
    const response = await this.modelManager.callForTask(step.task, [
      { role: 'user', content: prompt }
    ], {
      temperature: step.name === 'deep_reasoning' ? 0.1 : 0.3,
      max_tokens: step.name === 'tool_generation' ? 8000 : 4000
    });

    return {
      stage: step.name,
      task: step.task,
      model_used: response.model_used,
      model_role: response.role,
      result: response.content,
      thinking_process: response.thinking_process,
      usage: response.usage,
      timestamp: new Date().toISOString()
    };
  }

  buildPromptForStage(step, cipherText, context, previousResults) {
    const previousAnalysis = previousResults.stages.map(stage => 
      `${stage.stage}: ${stage.result}`
    ).join('\n\n');

    const prompts = {
      initial_analysis: `
Analyze this cipher text for structural patterns and characteristics:

CIPHER TEXT: ${cipherText}
CONTEXT: ${context}

Please provide:
1. Character frequency analysis
2. Pattern identification (repetitions, spacing, structure)
3. Suspected cipher type classification
4. Language indicators
5. Notable structural features
6. Recommended analysis approaches

Format your response clearly with numbered sections.
`,

      deep_reasoning: `
Based on the initial analysis, perform deep logical reasoning about this cipher:

CIPHER TEXT: ${cipherText}
INITIAL ANALYSIS: ${previousAnalysis}

Think step by step through multiple possible solutions:
1. Evaluate each suspected cipher type
2. Test frequency analysis implications
3. Consider historical context and methods
4. Generate specific hypotheses
5. Reason through substitution patterns
6. Identify the most promising approaches

Use detailed logical reasoning for each possibility.
`,

      tool_generation: `
Create Python analysis tools based on the cipher analysis so far:

CIPHER TEXT: ${cipherText}
ANALYSIS SO FAR: ${previousAnalysis}

Generate complete Python code for:
1. Advanced frequency analysis
2. Pattern detection algorithms
3. Substitution testing functions
4. Visualization tools
5. Brute force testing where appropriate

Provide working, well-documented code that can be executed immediately.
`,

      historical_research: `
Research the historical context and background of this cipher:

CIPHER TEXT: ${cipherText}
CONTEXT: ${context}
TECHNICAL ANALYSIS: ${previousAnalysis}

Investigate:
1. Historical cipher methods from suspected time period
2. Similar known ciphers or cryptographic systems
3. Cultural/linguistic context
4. Potential origins or creators
5. Historical decryption techniques
6. Relevant cryptographic literature

Provide detailed historical context and references.
`,

      workflow_coordination: `
Synthesize all previous analysis into a coherent action plan:

CIPHER TEXT: ${cipherText}
ALL PREVIOUS ANALYSIS: ${previousAnalysis}

Coordinate the findings to:
1. Summarize key discoveries
2. Prioritize the most promising approaches
3. Create a step-by-step solving strategy
4. Identify gaps that need more analysis
5. Recommend next actions for the user
6. Provide confidence levels for different hypotheses

Present a clear, actionable plan for proceeding.
`
    };

    return prompts[step.name] || `Analyze this cipher: ${cipherText}`;
  }

  async synthesizeResults(results) {
    const allFindings = results.stages.map(stage => 
      `[${stage.model_role}] ${stage.result}`
    ).join('\n\n---\n\n');

    const synthesisPrompt = `
Create a comprehensive final analysis report from all AI model findings:

ORIGINAL CIPHER: ${results.cipher_text}

ALL MODEL ANALYSES:
${allFindings}

Synthesize into a final report with:
1. Executive Summary
2. Most Likely Solution(s)
3. Confidence Levels
4. Alternative Approaches
5. Recommended Next Steps
6. Technical Summary

Provide a clear, actionable conclusion for the user.
`;

    const synthesis = await this.modelManager.callForTask('workflow_coordination', [
      { role: 'user', content: synthesisPrompt }
    ]);

    return synthesis.content;
  }

  getUsageStatistics() {
    return this.modelManager.getUsageStats();
  }

  getAvailableModels() {
    return this.modelManager.getAvailableModels();
  }
}

module.exports = { CipherAnalysisEngine };
