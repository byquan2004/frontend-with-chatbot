<template>
  <el-dialog
    v-model="dialogVisible"
    title="邮箱验证"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="验证码" prop="code">
        <div class="verify-code-input">
          <el-input
            v-model="form.code"
            placeholder="请输入验证码"
            maxlength="6"
          >
            <template #append>
              <el-button
                :disabled="countdown > 0"
                @click="sendVerifyCode"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  email: string
}>()

const emit = defineEmits(['success', 'cancel'])

const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const form = ref({
  code: ''
})

const rules: FormRules = {
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度必须为6位', trigger: 'blur' }
  ]
}

const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }
  }, 1000)
}

const sendVerifyCode = async () => {
  try {
    // TODO: 调用发送验证码API
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API调用
    ElMessage.success('验证码已发送')
    startCountdown()
  } catch (error) {
    console.error('发送验证码失败:', error)
    ElMessage.error('发送验证码失败')
  }
}

const handleConfirm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    // TODO: 调用验证码验证API
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API调用
    ElMessage.success('修改成功')
    emit('success')
    close()
  } catch (error) {
    console.error('修改失败:', error)
  }
}

const handleCancel = () => {
  emit('cancel')
  close()
}

const close = () => {
  dialogVisible.value = false
  form.value.code = ''
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = 0
}

const open = () => {
  dialogVisible.value = true
}

defineExpose({
  open
})
</script>

<style scoped>
.verify-code-input {
  display: flex;
  gap: 8px;
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-input-group__append button) {
  border: none;
  margin: 0;
  height: 100%;
}
</style>