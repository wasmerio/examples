'use client'

import type { ReactNode } from 'react'

import { ChevronRightIcon, CircleSmallIcon } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { cn } from '@/lib/utils'

export type NavigationItem = {
  title: string
  href: string
}

export type NavigationSection = {
  title: string
  icon?: ReactNode
} & (
  | {
      items: NavigationItem[]
      href?: never
    }
  | {
      items?: never
      href: string
    }
)

type Props = {
  trigger: ReactNode
  navigationData: NavigationSection[]
  activeSection?: string
  align?: 'center' | 'end' | 'start'
}

const MenuDropdown = ({ trigger, navigationData, activeSection, align = 'start' }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className='mx-3 w-[min(93vw,500px)] sm:ml-8 md:w-[min(93vw,250px)] max-lg:md:mr-0'
        align={align}
      >
        {navigationData.map(navItem => {
          if (navItem.href) {
            // Extract section ID from href (e.g., "/#categories" -> "categories", "/#" -> "home")
            const sectionFromHref = navItem.href === '/#' ? 'home' : navItem.href.replace('/#', '')
            const isActive = sectionFromHref === activeSection

            return (
              <DropdownMenuItem key={navItem.title} asChild>
                <a href={navItem.href} className={cn(isActive && 'bg-accent text-accent-foreground font-medium')}>
                  {navItem.icon}
                  {navItem.title}
                </a>
              </DropdownMenuItem>
            )
          }

          return (
            <Collapsible key={navItem.title} asChild>
              <DropdownMenuGroup>
                <CollapsibleTrigger asChild>
                  <DropdownMenuItem onSelect={event => event.preventDefault()} className='justify-between'>
                    {navItem.icon}
                    <span className='flex-1'>{navItem.title}</span>
                    <ChevronRightIcon className='shrink-0 transition-transform [[data-state=open]>&]:rotate-90' />
                  </DropdownMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent className='pl-2'>
                  {navItem.items?.map(item => (
                    <DropdownMenuItem key={item.title} asChild>
                      <a href={item.href}>
                        <CircleSmallIcon />
                        <span>{item.title}</span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </CollapsibleContent>
              </DropdownMenuGroup>
            </Collapsible>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MenuDropdown
