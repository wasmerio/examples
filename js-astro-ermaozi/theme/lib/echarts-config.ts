import type { EChartsOption } from 'echarts'

export interface EChartsConfig {
  option?: EChartsOption
  setup?: () => Promise<void>
  isSetup?: boolean
}

let config: EChartsConfig = {}

export const defineEChartsConfig = (value: EChartsConfig): void => { config = value }
export const useEChartsConfig = (): EChartsConfig => config
