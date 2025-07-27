export interface Message {
  conversationId: string
  content: string
  type: 'USER' | 'ASSISTANT'
  timestamp: Date
}

export interface ModelConfig {
  model: string
  temperature: number
  topP: number
  windowContextSize: number
  maxTokens: number
  systemPrompt: string,
  knowledgeId: number,
  tools: Array<string>
}

export interface ModelRequest extends ModelConfig{
  prompt: string
}

