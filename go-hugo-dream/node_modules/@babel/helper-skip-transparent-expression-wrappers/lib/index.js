import * as _t from '@babel/types';

const {
  isParenthesizedExpression,
  isTSAsExpression,
  isTSInstantiationExpression,
  isTSNonNullExpression,
  isTSSatisfiesExpression,
  isTSTypeAssertion,
  isTypeCastExpression
} = _t;
function isTransparentExprWrapper(node) {
  return isTSAsExpression(node) || isTSInstantiationExpression(node) || isTSSatisfiesExpression(node) || isTSTypeAssertion(node) || isTSNonNullExpression(node) || isTypeCastExpression(node) || isParenthesizedExpression(node);
}
function skipTransparentExprWrappers(path) {
  while (isTransparentExprWrapper(path.node)) {
    path = path.get("expression");
  }
  return path;
}
function skipTransparentExprWrapperNodes(node) {
  while (isTransparentExprWrapper(node)) {
    node = node.expression;
  }
  return node;
}

export { isTransparentExprWrapper, skipTransparentExprWrapperNodes, skipTransparentExprWrappers };
