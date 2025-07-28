// useMarkdown.ts  
import { ref, computed, onMounted, onUnmounted } from 'vue'  
import { unified } from 'unified'  
import remarkParse from 'remark-parse'  
import remarkGfm from 'remark-gfm'  
import remarkMath from 'remark-math'  
import remarkCjkFriendly from 'remark-cjk-friendly'  
import remarkRehype from 'remark-rehype'  
import rehypeKatex from 'rehype-katex'  
import rehypeMathjax from 'rehype-mathjax'  
import rehypeRaw from 'rehype-raw'  
import rehypeStringify from 'rehype-stringify'  
import { createHighlighter } from 'shiki'  
  
export interface MarkdownOptions {  
  mathEngine?: 'KaTeX' | 'MathJax' | 'none'  
  enableGfm?: boolean  
  enableCjkFriendly?: boolean  
  shikiTheme?: string  
}  
  
export function useMarkdown(options: MarkdownOptions = {}) {  
  const {  
    mathEngine = 'KaTeX',  
    enableGfm = true,  
    enableCjkFriendly = true,  
    shikiTheme = 'one-light'  
  } = options  
  
  const isLoading = ref(false)  
  const error = ref<string | null>(null)  
  const highlighter = ref<any>(null)  
  
  // 初始化 Shiki 高亮器  
  const initHighlighter = async () => {  
    try {  
      highlighter.value = await createHighlighter({  
        themes: [shikiTheme, 'material-theme-darker'],  
        langs: ['javascript', 'typescript', 'python', 'java', 'markdown', 'json']  
      })  
    } catch (err) {  
      console.error('Failed to initialize highlighter:', err)  
    }  
  }  
  
  // 配置 remark 插件  
  const remarkPlugins = computed(() => {  
    const plugins: any[] = []  
      
    if (enableGfm) {  
      plugins.push([remarkGfm, { singleTilde: false }])  
    }  
      
    if (enableCjkFriendly) {  
      plugins.push(remarkCjkFriendly)  
    }  
      
    if (mathEngine !== 'none') {  
      plugins.push(remarkMath)  
    }  
      
    return plugins  
  })  
  
  // 配置 rehype 插件  
  const rehypePlugins = computed(() => {  
    const plugins: any[] = []  
      
    plugins.push(rehypeRaw)  
      
    if (mathEngine === 'KaTeX') {  
      plugins.push(rehypeKatex)  
    } else if (mathEngine === 'MathJax') {  
      plugins.push(rehypeMathjax)  
    }  
      
    return plugins  
  })  
  
  // 处理 LaTeX 括号转换  
  const processLatexBrackets = (content: string): string => {  
    const protectedItems: string[] = []  
    let processedContent = content  
  
    // 保护代码块  
    processedContent = processedContent.replace(/```[\s\S]*?```/g, (match) => {  
      const placeholder = `__PROTECTED_${protectedItems.length}__`  
      protectedItems.push(match)  
      return placeholder  
    })  
  
    // 转换 LaTeX 语法  
    processedContent = processedContent.replace(/\\\[([\s\S]*?)\\\]/g, '$$$$1$$')  
    processedContent = processedContent.replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$')  
  
    // 恢复保护的内容  
    protectedItems.forEach((item, index) => {  
      processedContent = processedContent.replace(`__PROTECTED_${index}__`, item)  
    })  
  
    return processedContent  
  }  
  
  // 渲染 Markdown  
  const renderMarkdown = async (content: string): Promise<string> => {  
    if (!content) return ''  
  
    isLoading.value = true  
    error.value = null  
  
    try {  
      // 预处理 LaTeX 语法  
      const processedContent = processLatexBrackets(content)  
  
      // 创建 unified 处理器  
      const processor = unified()  
        .use(remarkParse)  
  
      // 添加 remark 插件  
      remarkPlugins.value.forEach(plugin => {  
        if (Array.isArray(plugin)) {  
          processor.use(plugin[0], plugin[1])  
        } else {  
          processor.use(plugin)  
        }  
      })  
  
      processor.use(remarkRehype, { allowDangerousHtml: true })  
  
      // 添加 rehype 插件  
      rehypePlugins.value.forEach(plugin => {  
        processor.use(plugin)  
      })  
  
      processor.use(rehypeStringify)  
  
      const result = await processor.process(processedContent)  
      return String(result)  
    } catch (err) {  
      error.value = err instanceof Error ? err.message : 'Unknown error'  
      return ''  
    } finally {  
      isLoading.value = false  
    }  
  }  
  
  // 代码高亮  
  const highlightCode = async (code: string, language: string): Promise<string> => {  
    if (!highlighter.value) return code  
  
    try {  
      return highlighter.value.codeToHtml(code, {  
        lang: language,  
        theme: shikiTheme  
      })  
    } catch (err) {  
      console.error('Code highlighting failed:', err)  
      return `<pre><code>${code}</code></pre>`  
    }  
  }  
  
  onMounted(() => {  
    initHighlighter()  
  })  
  
  onUnmounted(() => {  
    highlighter.value = null  
  })  
  
  return {  
    isLoading,  
    error,  
    renderMarkdown,  
    highlightCode,  
    processLatexBrackets  
  }  
}