import { useEffect, useState } from 'react'

export const useActiveSection = (sectionIds: string[]) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const elements = sectionIds.map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const intersecting = new Set<string>()

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id)
          } else {
            intersecting.delete(entry.target.id)
          }
        })

        const active = sectionIds.find(id => intersecting.has(id))

        if (active) setActiveId(active)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )

    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
