<script setup lang="ts">
import 'katex/dist/katex.min.css'
import '@/assets/markdown.css'
import { ref, onMounted } from 'vue'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import { createHighlighter, bundledLanguagesInfo } from 'shiki'
import { visit } from 'unist-util-visit'

const props = defineProps<{ content: string; mathEngine?: 'KaTeX' | 'MathJax' }>()
const html = ref('')

onMounted(async () => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(props.content)

  html.value = String(result)
})
</script>

<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<style scoped>
.markdown-body {
  padding: 1rem;
  line-height: 1.6;
}
/* 推荐额外手动微调代码块样式 */
.markdown-body pre {
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
}
</style>
