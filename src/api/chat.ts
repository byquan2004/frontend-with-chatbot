import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { ModelRequest } from '@/types/chat'

const BASE_URL = '/api'

export const listModels = async (): Promise<string[]> => {
  const response = await fetch(`${BASE_URL}/models`)
  if (!response.ok) {
    throw new Error('Failed to fetch models')
  }
  const data = await response.json()
  return data.data
}

export const chatStream = async (
  conversationId: string,
  modelRequest: ModelRequest,
  onMessage: (data: string) => void,
  onError: (error: any) => void
) => {
  await fetchEventSource(`${BASE_URL}/chat-stream/${conversationId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(modelRequest),
      onmessage(ev) {
        onMessage(ev.data)
      },
      onerror(err) {
        onError(err)
        throw err // Rethrow to stop the connection
      }
    }
  )
}
