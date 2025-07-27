<template>
  <el-card>
    <template #header>
      <div class="header-wrapper">
        <h3 class="settings-section-title">知识库管理</h3>
        <el-button type="primary" @click="showCreateDialog = true">新建知识库</el-button>
      </div>
    </template>

    <div class="knowledge-base-list">
      <el-empty v-if="knowledgeBases.length === 0" description="暂无知识库" />
      <template v-else>
        <div v-for="kb in knowledgeBases" :key="kb.id" class="knowledge-base-item">
          <div class="kb-info">
            <h4 class="kb-name">{{ kb.name }}</h4>
            <p class="kb-description" v-if="kb.description">{{ kb.description }}</p>
            <div class="kb-meta">
              <span>文件数：{{ kb.fileCount }}</span>
              <span>创建时间：{{ new Date(kb.createdAt).toLocaleDateString() }}</span>
              <span>更新时间：{{ new Date(kb.updatedAt).toLocaleDateString() }}</span>
            </div>
          </div>
          <div class="kb-actions">
            <el-button type="primary" @click="handleUpload(kb.id)">上传文件</el-button>
            <el-button @click="showFiles(kb.id)">查看文件</el-button>
            <el-button type="danger" @click="confirmDelete(kb.id)">删除</el-button>
          </div>
        </div>
      </template>
    </div>

    <!-- 创建知识库对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新建知识库"
      width="500px"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-position="top"
      >
        <el-form-item label="知识库名称" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入知识库名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="createForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入知识库描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreate">创建</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 文件列表对话框 -->
    <el-dialog
      v-model="showFilesDialog"
      :title="currentKnowledgeBase?.name + ' - 文件列表'"
      width="600px"
    >
      <el-table :data="files" style="width: 100%">
        <el-table-column prop="name" label="文件名" />
        <el-table-column prop="size" label="大小" :formatter="formatFileSize" />
        <el-table-column prop="uploadedAt" label="上传时间" :formatter="formatDate" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button
              type="danger"
              link
              @click="confirmDeleteFile(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 文件上传对话框 -->
    <el-dialog
      v-model="showUploadDialog"
      :title="currentKnowledgeBase?.name + ' - 上传文件'"
      width="500px"
    >
      <el-upload
        class="upload-wrapper"
        drag
        multiple
        action="/api/knowledge/upload"
        :headers="uploadHeaders"
        :data="{ knowledgeBaseId: currentKnowledgeBaseId }"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { KnowledgeBase, KnowledgeFile } from '@/types/knowledge'

// 状态
const knowledgeBases = ref<KnowledgeBase[]>([
  {
    id: '123123',
    description: "ceshi知识库",
    name: "zhishiku",
    fileCount: 21,
    createdAt: Date.now().toLocaleString(),
    updatedAt: Date.now().toLocaleString()
  }
])
const files = ref<KnowledgeFile[]>([])
const showCreateDialog = ref(false)
const showFilesDialog = ref(false)
const showUploadDialog = ref(false)
const currentKnowledgeBaseId = ref('')
const createFormRef = ref<FormInstance>()

// 表单数据
const createForm = ref({
  name: '',
  description: ''
})

// 表单校验规则
const createRules: FormRules = {
  name: [
    { required: true, message: '请输入知识库名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
  ]
}

// 计算属性
const currentKnowledgeBase = computed(() => 
  knowledgeBases.value.find(kb => kb.id === currentKnowledgeBaseId.value)
)

const uploadHeaders = computed(() => ({
  // TODO: 添加认证token
}))

// 方法
const handleCreate = async () => {
  if (!createFormRef.value) return
  
  try {
    await createFormRef.value.validate()
    // TODO: 调用创建知识库API
    showCreateDialog.value = false
    createForm.value = { name: '', description: '' }
    ElMessage.success('创建成功')
    loadKnowledgeBases()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleUpload = (kbId: string) => {
  currentKnowledgeBaseId.value = kbId
  showUploadDialog.value = true
}

const showFiles = async (kbId: string) => {
  currentKnowledgeBaseId.value = kbId
  // TODO: 加载文件列表
  showFilesDialog.value = true
}

const confirmDelete = async (kbId: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个知识库吗？删除后将无法恢复。',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用删除知识库API
    ElMessage.success('删除成功')
    loadKnowledgeBases()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除知识库失败:', error)
    }
  }
}

const confirmDeleteFile = async (fileId: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个文件吗？删除后将无法恢复。',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用删除文件API
    ElMessage.success('删除成功')
    if (currentKnowledgeBaseId.value) {
      showFiles(currentKnowledgeBaseId.value)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文件失败:', error)
    }
  }
}

const handleUploadSuccess = () => {
  ElMessage.success('上传成功')
  if (currentKnowledgeBaseId.value) {
    showFiles(currentKnowledgeBaseId.value)
  }
}

const handleUploadError = () => {
  ElMessage.error('上传失败')
}

const formatFileSize = (row: KnowledgeFile) => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = row.size
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

const formatDate = (row: KnowledgeFile) => {
  return new Date(row.uploadedAt).toLocaleString()
}

const loadKnowledgeBases = async () => {
  // TODO: 加载知识库列表
}

// 初始化加载
loadKnowledgeBases()
</script>

<style scoped>
.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.knowledge-base-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.knowledge-base-item {
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.kb-info {
  flex: 1;
}

.kb-name {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
}

.kb-description {
  margin: 0 0 8px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.kb-meta {
  display: flex;
  gap: 16px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.kb-actions {
  display: flex;
  gap: 8px;
}

.upload-wrapper {
  width: 100%;
}
</style>