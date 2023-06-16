import { App, VNode } from 'vue'

export type SizeType = null | '' | 'large'| 'default'| 'small'
export type ValueOf<T> = T extends any[] ? T[number] : T[keyof T]

export type VNodeStyle = Record<string, string | number>
export type VNodeClassName = Record<string, boolean>

export type SlotVNodeType = JSX.Element | VNode | string | number
