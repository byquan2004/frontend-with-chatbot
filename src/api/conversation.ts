import request from '@/utils/request'
import type { Message } from '@/types/chat'
import type { Session } from '@/types/conversation'
import type { R } from '@/types/common'

export const conversationApi = {
  getConversations: () => {
    return request.get<R<Session[]>>('/conversations')
  },
  getConversationMessages: (id: string) => {
    return request.get<R<Message[]>>(`/conversations/${id}/messages`)
  }
}