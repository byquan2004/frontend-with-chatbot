<template>
  <div class="message" :class="{ 'message-user': type === 'USER' }">
    <div class="message-avatar">
      <el-avatar :size="40" :src="avatarUrl" />
    </div>
    <div class="message-content">
      <div class="message-info">
        <span class="message-name">{{ type === 'USER' ? '你' : '助手' }}</span>
        <span class="message-time">{{ formatTime(timestamp) }}</span>
      </div>
      <div class="message-text" v-html="formatMessage(content)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

interface Props {
  content: string
  type: 'USER' | 'ASSISTANT'
  timestamp: Date
  avatarUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: ''
})

const formatTime = (timestamp: Date) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatMessage = (message: string) => {
  return marked(message)
}
</script>

<style scoped>
.message {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.message-user {
  flex-direction: row-reverse;
}

.message-user .message-content {
  align-items: flex-end;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 70%;
}

.message-info {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.message-text {
  padding: 12px 16px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  line-height: 1.5;
  word-break: break-word;
}

.message-user .message-text {
  background: var(--el-color-primary-light-9);
}
</style>