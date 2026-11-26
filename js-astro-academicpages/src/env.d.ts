/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'astro-icon/components' {
  import type { HTMLAttributes } from 'astro/types';
  export interface Props extends HTMLAttributes<'svg'> {
    name: string;
    class?: string;
    id?: string;
    size?: number | string;
    width?: number | string;
    height?: number | string;
    title?: string;
    desc?: string;
    'is:inline'?: boolean;
    'aria-hidden'?: string | boolean;
  }
  export const Icon: (_props: Props) => unknown;
}
