import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: number
}

export interface Session {
  id: string
  name: string
  messages: Message[]
}

export interface ModelConfig {
  model: string
  temperature: number
  topP: number
  maxTokens: number
  knowledgeBase: string
  mcpEnabled: boolean
}

export const useChatStore = defineStore('chat', () => {
  const sessions = ref<Session[]>([])
  const currentSessionId = ref<string>('')
  const modelConfig = ref<ModelConfig>({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 50,
    knowledgeBase: '',
    mcpEnabled: false
  })

  const currentSession = computed(() => 
    sessions.value.find(s => s.id === currentSessionId.value)
  )

  function createSession(name: string = '新会话') {
    const session: Session = {
      id: Date.now().toString(),
      name,
      messages: []
    }
    sessions.value.push(session)
    currentSessionId.value = session.id
    return session
  }

  function deleteSession(sessionId: string) {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = sessions.value[0]?.id || ''
      }
    }
  }

  function renameSession(sessionId: string, newName: string) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.name = newName
    }
  }

  function addMessage(sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString(),
        timestamp: Date.now()
      }
      session.messages.push(newMessage)
      return newMessage
    }
    return null
  }

  function updateModelConfig(config: Partial<ModelConfig>) {
    modelConfig.value = { ...modelConfig.value, ...config }
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    modelConfig,
    createSession,
    deleteSession,
    renameSession,
    addMessage,
    updateModelConfig
  }
})