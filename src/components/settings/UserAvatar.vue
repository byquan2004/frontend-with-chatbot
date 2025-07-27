<template>
  <div class="avatar-wrapper">
    <el-upload
      class="avatar-uploader"
      action="/api/user/avatar"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <el-avatar
        v-if="avatarUrl"
        :size="100"
        :src="avatarUrl"
        class="avatar"
      />
      <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
    </el-upload>
    <div class="avatar-tip">点击上传头像</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update'])

const avatarUrl = ref('')

const handleAvatarSuccess = (response: any) => {
  avatarUrl.value = response.url
  emit('update', response.url)
  ElMessage.success('头像上传成功')
}

const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}
</script>

<style scoped>
.avatar-wrapper {
  text-align: center;
}

.avatar-uploader {
  display: inline-block;
  cursor: pointer;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  display: block;
}

.avatar-tip {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
</style>