export interface HeadProps {
  title: string;
  description: string;
  image?: string;
}

export interface ToolLogoVariant {
  light?: string;
  dark?: string;
}

export type ToolLogoSource = string | ToolLogoVariant;
