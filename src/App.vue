<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
</script>

<style>

:root {
  --chat-bg-color: var(--el-bg-color);
  --chat-border-color: var(--el-border-color-light);
  --chat-text-color: var(--el-text-color-primary);
  --chat-hover-color: var(--el-color-primary-light-9);
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: var(--el-font-family);
  color: var(--chat-text-color);
  background-color: var(--chat-bg-color);
}

#app {
  height: 100%;
}
</style>
