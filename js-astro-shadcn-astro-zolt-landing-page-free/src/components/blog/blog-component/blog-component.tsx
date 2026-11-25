'use client'

import { useState } from 'react'

import { SearchIcon, ArrowRightIcon, CalendarDaysIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import { formatPostDate } from '@/lib/utils'

export type BlogPost = {
  id: number
  slug: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  pubDate: string
  author: string
  avatarUrl: string
  category: string
  readTime: number
  featured: boolean
  tags?: string[]
}

interface BlogProps {
  blogData?: BlogPost[]
}

const BlogGrid = ({ posts, onCategoryClick }: { posts: BlogPost[]; onCategoryClick: (category: string) => void }) => {
  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {posts.map(post => (
        <Card
          key={post.id}
          className='group h-full overflow-hidden shadow-none transition-all duration-300 hover:shadow-md'
        >
          <CardContent className='space-y-3.5'>
            <a href={`/blog/${post.slug}`} className='mb-6 block overflow-hidden rounded-lg no-underline sm:mb-12'>
              <img
                src={post.imageUrl}
                alt={post.imageAlt}
                className='h-59.5 w-full object-cover transition-transform duration-300 group-hover:scale-105'
              />
            </a>
            <div className='flex items-center justify-between gap-1.5'>
              <div className='text-muted-foreground flex items-center gap-1.5'>
                <CalendarDaysIcon className='size-6' />
                <p className='font-medium'>{formatPostDate(post.pubDate)}</p>
              </div>
              <Badge
                className='bg-primary/10 text-primary badge cursor-pointer rounded-full border-0 text-sm'
                onClick={() => onCategoryClick(post.category)}
              >
                {post.category}
              </Badge>
            </div>
            <a href={`/blog/${post.slug}`} className='no-underline'>
              <h3 className='hover:text-primary line-clamp-2 text-lg font-medium transition-colors md:text-xl'>
                {post.title}
              </h3>
            </a>
            <p className='text-muted-foreground line-clamp-2'>{post.description}</p>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>{post.author}</span>
              <a href={`/blog/${post.slug}`} className='no-underline'>
                <Button
                  size='icon'
                  className='group-hover:bg-primary! bg-background text-foreground hover:bg-primary! hover:text-primary-foreground group-hover:text-primary-foreground border group-hover:border-transparent hover:border-transparent'
                >
                  <ArrowRightIcon className='size-4 -rotate-45' />
                  <span className='sr-only'>Read more: {post.title}</span>
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const Blog = ({ blogData = [] }: BlogProps) => {
  const [selectedTab, setSelectedTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter out featured posts to avoid duplication with hero section
  // Sort posts by ID in descending order (newest first)
  const nonFeaturedPosts = blogData.filter(post => !post.featured).sort((a, b) => b.id - a.id)

  // Dynamically generate categories from the available data
  const uniqueCategories = [...new Set(nonFeaturedPosts.map(post => post.category))]
  const categories = ['All', ...uniqueCategories.sort()]

  // Filter posts based on search query and selected category
  const filteredPosts = nonFeaturedPosts.filter(post => {
    // Category filter
    const matchesCategory = selectedTab === 'All' || post.category === selectedTab

    // Search filter
    if (!searchQuery) return matchesCategory

    const query = searchQuery.toLowerCase()

    const matchesSearch =
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
  }

  return (
    <section className='py-8 sm:py-16 lg:py-24' id='categories'>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8'>
        {/* Header */}
        <div className='space-y-4'>
          {selectedTab === 'All' && searchQuery === '' && <p className='text-sm'>Blogs</p>}
          {selectedTab === 'All' && searchQuery !== '' && (
            <p className='text-sm'>
              Search results for "{searchQuery}" ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              )
            </p>
          )}
          {selectedTab !== 'All' && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/blog'>Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedTab}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}

          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            Build Better Products with Insights & Inspiration.
          </h2>

          <p className='text-muted-foreground text-lg md:text-xl'>
            Practical insights and real stories to guide your product from vision to reality.
          </p>
        </div>

        {/* Tabs and Search */}
        <Tabs defaultValue='All' value={selectedTab} onValueChange={handleTabChange} className='gap-8 lg:gap-16'>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <ScrollArea className='bg-muted w-full rounded-lg sm:w-auto'>
              <TabsList className='h-auto gap-1'>
                {categories.map(category => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    id={`category-${category}`}
                    className='hover:bg-primary/10 cursor-pointer rounded-lg px-4 text-base'
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>

            <div className='relative max-md:w-full'>
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
                <SearchIcon className='size-4' />
                <span className='sr-only'>Search</span>
              </div>
              <Input
                type='search'
                placeholder='Search'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='peer h-10 px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
              />
            </div>
          </div>

          {/* All Posts Tab */}
          <TabsContent value='All'>
            {filteredPosts.length > 0 ? (
              <BlogGrid posts={filteredPosts} onCategoryClick={handleTabChange} />
            ) : (
              <div className='text-muted-foreground flex min-h-100 flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center'>
                <SearchIcon className='size-12 opacity-50' />
                <div className='space-y-2'>
                  <h3 className='text-foreground text-lg font-medium'>No posts found</h3>
                  <p className='text-sm'>
                    {searchQuery
                      ? `No results for "${searchQuery}". Try a different search term.`
                      : 'No blog posts available at the moment.'}
                  </p>
                </div>
                {searchQuery && (
                  <Button variant='outline' size='sm' onClick={() => setSearchQuery('')}>
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Category-specific Tabs */}
          {categories.slice(1).map(category => (
            <TabsContent key={category} value={category}>
              {filteredPosts.filter(post => post.category === category).length > 0 ? (
                <BlogGrid
                  posts={filteredPosts.filter(post => post.category === category)}
                  onCategoryClick={handleTabChange}
                />
              ) : (
                <div className='text-muted-foreground flex min-h-100 flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center'>
                  <SearchIcon className='size-12 opacity-50' />
                  <div className='space-y-2'>
                    <h3 className='text-foreground text-lg font-medium'>No posts found</h3>
                    <p className='text-sm'>
                      {searchQuery
                        ? `No results in "${category}" for "${searchQuery}".`
                        : `No posts in "${category}" category yet.`}
                    </p>
                  </div>
                  {searchQuery && (
                    <Button variant='outline' size='sm' onClick={() => setSearchQuery('')}>
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default Blog
