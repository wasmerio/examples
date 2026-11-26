const modules = import.meta.glob<{ default: any }>('../components/slots/*.{astro,vue}', { eager: true })
const layouts = import.meta.glob<{ default: any }>('../components/layouts/*.{astro,vue}', { eager: true })

const pascalCase = (name: string) => name.split('-').map(part => part[0]?.toUpperCase() + part.slice(1)).join('')

export function userSlotComponent(name: string) {
  const pascalName = pascalCase(name)
  return modules[`../components/slots/${name}.astro`]?.default
    ?? modules[`../components/slots/${name}.vue`]?.default
    ?? modules[`../components/slots/${pascalName}.astro`]?.default
    ?? modules[`../components/slots/${pascalName}.vue`]?.default
}

export function userLayoutComponent(name: string) {
  const pascalName = pascalCase(name)
  return layouts[`../components/layouts/${name}.astro`]?.default
    ?? layouts[`../components/layouts/${name}.vue`]?.default
    ?? layouts[`../components/layouts/${pascalName}.astro`]?.default
    ?? layouts[`../components/layouts/${pascalName}.vue`]?.default
}

export const hasUserSlot = (name: string) => Boolean(userSlotComponent(name))
