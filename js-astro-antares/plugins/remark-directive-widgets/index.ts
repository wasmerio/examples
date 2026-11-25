/// <reference types="mdast-util-to-hast" />
/// <reference types="mdast-util-directive" />
import type { RemarkPlugin } from '@astrojs/markdown-remark'
import { visit } from 'unist-util-visit'

const remarkDirectiveWidgets: RemarkPlugin = () => (tree, _) => {
  let tabsCount = 0
  visit(tree, (node) => {
    if (node.type !== 'containerDirective' && node.type !== 'leafDirective' && node.type !== 'textDirective') return
    const data = node.data || (node.data = {})
    const attr = node.attributes || (node.attributes = {})

    if (node.name === "note") {
      const type = attr.type || 'info'
      data.hName = "div"
      data.hProperties = { class: `note ${type}`}
    }

    if (node.name === "blockquote") {
      const type = attr.type || 'info'
      data.hName = "blockquote"
      data.hProperties = { class: `blockquote ${type}`}
    }

    if (node.name === "btn") {
      data.hName = "button"
      if (attr.url) {
        data.hProperties = { "data-url":attr.url ,class:'btn', type:'button', onclick: `window.open(this.dataset.url)`}
      } else if (attr.onclick) {
        data.hProperties = { class:'btn', type:'button', onclick: attr.onclick}
      }
    }

    if (node.name === "spoiler") {
      const title = attr.title || 'open / close'
      data.hName = "details"
      data.hProperties = { class: 'spoiler' }
      attr.open && (data.hProperties.open = true)
      node.children.unshift({
        type: 'html',
        value: `<summary>${title}</summary>`,
      })
    }

    if (node.name === "tabs" && node.type === 'containerDirective') {
      node.data = { hName: "div", hProperties: { class: 'tabs' } }
      const tabTitles: string[] = []
      node.children.forEach((child, index) => {
        if (child.type === 'containerDirective' && child.name === 'tab') {
          const data = child.data || (child.data = {})
          const attr = child.attributes || {}
          data.hName = "div"
          data.hProperties = { class: `tab${index===0?' active':''}` }
          tabTitles.push(attr.title || `Tab ${index + 1}`)
        }
      })
      const tabNavItemsHtml = tabTitles.map((title, index) => `<button type="button" class="tab-ctrl${index===0?' active':''}" onclick="showTab(event, ${index})">${title}</button>`).join('')
      node.children.unshift({
        type: 'html',
        value: `<div class="tabs-nav">${tabNavItemsHtml}</div>`,
      })
      tabsCount++
    }
  })

  tabsCount && tree.children.push({
    type: 'html',
    value: `<script>${(
      //@ts-ignore
      function showTab(event, tabIndex) {
        const tabs = event.target.closest('.tabs')
        const tabContents = tabs.querySelectorAll('.tab')
        const tabControls = tabs.querySelectorAll('.tab-ctrl')
        //@ts-ignore
        tabContents.forEach((tabContent, index) => {
          if (index === tabIndex) {
            tabContent.classList.add('active')
            tabControls[index].classList.add('active')
          } else {
            tabContent.classList.remove('active')
            tabControls[index].classList.remove('active')
          }
        })
      }
    ).toString()}</script>`
  })
}

export default remarkDirectiveWidgets