import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ModelConfig, Message, ModelRequest } from '@/types/chat'
import { listModels, chatStream } from '@/api/chat'
import { useConversationStore } from '@/stores/conversation'

export const useChatStore = defineStore('chat', () => {
  const models = ref<string[]>([])
  const messages = ref<Message[]>([])
  const conversationStore = useConversationStore()
  const currentSessionId = computed(() => conversationStore.currentSessionId)
  // 默认模型配置
  const modelConfig = ref<ModelConfig>({
    model: 'kimi-k2-0711-preview',
    temperature: 0.7,
    topP: 0.9,
    windowContextSize: 100,
    maxTokens: 4096,
    systemPrompt: '你是一个全能的助手，你的回答需要详细、准确、有逻辑、有深度。',
    knowledgeId: 0,
    tools: []
  })

  async function loadMessages() {
    if (!currentSessionId.value) {
      return
    }
    const res = await conversationStore.getSessionMessages(currentSessionId.value)
    messages.value = res
  }

  const currentMessages = computed(() =>
    messages.value.filter(m => m.conversationId === currentSessionId.value)
  )

  async function loadModels() {
    try {
      models.value = await listModels()
      if (models.value.length > 0 && !modelConfig.value.model) {
        modelConfig.value.model = models.value[0]
      }
    } catch (error) {
      console.error('Failed to load models:', error)
    }
  }


  function addMessage(message: Message) {
    messages.value.push(message)
  }

  async function chat(prompt: string) {
    if (!currentSessionId.value) {
      conversationStore.createSession()
    }
    const userMessage: Message = {
      conversationId: currentSessionId.value,
      content: prompt,
      type: 'USER',
      timestamp: new Date()
    }
    addMessage(userMessage)

    const assistantMessage: Message = {
      conversationId: currentSessionId.value,
      content: '',
      type: 'ASSISTANT',
      timestamp: new Date()
    }
    addMessage(assistantMessage)

    const modelRequest: ModelRequest = {
      prompt,
      ...modelConfig.value
    }

    try {
      await chatStream(
        currentSessionId.value,
        modelRequest,
        (data) => {
          const lastMessage = messages.value[messages.value.length - 1]
          if (lastMessage && lastMessage.type === 'ASSISTANT') {
            lastMessage.content += data
          }
        },
        (error) => {
          console.error('SSE Error:', error)
          const lastMessage = messages.value[messages.value.length - 1]
          if (lastMessage && lastMessage.type === 'ASSISTANT') {
            lastMessage.content = 'Error: ' + error.message
          }
        }
      )
    } catch (error) {
      console.error('Chat stream failed:', error)
    }
  }

  function updateModelConfig(config: Partial<ModelConfig>) {
    modelConfig.value = { ...modelConfig.value, ...config }
  }

  return {
    modelConfig,
    models,
    messages,
    currentMessages,
    addMessage,
    chat,
    loadModels,
    updateModelConfig,
    loadMessages
  }
})