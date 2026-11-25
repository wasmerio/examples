export interface FontDefinition {
  readonly family: string;
  readonly src?: string;
}

export interface FontConfig {
  readonly font: readonly FontDefinition[];
  readonly codeFont: readonly FontDefinition[];
}
