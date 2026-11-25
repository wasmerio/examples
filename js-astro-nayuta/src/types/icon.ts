/**
 * Image icon
 */
export interface ImgIcon {
  type: 'img';
  src: string;
  alt?: string;
}

/**
 * SVG icon support: supports raw inline SVG string or SVG file URL
 */
export interface SvgIcon {
  type: 'svg';
  raw?: string;
  url?: string;
  alt?: string;
}

/**
 * Built-in font icon support (e.g. FontAwesome)
 */
export interface FontIcon {
  type: 'icon' | 'font';
  name?: string;
  class?: string;
}

/**
 * Icon union type differentiated by `type`.
 */
export type Icon = ImgIcon | SvgIcon | FontIcon;
