// @env browser
let copy: Record<string, string> | undefined

export function uiText(key: string): string {
  if (!copy) {
    try {
      copy = JSON.parse(document.getElementById('ui-copy')?.textContent ?? '{}') as Record<string, string>
    }
    catch {
      copy = {}
    }
  }
  return copy[key] ?? key
}
