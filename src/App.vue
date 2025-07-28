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
  --color-gray-2: #aeaeb2;
  --color-gray-3: #c7c7cc;
  --color-text-1: rgba(0, 0, 0, 1);
  --color-text-2: rgba(0, 0, 0, 0.6);
  --color-text-3: rgba(0, 0, 0, 0.38);

  --color-background: var(--color-white);
  --color-background-soft: var(--color-white-soft);
  --color-background-mute: var(--color-white-mute);
  --color-background-opacity: rgba(243, 243, 243, 1);
  --inner-glow-opacity: 0.1;

  --color-primary: #00b96b;
  --color-primary-soft: #00b96b99;
  --color-primary-mute: #00b96b33;

  --color-text: var(--color-text-1);
  --color-text-secondary: rgba(0, 0, 0, 0.75);
  --color-icon: #00000099;
  --color-icon-white: #000000;
  --color-border: #00000019;
  --color-border-soft: #00000010;
  --color-border-mute: #00000005;
  --color-error: #f44336;
  --color-link: #1677ff;
  --color-code-background: #e3e3e3;
  --color-hover: var(--color-white-mute);
  --color-active: var(--color-white-soft);
  --color-frame-border: #ddd;
  --color-group-background: var(--color-white);

  --color-reference: #cfe1ff;
  --color-reference-text: #000000;
  --color-reference-background: #f1f7ff;

  --color-list-item: #fff;
  --color-list-item-hover: #fafafa;


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
