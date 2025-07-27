<template>
  <div class="chat-container">
    <div class="chat-sidebar" :class="{ 'is-visible': isSidebarVisible }">
      <ChatSessionList
        @select="handleSessionSelect"
        @create="handleSessionCreate"
        @delete="handleSessionDelete"
        @rename="handleSessionRename"
        @collapse="toggleSidebar"
      />
    </div>

    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <el-button
            class="menu-button"
            @click="toggleSidebar"
          >
            <el-icon><Fold /></el-icon>
          </el-button>
        </div>

        <h2 class="session-title">{{ currentSession?.name || '新会话' }}</h2>

        <div class="header-right">
          <el-dropdown @command="handleUserCommand">
            <el-avatar :size="32" :src="userAvatar" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <el-scrollbar height="100%" ref="scrollbar">
          <div class="messages-wrapper">
            <ChatMessage
              v-for="message in messages"
              :key="message.id"
              :content="message.content"
              :is-user="message.isUser"
              :timestamp="message.timestamp"
              :avatar-url="message.isUser ? userAvatar : aiAvatar"
            />
          </div>
        </el-scrollbar>
      </div>

      <div class="chat-input">
        <ChatInput
          @send="handleSendMessage"
          @knowledge-base-change="handleKnowledgeBaseChange"
          @mcp-tools-change="handleMcpToolsChange"
          @model-config-update="handleModelConfigUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { Setting, SwitchButton, Fold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import ChatSessionList from '@/components/chat/ChatSessionList.vue'
import ChatMessage from '@/components/chat/ChatMessage.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ModelConfig from '@/components/chat/ModelConfig.vue'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: number
}

interface Session {
  id: string
  name: string
}

const router = useRouter()
const scrollbar = ref()
const messages = ref<Message[]>([])
const currentSession = ref<Session | null>(null)
const isSidebarVisible = ref(false)

// 模拟用户头像和AI头像
const userAvatar = 'https://avatars.githubusercontent.com/u/1?v=4'
const aiAvatar = 'https://avatars.githubusercontent.com/u/2?v=4'

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}

const handleSendMessage = async (content: string) => {
  // 添加用户消息
  const userMessage: Message = {
    id: Date.now().toString(),
    content,
    isUser: true,
    timestamp: Date.now()
  }
  messages.value.push(userMessage)
  await scrollToBottom()

  // TODO: 调用API获取AI响应
  setTimeout(() => {
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '这是一个模拟的AI响应消息...',
      isUser: false,
      timestamp: Date.now()
    }
    messages.value.push(aiMessage)
    scrollToBottom()
  }, 1000)
}

const scrollToBottom = async () => {
  await nextTick()
  scrollbar.value?.setScrollTop(99999)
}

const handleSessionSelect = (sessionId: string) => {
  // TODO: 加载会话历史记录
  console.log('选择会话:', sessionId)
}

const handleSessionCreate = (session: Session) => {
  currentSession.value = session
  messages.value = []
}

const handleSessionDelete = (sessionId: string) => {
  if (currentSession.value?.id === sessionId) {
    currentSession.value = null
    messages.value = []
  }
}

const handleSessionRename = (session: Session) => {
  if (currentSession.value?.id === session.id) {
    currentSession.value = session
  }
}

const handleModelConfigUpdate = (config: any) => {
  console.log('模型配置更新:', config)
  // TODO: 更新模型配置
}

const handleUserCommand = (command: string) => {
  if (command === 'settings') {
    router.push('/settings')
  } else if (command === 'logout') {
    // TODO: 实现退出登录逻辑
    router.push('/login')
  }
}

const handleKnowledgeBaseChange = (value: string) => {
  console.log('知识库更新:', value)
  // TODO: 处理知识库变更
}

const handleMcpToolsChange = (tools: string[]) => {
  console.log('MCP工具更新:', tools)
  // TODO: 处理MCP工具变更
}

onMounted(() => {
  // TODO: 加载初始数据
  const handleResize = () => {
    if (window.innerWidth > 768) {
      isSidebarVisible.value = false
    }
  }
  window.addEventListener('resize', handleResize)
  return () => {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background: var(--el-bg-color);
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
}

.chat-sidebar {
  width: 260px;
  border-right: 1px solid var(--el-border-color-light);
  transition: all 0.3s ease;
  background: var(--el-bg-color);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .chat-container {
    max-width: 100%;
  }

  .chat-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
  }

  .chat-sidebar.is-visible {
    transform: translateX(0);
  }
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.header-left,
.header-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-right {
  justify-content: flex-end;
}

.menu-button {
  display: none;
  padding: 8px;
  height: 32px;
  width: 32px;
}

@media (max-width: 768px) {
  .menu-button {
    display: flex;
  }

  .session-title {
    font-size: 16px;
  }

  .chat-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    background: var(--el-bg-color);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .chat-sidebar.is-visible {
    transform: translateX(0);
  }

  .chat-main {
    margin-left: 0;
  }
}

.session-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  flex: 2;
}

.chat-messages {
  flex: 1;
  overflow: hidden;
  padding: 24px;
}

.messages-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .messages-wrapper {
    max-width: 100%;
  }

  .chat-messages {
    padding: 16px;
  }
}

.chat-input {
  padding: 16px 24px;
  background: var(--el-bg-color);
}

@media (max-width: 768px) {
  .chat-input {
    padding: 12px 16px;
  }
}
</style>