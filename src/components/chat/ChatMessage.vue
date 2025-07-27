<template>
  <div class="message" :class="{ 'message-user': isUser }">
    <div class="message-avatar">
      <el-avatar :size="40" :src="avatarUrl" />
    </div>
    <div class="message-content">
      <div class="message-info">
        <span class="message-name">{{ isUser ? '你' : 'AI助手' }}</span>
        <span class="message-time">{{ formatTime(timestamp) }}</span>
      </div>
      <div class="message-text" v-html="formatMessage(content)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content: string
  isUser: boolean
  timestamp: number
  avatarUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: ''
})

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatMessage = (message: string) => {
  // TODO: 实现markdown渲染和代码高亮
  return message.replace(/\n/g, '<br>')
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
  white-space: pre-wrap;
  word-break: break-word;
}

.message-user .message-text {
  background: var(--el-color-primary-light-9);
}
</style>