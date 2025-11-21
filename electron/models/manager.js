// electron/models/manager.js
const { AI_MODELS } = require('./config');

class ModelManager {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.models = AI_MODELS;
    this.usageStats = {};
  }

  // Select the best model for a specific task
  selectModelForTask(task) {
    const taskModelMap = {
      'pattern_analysis': 'pattern_analyzer',
      'frequency_analysis': 'pattern_analyzer', 
      'initial_classification': 'pattern_analyzer',
      
      'deep_reasoning': 'deep_reasoner',
      'hypothesis_generation': 'deep_reasoner',
      'logical_analysis': 'deep_reasoner',
      
      'code_generation': 'code_generator',
      'tool_creation': 'code_generator',
      'script_writing': 'code_generator',
      
      'workflow_coordination': 'orchestrator',
      'user_interaction': 'orchestrator',
      'result_synthesis': 'orchestrator',
      
      'historical_research': 'researcher',
      'context_analysis': 'researcher',
      'background_research': 'researcher',
      
      'image_analysis': 'vision_analyzer',
      'ocr': 'vision_analyzer',
      'symbol_recognition': 'vision_analyzer',
      
      'fast_reasoning': 'fast_reasoner',
      'quick_analysis': 'fast_reasoner',
      
      'mathematical_analysis': 'mathematical_analyzer',
      'number_patterns': 'mathematical_analyzer',
      
      'workflow_automation': 'agentic_coordinator',
      'process_orchestration': 'agentic_coordinator'
    };

    const modelKey = taskModelMap[task] || 'pattern_analyzer';
    return this.models[modelKey];
  }

  // Call a specific model
  async callModel(modelKey, messages, options = {}) {
    const model = this.models[modelKey];
    if (!model) {
      throw new Error(`Model ${modelKey} not found`);
    }

    const requestBody = {
      model: model.id,
      messages: messages,
      temperature: options.temperature || 0.3,
      max_tokens: options.max_tokens || 4000,
      ...options
    };

    // Add thinking mode for supported models
    if (model.thinking_mode && options.enable_thinking !== false) {
      requestBody.extra_body = { reasoning_enabled: true };
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Runaleysir'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // Track usage
      this.trackUsage(model.id, data.usage);
      
      return {
        content: data.choices[0].message.content,
        model_used: model.name,
        role: model.role,
        thinking_process: data.choices[0].message.reasoning || null,
        usage: data.usage
      };

    } catch (error) {
      console.error(`Error calling ${model.name}:`, error);
      throw error;
    }
  }

  // Call model by task type (convenience method)
  async callForTask(task, messages, options = {}) {
    const model = this.selectModelForTask(task);
    const modelKey = Object.keys(this.models).find(key => 
      this.models[key].id === model.id
    );
    return this.callModel(modelKey, messages, options);
  }

  // Track API usage
  trackUsage(modelId, usage) {
    if (!this.usageStats[modelId]) {
      this.usageStats[modelId] = {
        calls: 0,
        total_tokens: 0,
        prompt_tokens: 0,
        completion_tokens: 0
      };
    }

    const stats = this.usageStats[modelId];
    stats.calls += 1;
    if (usage) {
      stats.total_tokens += usage.total_tokens || 0;
      stats.prompt_tokens += usage.prompt_tokens || 0;
      stats.completion_tokens += usage.completion_tokens || 0;
    }
  }

  // Get usage statistics
  getUsageStats() {
    return {
      models: this.usageStats,
      total_calls: Object.values(this.usageStats).reduce((sum, stats) => sum + stats.calls, 0),
      total_tokens: Object.values(this.usageStats).reduce((sum, stats) => sum + stats.total_tokens, 0)
    };
  }

  // Get available models with their roles
  getAvailableModels() {
    return Object.entries(this.models).map(([key, model]) => ({
      key,
      ...model,
      status: 'available'  // Could check API status here
    }));
  }
}

module.exports = { ModelManager };
