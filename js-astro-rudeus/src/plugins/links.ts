// 此插件用于为外部链接添加 target="_blank"
import { visit } from 'unist-util-visit'

export default (site: string) => {
    const siteHost = new URL(site).host

    return () => (tree: any) => {
        visit(tree, 'element', (node: any) => {
            // 获取 a href 地址
            const href = node.properties?.href

            // 获取本站点地址
            let host: string
            try {
                host = new URL(href).host
            } catch {
                return
            }

            const isExternalLink = /^https?:\/\//i.test(href) && host != siteHost
            if (isExternalLink) {
                node.properties ||= {}
                node.properties.target = '_blank'
            }
        })
    }
}
