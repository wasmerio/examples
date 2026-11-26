// 博客主题全局配置文件
import type { SiteConfig, NavConfig, ProfileConfig, FooterConfig } from './types/config'

// 站点基本信息
export const siteConfig: SiteConfig = {
    title: 'Rudeus 主题文档', // 站点标题
    subtitle: '一个基于 Astro 的简洁博客主题', // 站点副标题
    description: 'Rudeus 是一个基于 Astro 的简洁的博客主题', // SEO 站点描述
    url: 'https://rudeus-docs.crrashh.com', // 站点 URL
    isWithExt: false, // 是否在链接中保留 .html 后缀，true => /xxx.html, false => /xxx
    isWithLoadingBar: true, // 是否换页显示进度条，默认为 true

    license: {
        enabled: true, // 是否声明内容的许可协议
        name: 'CC BY-SA 4.0', // 许可协议名称
        url: 'https://creativecommons.org/licenses/by-sa/4.0/', // 许可协议链接
        prompt: '除特殊声明转载之外，本文由博主云萧原创且非 AI 生成内容，依据 [license] 许可协议授权，若需转载请注明出处及本声明。',
        // 显示在页面的许可协议提示语，可使用 [license] 占位符来插入协议链接
    },

    articles: {
        indexPerPage: 8, // 首页每页显示文章/说说数量，默认为 8
        descriptionLength: 90, // 文章自动生成简介的字数，默认为 90
    },

    background: {
        enabled: false, // 是否启用背景图
        url: {
            // 背景图路径
            light: 'https://i.cdn.crrashh.com/bg.jpg',
            dark: 'https://i.cdn.crrashh.com/bg-dark.jpg',
            // 如果头像在外部链接，直接填写 URL
            // 如果在项目内，填写以 /public 为 base 的相对路径
        },
        opacity: 0.25, // 背景图不透明度
    },
}

// 导航栏链接配置
export const navConfig: NavConfig = [
    { name: '友情链接', url: '/friends' },
    { name: '关于', url: '/about' },
    { name: '归档', url: '/posts' },
]

// 个人信息配置
export const profileConfig: ProfileConfig = {
    name: '云萧是个咕咕怪', // 昵称
    avatar: '/avatar.jpg', // 头像路径，规则同 background.url
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', // 简介
}

// 页脚信息配置
export const footerConfig: FooterConfig = {
    copyright: '© 2025-2026 crrashh1542.', // 版权
    message: `<a href="https://beian.miit.gov.cn" target="_blank">蜀ICP备2022029657号-2</a> |
              <a href="https://icp.gov.moe/?keyword=20220551">萌ICP备20220551号</a>`, // 额外需要展示的消息，可以是 HTML
}
