type Slots = {
  has(name: string): boolean;
  render(name: string): Promise<string>;
};

/**
 * A slot's rendered HTML, or `""` when it renders nothing visible.
 *
 * `slots.has` is not sufficient on its own: a slot holding an expression that
 * renders nothing — an empty array's `map`, say — still counts as provided.
 * Comments are stripped before the check, so markup left behind by a comment
 * or by editor tooling does not read as content.
 */
export async function slotContent(
  slots: Slots,
  name = "default",
): Promise<string> {
  if (!slots.has(name)) return "";
  const html = await slots.render(name);
  return html.replace(/<!--[\s\S]*?-->/g, "").trim();
}
