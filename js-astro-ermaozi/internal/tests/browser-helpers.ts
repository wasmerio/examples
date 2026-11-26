import { expect, type Locator } from '@playwright/test'

export async function expectHoveredCss(locator: Locator, property: string, expected: string) {
  await expect.poll(async () => {
    await locator.hover()
    return locator.evaluate(async (element, name) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return getComputedStyle(element).getPropertyValue(name)
    }, property)
  }).toBe(expected)
}
