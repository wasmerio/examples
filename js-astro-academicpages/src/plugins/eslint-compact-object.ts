import type { Rule } from 'eslint';

export const compactObjectSingleLineRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'Enforce single-line formatting for compact object literals that fit within the configured line width',
      recommended: false,
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          maxWidth: {
            type: 'integer',
            minimum: 1,
            description:
              'Maximum allowable line length for collapsing object literals onto a single line (default: 80)',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      compactObject:
        'Object literal ({{length}} chars) fits within {{maxWidth}} column limit and should be formatted on a single line.',
    },
  },
  create(context) {
    const options =
      (context.options[0] as { maxWidth?: number } | undefined) || {};
    const maxWidth = options.maxWidth ?? 80;
    const sourceCode = context.sourceCode;

    return {
      ObjectExpression(node) {
        if (!node.loc || node.properties.length === 0) return;

        const firstToken = sourceCode.getFirstToken(node);
        const lastToken = sourceCode.getLastToken(node);
        if (
          !firstToken ||
          !lastToken ||
          firstToken.loc.end.line === lastToken.loc.start.line
        )
          return;

        for (const prop of node.properties) {
          if (prop.type !== 'Property' && prop.type !== 'SpreadElement') return;
          if (prop.loc && prop.loc.start.line !== prop.loc.end.line) return;
        }

        if (sourceCode.getCommentsInside(node).length > 0) return;

        const propTexts = node.properties.map((p) => sourceCode.getText(p));
        const singleLineText = `{ ${propTexts.join(', ')} }`;

        const prefixLength = node.loc.start.column;
        const lineAfter =
          sourceCode.lines[node.loc.end.line - 1].slice(node.loc.end.column) ||
          '';
        const estimatedLength =
          prefixLength + singleLineText.length + lineAfter.length;

        if (estimatedLength > maxWidth) return;

        context.report({
          node,
          messageId: 'compactObject',
          data: { length: String(estimatedLength), maxWidth: String(maxWidth) },
          fix(fixer) {
            return fixer.replaceText(node, singleLineText);
          },
        });
      },
    };
  },
};
