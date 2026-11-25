const FAVICON = '/favicon.svg'
const BASE_URL = 'https://antares.coderxi.com'
const SITE_INFO = {
  title: 'Antares',
  author: '汐涌及岸',
  language: 'zh-CN',
  description: 'A blog template based on Astro',
  startYear: 2024,
  endYear: new Date().getFullYear(),
  email: 'coderxi@qq.com',
  baseUrl: BASE_URL + '/',
  avatarUrl: BASE_URL + '/favicon.svg',
  siteshotUrl: BASE_URL + '/siteshot.png',
}
const POST_PGAE_SIZE = 5
const DEFAULT_FRONTMATTER = {
  titleIcon: 'asset:feather,#4c4948|asset:feather,#c9c9d7',
  titleColor: '#4c4948|#c9c9d7',
  description: '暂无描述.',
  categories: ['未分类'],
  encrypt: {
    description: '这是一篇被加密的文章哟',
    placeholder: '输入密码'
  }
}
const SIDEBAR_SETTINGS = {
  name: "Antares",
  avatar: '/favicon.svg',
}
const ASIDE_CARDS = {
  info: {
    name: "Antares",
    link: '/',
    avatar: '/favicon.svg',
    descriptionLines: [
      "This is the Antares theme",
      "A blog template based on Astro",
    ]
  }
}
const NAV_ITEMS = [
  {
    icon: "mdi:post-outline",
    text: "BLOG",
    href: "/",
    children: [
      {
        icon: "mdi:archive",
        text: "归档",
        href: "/archives",
      },
      {
        icon: "mdi:folder-open",
        text: "分类",
        href: "/categories"
      },
      {
        icon: "mdi:tag-multiple",
        text: "标签",
        href: "/tags"
      },
    ]
  },
  {
    icon: "mdi:account-multiple",
    text: "友链",
    href: "/links"
  },
  {
    icon: "mdi:account-box",
    text: "我的",
    href: "/about",
    children: [
      {
        icon: "mdi:account",
        text: "关于我",
        href: "/about"
      }
    ]
  }
]

const FOOTER = {
  badgeGroups: [
    [
      {
        label: '框架',
        message: `Astro ${packageJson.dependencies.astro.slice(1)}`,
        labelColor: '#555',
        color: '#E374B9',
        logoBase64: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' color='white' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944c.856 1.026 2.043 1.352 3.272 1.535c1.897.283 3.76.177 5.522-.678c.202-.098.388-.229.608-.36c.166.473.209.95.151 1.437c-.14 1.185-.738 2.1-1.688 2.794c-.38.277-.782.525-1.175.787c-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.16 3.16 0 0 1-1.407-1.188a3.3 3.3 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958c-.106-.769-.472-1.113-1.161-1.133c-.707-.02-1.267.411-1.415 1.09c-.012.053-.028.104-.045.165zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614s.57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727z'/%3E%3C/svg%3E`,
        links: ['https://astro.build'],
        style: 'flat-square',
        idSuffix: '-badge-astro',
      },
      {
        label: '主题',
        message: `Antares ${packageJson.version}`,
        labelColor: '#555',
        color: '#1E8CD9',
        logoBase64: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' color='white' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944c.856 1.026 2.043 1.352 3.272 1.535c1.897.283 3.76.177 5.522-.678c.202-.098.388-.229.608-.36c.166.473.209.95.151 1.437c-.14 1.185-.738 2.1-1.688 2.794c-.38.277-.782.525-1.175.787c-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.16 3.16 0 0 1-1.407-1.188a3.3 3.3 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958c-.106-.769-.472-1.113-1.161-1.133c-.707-.02-1.267.411-1.415 1.09c-.012.053-.028.104-.045.165zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614s.57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727z'/%3E%3C/svg%3E`,
        links: ['https://github.com/coderxi1/astro-antares'],
        style: 'flat-square',
        idSuffix: '-badge-moeicp'
      },
    ],
    [
      {
        label: '',
        message: 'RSS',
        labelColor: '#555',
        color: '#555',
        logoBase64: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' color='white' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24zM3.291 17.415a3.3 3.3 0 0 1 3.293 3.295A3.303 3.303 0 0 1 3.283 24C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.295M15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91'/%3E%3C/svg%3E`,
        links: ['/rss.xml'],
        style: 'flat-square',
        idSuffix: '-badge-rss'
      },
      {
        label: '',
        message: 'ATOM',
        labelColor: '#555',
        color: '#555',
        logoBase64: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' color='white' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24zM3.291 17.415a3.3 3.3 0 0 1 3.293 3.295A3.303 3.303 0 0 1 3.283 24C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.295M15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91'/%3E%3C/svg%3E`,
        links: ['/atom.xml'],
        style: 'flat-square',
        idSuffix: '-badge-atom'
      },
    ]
  ] satisfies Format[][]
}

export const FRIEND_LINK = {
  info: SITE_INFO,
  groups: friend_link_groups,
  siteshotPrefix: 'https://image.thum.io/get/width/400/crop/800/'
}

//======================================
;
import packageJson from '../package.json'
import type { Format } from 'badge-maker'
import friend_link_groups from './config.links'
import moment from 'moment'
moment.locale(SITE_INFO.language)
export { FAVICON, BASE_URL, SITE_INFO, POST_PGAE_SIZE, DEFAULT_FRONTMATTER, NAV_ITEMS, FOOTER, ASIDE_CARDS, SIDEBAR_SETTINGS }
