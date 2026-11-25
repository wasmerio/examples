const demolinks = (length: number) => new Array(length).fill({
  name: "Why Astro",
  link: 'https://astro.build/',
  avatar: '/favicon.svg',
  descr: 'docs.astro.build/en/concepts/why-astro',
  siteshot: '/https://docs.astro.build/en/concepts/why-astro/'
})

export default [
  {
    groupType: 'primary',
    groupName: 'PRIMARY',
    groupDesc: 'Primary links group',
    links: [
      {
        name: '汐涌及岸',
        link: 'https://coderxi.com',
        avatar: 'https://coderxi.com/avatar.png',
        descr: '盛年不重来，一日难在晨。及时当勉励，岁月不待人。',
        siteshot: 'https://coderxi.com/siteshot.png'
      },
      {
        name: '张麦麦',
        link: 'https://maxchang.me',
        avatar: 'https://maxchang.me/favicon.svg',
        descr: '我的影子想要去飞翔，我的人还在地上。',
        siteshot: '/wait/3/https://maxchang.me/'
      },
      ...demolinks(5)
    ]
  },
  {
    groupType: 'normal',
    groupName: 'NORMAL',
    groupDesc: 'Normal links group',
    links: [
      {
        name: "Astro",
        link: 'https://astro.build/',
        avatar: '/favicon.svg',
        descr: '本站所采用的框架！',
        siteshot: ''
      },
      ...demolinks(9)
    ]
  },
  {
    groupType: 'simple',
    groupName: 'SIMPLE',
    groupDesc: '',
    links: [
      {
        name: "Astro",
        link: 'https://astro.build/',
        avatar: '/favicon.svg',
        descr: '本站所采用的框架！',
        siteshot: ''
      },
      ...demolinks(20)
    ]
  }
];
