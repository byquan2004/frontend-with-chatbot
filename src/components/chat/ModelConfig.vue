<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="模型配置"
      :width="isMobile ? '90%' : '500px'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="model-config-dialog"
    >
      <div class="model-config">
        <el-form label-position="top" :model="config">
          <el-form-item label="选择模型">
            <el-select v-model="config.model" placeholder="请选择模型">
              <el-option
                v-for="model in availableModels"
                :key="model.value"
                :label="model.label"
                :value="model.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Temperature">
            <el-slider
              v-model="config.temperature"
              :min="0"
              :max="1"
              :step="0.1"
              show-input
            />
          </el-form-item>

          <el-form-item label="Top P">
            <el-slider
              v-model="config.topP"
              :min="0"
              :max="1"
              :step="0.1"
              show-input
            />
          </el-form-item>

          <el-form-item label="最大上下文长度">
            <el-slider
              v-model="config.maxContextTokens"
              :min="512"
              :max="8192"
              :step="512"
              show-input
            />
          </el-form-item>

          <el-form-item label="最大输出Token">
            <el-slider
              v-model="config.maxTokens"
              :min="256"
              :max="4096"
              :step="256"
              show-input
            />
          </el-form-item>

          <el-form-item label="系统提示词">
            <el-input
              v-model="config.systemPrompt"
              type="textarea"
              :rows="4"
              placeholder="请输入系统提示词..."
            />          
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelConfig">取消</el-button>
          <el-button type="primary" @click="confirmConfig">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-button class="tool-button" @click="dialogVisible = true">
      <el-icon><Setting /></el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Setting } from '@element-plus/icons-vue'

interface ModelConfig {
  model: string
  temperature: number
  topP: number
  maxContextTokens: number
  maxTokens: number
  systemPrompt: string
}

const emit = defineEmits(['update'])

const dialogVisible = ref(false)
const isMobile = ref(window.innerWidth <= 768)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const tempConfig = ref<ModelConfig>({
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  topP: 0.9,
  maxContextTokens: 4096,
  maxTokens: 1024,
  systemPrompt: ''
})

const config = ref<ModelConfig>({ ...tempConfig.value })

const cancelConfig = () => {
  tempConfig.value = { ...config.value }
  dialogVisible.value = false
}

const confirmConfig = () => {
  config.value = { ...tempConfig.value }
  emit('update', config.value)
  dialogVisible.value = false
}

const availableModels = [
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
  { label: 'GPT-4', value: 'gpt-4' }
]


</script>

<style scoped>
.model-config-dialog {
  margin: 0 !important;
}

:deep(.el-dialog) {
  margin-top: 15vh;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item__label) {
  padding-bottom: 4px;
}

:deep(.el-select) {
  width: 100%;
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    margin-top: 10vh;
  }

  :deep(.el-form-item) {
    margin-bottom: 12px;
  }

  :deep(.el-slider__runway) {
    margin: 12px 0;
  }

  :deep(.el-form-item__label) {
    padding-bottom: 2px;
  }
}
</style>