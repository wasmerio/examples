import { createElement, type HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & {
  href?: string; target?: string; type?: "button" | "submit";
  variant?: "outline"; size?: "lg"; disabled?: boolean; loading?: boolean;
};
const component = (name: string) => ({ children, ...props }: Props) =>
  createElement(`wasmer-${name}`, props, children);

export const Starter = component("starter");
export const Card = component("card");
export const Title = component("title");
export const Text = component("text");
export const Stack = component("stack");
export const Badge = component("badge");
export const Action = component("action");
