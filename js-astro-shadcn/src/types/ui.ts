import type { ComponentProps, HTMLAttributes, ReactNode, ForwardRefExoticComponent, RefAttributes } from 'react';
import type * as React from 'react';
import type { EventHandler, Size } from './common';

export type Variant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

export type ColorScheme = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';

export type ComponentSize = Size;

export type ComponentState = 'default' | 'hover' | 'active' | 'focus' | 'disabled';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

export interface InteractiveProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: EventHandler<globalThis.MouseEvent>;
  onFocus?: EventHandler<globalThis.FocusEvent>;
  onBlur?: EventHandler<globalThis.FocusEvent>;
}

export interface ButtonProps extends BaseComponentProps, InteractiveProps {
  variant?: Variant;
  size?: ComponentSize;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface InputProps extends BaseComponentProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  error?: boolean;
  size?: ComponentSize;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  onChange?: EventHandler<globalThis.InputEvent>;
  onKeyDown?: EventHandler<globalThis.KeyboardEvent>;
}

export interface DialogProps extends BaseComponentProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  title?: string;
  description?: string;
}

export interface TooltipProps extends BaseComponentProps {
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
}

export interface BadgeProps extends BaseComponentProps {
  variant?: Variant;
  size?: ComponentSize;
  colorScheme?: ColorScheme;
}

export interface CardProps extends BaseComponentProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: ComponentSize;
  hoverable?: boolean;
}

export interface ModalProps extends DialogProps {
  size?: ComponentSize | 'xs' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  trapFocus?: boolean;
}

export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
}

export interface SelectProps<T = string> extends BaseComponentProps {
  options: SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: ComponentSize;
  onChange?: (value: T | T[]) => void;
}

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: string) => void;
}

export interface IconProps extends HTMLAttributes<globalThis.SVGElement> {
  size?: number | ComponentSize;
  color?: string;
  strokeWidth?: number;
}

export interface LoadingProps extends BaseComponentProps {
  size?: ComponentSize;
  color?: ColorScheme;
  text?: string;
}

export type ComponentWithRef<T, P = Record<string, never>> = ForwardRefExoticComponent<P & RefAttributes<T>>;

export type PolymorphicComponentProps<T extends keyof React.JSX.IntrinsicElements = 'div'> = {
  as?: T;
} & ComponentProps<T>;
