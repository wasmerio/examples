import { lightTheme, darkTheme } from "uno.config";

/**
 * 扁平化 key
 * @param obj { a: '888', b: { c: '999', d: '777' } }
 * @param prefix 
 * @returns `{ a: '888', 'b-c': '999', 'b-d': '777' }`
 */
const flattenObject = (obj: { [key: string]: any }, prefix = ''): {} =>
  Object.keys(obj).reduce((res, key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}-${key}` : key;
    return typeof value === 'object' && value !== null
      ? { ...res, ...flattenObject(value, newKey) }
      : { ...res, [newKey]: value };
  }, {});

const lightColors = Object.entries(flattenObject(lightTheme.colors)).map(([k,v]) => `--colors-${k}: ${v};`)
const darkColors = Object.entries(flattenObject(darkTheme.colors)).map(([k,v]) => `--colors-${k}: ${v};`)

export default `
:root {${lightColors.join('')}}
.dark {${darkColors.join('')}}
`