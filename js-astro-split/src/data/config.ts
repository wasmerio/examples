interface Site {
  title: string
  description: string
  url: string
}

interface Owner {
  name: string
  description: string
}

export const Site = {
  title: 'Splitscreen',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
  url: 'https://astro-split.vercel.app/'
}

export const Owner = {
  name: 'Imani Jones',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. '
}
