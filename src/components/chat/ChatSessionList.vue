<template>
  <div class="session-list">
    <div class="session-header">
      <el-button type="primary" @click="createNewSession">
        <el-icon><Plus /></el-icon>
        新建会话
      </el-button>
      <el-button
        class="collapse-button"
        :disabled="isEditing"
        @click="$emit('collapse')"
      >
        <el-icon><Fold /></el-icon>
      </el-button>
    </div>
    
    <el-scrollbar height="calc(100vh - 120px)">
      <div class="session-items">
        <div
          v-for="session in sessions"
          :key="session.id"
          class="session-item"
          :class="{ 'is-active': session.id === currentSession }"
          @click.self="selectSession(session.id)"
        >
          <el-icon><ChatRound /></el-icon>
          <span class="session-name" @click="selectSession(session.id)">{{ session.title }}</span>
          <el-dropdown trigger="click" @command="handleSessionCommand">
            <el-button class="session-more" link>
              <el-icon><More /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="['rename', session.id]">
                  重命名
                </el-dropdown-item>
                <el-dropdown-item
                  :command="['delete', session.id]"
                  divided
                  type="danger"
                >
                  删除会话
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus, ChatRound, More, Fold } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useConversationStore } from '@/stores/conversation'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'

const conversationStore = useConversationStore()
const chatStore = useChatStore()

const emit = defineEmits(['collapse'])

const isEditing = ref(false)
const sessions = storeToRefs(conversationStore).sessions
const currentSession = storeToRefs(conversationStore).currentSessionId

const createNewSession = () => {
  conversationStore.createSession()
  selectSession(currentSession.value)
}

const selectSession = async (sessionId: string) => {
  currentSession.value = sessionId
  await chatStore.loadMessages()
}

const handleSessionCommand = async ([action, sessionId]: [string, string]) => {
  isEditing.value = true
  try {
    if (action === 'delete') {
      await ElMessageBox.confirm('确定要删除这个会话吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
      conversationStore.deleteSession(sessionId)
      if (currentSession.value === sessionId) {
        selectSession(sessions.value[0]?.id || '')
      }
    } else if (action === 'rename') {
      const tempSession = conversationStore.sessions.find(s => s.id === sessionId)
      const { value: newName } = await ElMessageBox.prompt('请输入新的会话名称', '重命名', {
        inputValue: tempSession?.title,
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
      
      if (newName?.trim()) {
        conversationStore.renameSession(sessionId, newName)
      }
    }
  } catch {}
  isEditing.value = false
}

</script>

<style scoped>
.session-list {
  height: 100%;
  border-right: 1px solid var(--el-border-color-light);
}

.session-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  gap: 8px;
  align-items: center;
}

.collapse-button {
  display: none;
}

@media (max-width: 768px) {
  .collapse-button {
    display: block;
  }
}

.session-items {
  padding: 8px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.session-item:hover {
  background: var(--el-fill-color-light);
}

.session-item.is-active {
  background: var(--el-color-primary-light-9);
}

.session-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-more {
  opacity: 0;
  transition: opacity 0.3s;
}

.session-item:hover .session-more {
  opacity: 1;
}
</style>