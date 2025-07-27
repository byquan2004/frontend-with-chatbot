<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue'
import { unified } from 'unified'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import { getHighlighter } from 'shiki'

const props = defineProps<{ content: string; mathEngine?: 'KaTeX' | 'MathJax' }>()
const html = ref('')

onMounted(async () => {
  const highlighter = await getHighlighter({ theme: 'nord' })
  const file = await unified()
    .use(remarkGfm)
    .use(remarkMath)
    .use(rehypeRaw)
    .use(props.mathEngine === 'KaTeX' ? rehypeKatex : rehypeStringify)
    .use(() => tree => {
      const visit = require('unist-util-visit')
      visit(tree, 'code', node => {
        const { lang, value } = node
        const html = highlighter.codeToHtml(value, { lang: lang || 'text' })
        node.type = 'html'
        node.value = html
        delete node.children
      })
    })
    .use(rehypeStringify)
    .process(props.content)
  html.value = String(file)
})
</script>

<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<style scoped>
@import 'katex/dist/katex.min.css';
@import 'highlight.js/styles/github.css';
.markdown-body {
  padding: 1rem;
  line-height: 1.6;
}
/* 可根据你的视觉风格调整 */
</style> -->
