// src/plugins/admonitions.ts  Admonitions 插件类型定义

export type Root = {
    type: 'root'
    children: unknown[]
    data?: Record<string, unknown>
}

export type Paragraph = {
    type: 'paragraph'
    children: unknown[]
    data?: Record<string, unknown>
}

export type TitleText = {
    type: 'text'
    value: string
}

export type ContainerDirective = {
    type: 'containerDirective'
    name?: string
    children?: unknown[]
    data?: Record<string, unknown>
    label?: unknown
    attributes?: Record<string, unknown>
}
