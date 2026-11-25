export type SocialIcon = 'github' | 'mastodon' | 'twitter' | 'rss' | 'email' | 'instagram' | 'youtube'

export interface NavItem {
  title: string
  url:   string
}

export interface SocialItem {
  title: string
  url:   string
  icon?: SocialIcon
}

/** One browsable dimension, sourced from `meta[key]` on posts/notes. */
export interface BrowseIndexConfig {
  key:   string  // child key inside an entry's `meta` object
  title: string  // display title, e.g. "Places"
  slug:  string  // URL segment, e.g. "places" -> /browse/places
}

export interface BrowseConfig {
  years?:   boolean
  indexes?: BrowseIndexConfig[]
}

export interface UserConfig {
  // site identity
  title:       string
  description: string
  url:         string
  locale?:     string

  // author
  author: {
    name:    string
    bio?:    string
    url?:    string
    avatar?: string
  }

  // assets
  logo?:    string
  ogImage?: string

  // navigation
  navigation?:  NavItem[]
  footerLinks?: NavItem[]
  social?:      SocialItem[]

  // content display
  heroText?:       string
  notebookQuote?:  string
  tagline?:        string
  footerCredits?:  string
  postsPerPage?:  number
  recentPosts?:   number

  // flags
  showLogo?: boolean

  // browsing
  browse?: BrowseConfig
}