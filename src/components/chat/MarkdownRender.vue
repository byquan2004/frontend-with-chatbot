<template>  
  <div class="markdown-container">  
    <div   
      v-if="isLoading"   
      class="loading"  
    >  
      渲染中...  
    </div>  
      
    <div   
      v-else-if="error"   
      class="error"  
    >  
      渲染错误: {{ error }}  
    </div>  
      
    <div   
      v-else  
      class="markdown"  
      v-html="renderedContent"  
    />  
  </div>  
</template>  
  
<script setup lang="ts">  
import '@/styles/markdown.css'
import { ref, watch, onMounted } from 'vue'  
import { useMarkdown, type MarkdownOptions } from '@/utils/useMarkdown'  
import 'katex/dist/katex.min.css'  
  
interface Props {  
  content: string  
  options?: MarkdownOptions  
}  
  
const props = withDefaults(defineProps<Props>(), {  
  content: '',  
  options: () => ({})  
})  
  
const renderedContent = ref('')  
const { isLoading, error, renderMarkdown } = useMarkdown(props.options)  
  
const updateContent = async () => {  
  if (props.content) {  
    renderedContent.value = await renderMarkdown(props.content)  
  }  
}  
  
watch(() => props.content, updateContent, { immediate: true, deep: true })  
  
onMounted(() => {  
  updateContent()  
})  
</script>  