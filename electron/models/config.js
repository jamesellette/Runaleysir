// electron/models/config.js
const AI_MODELS = {
  // Primary Analysis Models
  pattern_analyzer: {
    id: "google/gemini-2.0-flash-experimental",
    name: "Gemini Flash 2.0",
    role: "Initial cipher analysis and pattern recognition",
    description: "Analyzes cipher structure, frequency patterns, and provides initial classification",
    capabilities: ["pattern_detection", "frequency_analysis", "cipher_classification"],
    context_limit: 1048576, // ~1M tokens
    cost_tier: "free",
    primary_use: "First-stage analysis of cipher text for structural patterns"
  },

  deep_reasoner: {
    id: "qwen/qwen3-235b-a22b",
    name: "Qwen3 235B (Thinking Mode)",
    role: "Complex logical reasoning and hypothesis generation",
    description: "Deep analytical reasoning with step-by-step thought process for cipher solving",
    capabilities: ["logical_reasoning", "hypothesis_generation", "step_by_step_analysis"],
    context_limit: 41000,
    cost_tier: "free",
    thinking_mode: true,
    primary_use: "Generate and test multiple cipher-breaking hypotheses with detailed reasoning"
  },

  code_generator: {
    id: "qwen/qwen2.5-coder-32b-instruct",
    name: "Qwen2.5 Coder 32B",
    role: "Analysis tool and script generation",
    description: "Generates custom Python scripts for specific cipher analysis tasks",
    capabilities: ["code_generation", "tool_creation", "script_optimization"],
    context_limit: 32768,
    cost_tier: "free",
    primary_use: "Create custom frequency analyzers, substitution testers, and visualization tools"
  },

  orchestrator: {
    id: "nousresearch/hermes-3-405b-instruct",
    name: "Hermes 3 405B",
    role: "Workflow coordination and user interaction",
    description: "Manages multi-model analysis workflows and provides intelligent user guidance",
    capabilities: ["workflow_management", "user_interaction", "result_synthesis"],
    context_limit: 131072,
    cost_tier: "free",
    primary_use: "Coordinate analysis stages and provide coherent explanations to users"
  },

  researcher: {
    id: "alibaba/tongyi-deepresearch-30b-a3b",
    name: "Tongyi DeepResearch 30B",
    role: "Historical context and deep information gathering",
    description: "Researches historical cipher methods, cryptographic context, and background information",
    capabilities: ["historical_research", "context_analysis", "background_investigation"],
    context_limit: 131072,
    cost_tier: "free",
    primary_use: "Provide historical context and research cipher origins/methods"
  },

  vision_analyzer: {
    id: "nvidia/nemotron-nano-12b-2-vl",
    name: "Nemotron Nano 12B Vision",
    role: "Image analysis and symbol recognition",
    description: "Analyzes cipher images, performs OCR, and recognizes symbolic patterns",
    capabilities: ["image_analysis", "ocr", "symbol_recognition"],
    context_limit: 131072,
    cost_tier: "free",
    primary_use: "Process scanned documents, handwritten ciphers, and symbolic content"
  },

  // Specialized Models for Specific Tasks
  fast_reasoner: {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
    role: "Fast reasoning with transparent thought process",
    description: "Quick logical analysis with visible reasoning steps",
    capabilities: ["fast_reasoning", "transparent_thinking", "logic_chains"],
    context_limit: 164000,
    cost_tier: "free",
    primary_use: "Rapid hypothesis testing with clear reasoning trails"
  },

  agentic_coordinator: {
    id: "x-ai/grok-4.1-fast",
    name: "Grok 4.1 Fast",
    role: "Agentic tool calling and process automation",
    description: "Manages complex multi-step cipher analysis workflows",
    capabilities: ["tool_calling", "process_automation", "workflow_orchestration"],
    context_limit: 2000000,
    cost_tier: "free",
    primary_use: "Automate complex analysis pipelines and coordinate multiple tools"
  },

  mathematical_analyzer: {
    id: "qwen/qwen3-14b",
    name: "Qwen3 14B",
    role: "Mathematical and numerical cipher analysis",
    description: "Specialized in mathematical ciphers, number patterns, and algebraic analysis",
    capabilities: ["mathematical_analysis", "number_theory", "algebraic_solving"],
    context_limit: 41000,
    cost_tier: "free",
    thinking_mode: true,
    primary_use: "Analyze mathematical ciphers, number sequences, and algebraic patterns"
  }
};

module.exports = { AI_MODELS };
