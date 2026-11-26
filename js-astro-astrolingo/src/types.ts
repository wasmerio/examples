// Simple types
export type Lang = string
export type CollectionName = string

// List of coolections
export type ListOfCollections = CollectionName[]

// Multi-language
export interface Multi {
  [key: string]: string;
}

// Page information
export type Page = {
  title: Multi
  description: Multi
}

// Site information
export interface Site extends Page {
  author: Multi
  contact: Multi
}

// Top-level navigation links
export type Links = {
  text: string
  href: string
  languages: string[]
}[]

// Social media links
export type Socials = {
  name: string
  icon: string
  text: string
  href: string
}[]