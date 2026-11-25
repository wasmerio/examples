import { defineEcConfig } from 'astro-expressive-code'

import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { pluginFramesTexts } from '@expressive-code/plugin-frames'

pluginFramesTexts.addLocale('zh-CN',{
  copyButtonTooltip: '点击复制',
  copyButtonCopied: '复制成功!'
})

export default defineEcConfig({
  defaultLocale: 'zh-CN',
  plugins: [ pluginLineNumbers(), pluginCollapsibleSections()],
  themes: ['light-plus','dark-plus'],
  themeCssSelector:() => `.dark`,
  useDarkModeMediaQuery: false,
  defaultProps: {
    overridesByLang: {
      'shell': {
        showLineNumbers: false,
      }
    }
  }
})