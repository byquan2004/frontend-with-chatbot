import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Session } from '@/types/conversation'
import { ElMessage } from 'element-plus'
import { conversationApi } from '@/api/conversation'

export const useConversationStore = defineStore('conversation', () => {
  const sessions = ref<Session[]>([])
  const currentSessionId = ref<string>('')

  const currentSession = computed(() =>
    sessions.value.find(s => s.id === currentSessionId.value)
  )

  async function loadSessions() {
    try {
      const res = await conversationApi.getConversations()
      if(res.data && res.data.length < 1) {
        createSession()
        return
      }
      sessions.value = res.data
      currentSessionId.value = res.data[0].id
    } catch (error) {
      ElMessage.error('Failed to load conversations')
      console.error('Failed to load conversations:', error)
    }
  }

  async function getSessionMessages(sessionId: string) {
    try {
      const res = await conversationApi.getConversationMessages(sessionId)
      return res.data
    } catch (error) {
      ElMessage.error('Failed to load conversation messages')
      console.error('Failed to load conversation messages:', error)
      return []
    }
  }

  function createSession(name: string = '新会话') {
    const session: Session = {
      id: uuidv4(),
      title: name,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    sessions.value.unshift(session)
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
      session.title = newName
    }
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    createSession,
    deleteSession,
    renameSession,
    getSessionMessages,
    loadSessions
  }
})