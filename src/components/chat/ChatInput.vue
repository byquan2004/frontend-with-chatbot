<template>
  <div class="chat-input-container">
    <div class="input-area">
      <el-input
        v-model="messageContent"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 6 }"
        placeholder="输入消息..."
        resize="vertical"
        @keydown.enter.prevent="handleEnter"
      />
      <div class="input-toolbar">
        <div class="tools-group">
          <el-tooltip content="上传图片" placement="top">
            <el-upload
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              class="tool-button"
              @change="handleImageUpload"
            >
              <el-icon><Upload /></el-icon>
            </el-upload>
          </el-tooltip>
          
          <el-tooltip content="语音输入" placement="top">
            <el-button
              class="tool-button"
              :class="{ 'is-recording': isRecording }"
              @click="toggleVoiceRecognition"
            >
              <el-icon><Microphone /></el-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip content="知识库" placement="top">
            <el-popover
              placement="top"
              trigger="click"
              :width="200"
            >
              <template #reference>
                <el-button class="tool-button">
                  <el-icon><Collection /></el-icon>
                </el-button>
              </template>
              <div class="tool-select">
                <el-select
                  v-model="selectedKnowledgeBase"
                  placeholder="选择知识库"
                  clearable
                >
                  <el-option
                    v-for="kb in knowledgeBases"
                    :key="kb.value"
                    :label="kb.label"
                    :value="kb.value"
                  />
                </el-select>
              </div>
            </el-popover>
          </el-tooltip>

          <el-tooltip content="工具" placement="top">
            <el-popover
              placement="top"
              trigger="click"
              :width="200"
            >
              <template #reference>
                <el-button class="tool-button">
                  <el-icon><Operation /></el-icon>
                </el-button>
              </template>
              <div class="tool-select">
                <el-select
                  v-model="selectedMcpTools"
                  placeholder="选择MCP工具"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                >
                  <el-option
                    v-for="tool in mcpTools"
                    :key="tool.value"
                    :label="tool.label"
                    :value="tool.value"
                  />
                </el-select>
              </div>
            </el-popover>
          </el-tooltip>

          <el-tooltip content="模型配置" placement="top">
            <ModelConfig @update="handleModelConfigUpdate" class="tool-wrapper" />
          </el-tooltip>
        </div>

        <el-button
          type="primary"
          class="send-button"
          :disabled="!messageContent.trim()"
          @click="sendMessage"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Upload, Microphone, Collection, Operation, Setting } from '@element-plus/icons-vue'
import ModelConfig from './ModelConfig.vue'

const messageContent = ref('')
const isRecording = ref(false)
const selectedKnowledgeBase = ref('')
const selectedMcpTools = ref<string[]>([])

const emit = defineEmits(['send', 'knowledgeBaseChange', 'mcpToolsChange', 'modelConfigUpdate'])

const knowledgeBases = [
  { label: '通用知识库', value: 'general' },
  { label: '技术文档', value: 'tech' },
  { label: '客服知识库', value: 'customer-service' }
]

const mcpTools = [
  { label: '代码分析', value: 'code-analysis' },
  { label: '文本摘要', value: 'text-summary' },
  { label: '数据可视化', value: 'data-viz' },
  { label: '语言翻译', value: 'translation' }
]

const handleImageUpload = (file: File) => {
  // TODO: 处理图片上传
  console.log('上传图片:', file)
}

const toggleVoiceRecognition = () => {
  isRecording.value = !isRecording.value
  // TODO: 实现语音识别
}

const sendMessage = () => {
  if (messageContent.value.trim()) {
    emit('send', messageContent.value)
    messageContent.value = ''
  }
}

const handleEnter = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    sendMessage()
  }
}

watch(selectedKnowledgeBase, (newValue) => {
  emit('knowledgeBaseChange', newValue)
})

watch(selectedMcpTools, (newValue) => {
  emit('mcpToolsChange', newValue)
})

const handleModelConfigUpdate = (config: any) => {
  emit('modelConfigUpdate', config)
}
</script>

<style scoped>
.chat-input-container {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 16px;
  background: var(--el-bg-color);
}

.input-area {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tools-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tools-group :deep(.el-upload),
.tools-group :deep(.tool-wrapper) {
  display: flex;
  align-items: center;
}

.tool-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  transition: all 0.2s;
  margin: 0;
}

.tool-button:hover {
  background-color: var(--el-fill-color-light);
}

.tool-button.is-recording {
  color: var(--el-color-danger);
  border-color: var(--el-color-danger);
}

.send-button {
  margin-left: 12px;
  padding: 6px 12px;
}

.tool-select .el-select {
  width: 100%;
}

:deep(.el-textarea__inner) {
  min-height: 60px !important;
}

@media (max-width: 768px) {
  .tools-panel {
    margin-top: 4px;
    padding-top: 4px;
  }

  .input-toolbar {
    gap: 4px;
  }
}
</style>