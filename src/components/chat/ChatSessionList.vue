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
          :class="{ 'is-active': session.id === activeSessionId }"
          @click.self="selectSession(session.id)"
        >
          <el-icon><ChatRound /></el-icon>
          <span class="session-name" @click="selectSession(session.id)">{{ session.name }}</span>
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
import { ref } from 'vue'
import { Plus, ChatRound, More, Fold } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { v4 as uuidv4 } from 'uuid';
interface Session {
  id: string
  name: string
}

const emit = defineEmits(['select', 'create', 'delete', 'rename', 'collapse'])

const isEditing = ref(false)
const sessions = ref<Session[]>([
  { id: '1', name: '默认会话' }
])

const activeSessionId = ref('1')

const createNewSession = () => {
  const newSession = {
    id: uuidv4(),
    name: `新会话 ${sessions.value.length + 1}`
  }
  sessions.value.push(newSession)
  emit('create', newSession)
  selectSession(newSession.id)
}

const selectSession = (sessionId: string) => {
  activeSessionId.value = sessionId
  emit('select', sessionId)
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
      sessions.value = sessions.value.filter(s => s.id !== sessionId)
      emit('delete', sessionId)
      if (activeSessionId.value === sessionId) {
        selectSession(sessions.value[0]?.id || '')
      }
    } else if (action === 'rename') {
      const session = sessions.value.find(s => s.id === sessionId)
      if (!session) return
      
      const { value: newName } = await ElMessageBox.prompt('请输入新的会话名称', '重命名', {
        inputValue: session.name,
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
      
      if (newName?.trim()) {
        session.name = newName.trim()
        emit('rename', { id: sessionId, name: newName.trim() })
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