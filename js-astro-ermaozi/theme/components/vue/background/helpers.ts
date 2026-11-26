export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]'

export const isIOS = () => {
  if (typeof navigator === 'undefined') return false
  const client = navigator as unknown as { platform: string, userAgentData?: { platform?: string } }
  const platform = client.userAgentData?.platform ?? client.platform
  return /ios/i.test(platform) || /\biPhone\b/iu.test(platform) || /\biPad\b/iu.test(platform)
}
