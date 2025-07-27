<template>
  <div class="settings-container">
    <div class="settings-header">
      <el-page-header @back="router.back()">
        <template #content>
          <span class="settings-title">设置</span>
        </template>
      </el-page-header>
    </div>

    <div class="settings-content">
      <el-card>
        <template #header>
          <h3 class="settings-section-title">个人信息</h3>
        </template>

        <el-form
          ref="formRef"
          :model="userForm"
          :rules="rules"
          label-position="top"
        >
          <div class="avatar-section">
            <UserAvatar @update="handleAvatarUpdate" />
          </div>

          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" @blur="handleSave" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <div class="email-input-group">
              <el-input v-model="userForm.email" />
              <el-button type="primary" @click="handleChangeEmail">更改邮箱</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="mt-4">
        <template #header>
          <h3 class="settings-section-title">主题设置</h3>
        </template>

        <el-form label-position="top">
          <el-form-item label="主题模式">
            <el-radio-group v-model="themeMode" @change="handleThemeChange">
              <el-radio-button label="light">浅色</el-radio-button>
              <el-radio-button label="dark">深色</el-radio-button>
              <el-radio-button label="system">跟随系统</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>

      <KnowledgeBaseManager class="mt-4" />
    </div>

    <EmailVerifyDialog
      ref="emailVerifyDialogRef"
      :email="userForm.email"
      @success="handleEmailVerifySuccess"
      @cancel="handleEmailVerifyCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useDark, useToggle } from '@vueuse/core'
import UserAvatar from '@/components/settings/UserAvatar.vue'
import EmailVerifyDialog from '@/components/settings/EmailVerifyDialog.vue'
import KnowledgeBaseManager from '@/components/settings/KnowledgeBaseManager.vue'

const router = useRouter()
const formRef = ref<FormInstance>()
const emailVerifyDialogRef = ref<InstanceType<typeof EmailVerifyDialog>>()

const userForm = ref({
  username: 'demo_user',
  email: 'demo@example.com',
  avatar: ''
})

const isDark = useDark()
const toggleDark = useToggle(isDark)
const themeMode = ref('system')

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于3个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
}

const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    // TODO: 实现保存用户信息的逻辑
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleAvatarUpdate = (url: string) => {
  userForm.value.avatar = url
}

const handleChangeEmail = () => {
  emailVerifyDialogRef.value?.open()
}

const handleEmailVerifySuccess = () => {
  // TODO: 处理邮箱验证成功后的逻辑
}

const handleEmailVerifyCancel = () => {
  // TODO: 处理邮箱验证取消后的逻辑
}

const handleThemeChange = (value: string) => {
  if (value === 'dark') {
    isDark.value = true
  } else if (value === 'light') {
    isDark.value = false
  } else {
    // 跟随系统
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
}

onMounted(() => {
  // TODO: 加载用户信息
})
</script>

<style scoped>
.settings-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: 24px;
}

.settings-title {
  font-size: 20px;
  font-weight: 500;
}

.settings-section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.mt-4 {
  margin-top: 16px;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.email-input-group {
  width: 100%;
  display: flex;
  gap: 16px;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: var(--el-input-bg-color, var(--el-bg-color-page));
}
</style>