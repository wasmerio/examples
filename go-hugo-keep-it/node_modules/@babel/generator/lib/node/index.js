"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenContext = void 0;
exports.hasPostfixPart = hasPostfixPart;
exports.isLastChild = isLastChild;
exports.parentNeedsParens = parentNeedsParens;
var parens = require("./parentheses.js");
var _t = require("@babel/types");
var _nodes = require("../nodes.js");
const {
  VISITOR_KEYS
} = _t;
const TokenContext = exports.TokenContext = {
  normal: 0,
  expressionStatement: 1,
  arrowBody: 2,
  exportDefault: 4,
  arrowFlowReturnType: 8,
  forInitHead: 16,
  forInHead: 32,
  forOfHead: 64,
  forInOrInitHeadAccumulate: 128,
  forInOrInitHeadAccumulatePassThroughMask: 128,
  usingForOfBinding: 256,
  classHeritage: 512
};
for (const type of Object.keys(parens)) {
  const func = parens[type];
  if (_nodes.generatorInfosMap.has(type)) {
    _nodes.generatorInfosMap.get(type)[2] = func;
  }
}
function hasPostfixPart(node, parent) {
  return parent != null && parens.hasPostfixPart(node, parent, _nodes.generatorInfosMap.get(parent.type)[1]);
}
function newCalleeNeedsParens(node) {
  let current = node;
  while (true) {
    switch (current.type) {
      case "CallExpression":
      case "ImportExpression":
      case "OptionalCallExpression":
      case "OptionalMemberExpression":
        return true;
      case "MemberExpression":
        current = current.object;
        if (isWrappedOptionalChain(current)) return false;
        break;
      case "TaggedTemplateExpression":
        current = current.tag;
        if (isWrappedOptionalChain(current)) return false;
        break;
      case "TSInstantiationExpression":
      case "TSNonNullExpression":
        current = current.expression;
        break;
      default:
        return false;
    }
  }
}
function isWrappedOptionalChain(node) {
  let current = node;
  while (true) {
    switch (current.type) {
      case "OptionalCallExpression":
      case "OptionalMemberExpression":
        return true;
      case "TSInstantiationExpression":
        if (current !== node) return false;
        current = current.expression;
        break;
      case "TSNonNullExpression":
        current = current.expression;
        break;
      default:
        return false;
    }
  }
}
function printsParens(child, parent) {
  var _generatorInfosMap$ge;
  const parentId = _nodes.generatorInfosMap.get(parent.type)[1];
  const needsParens = (_generatorInfosMap$ge = _nodes.generatorInfosMap.get(child.type)) == null ? void 0 : _generatorInfosMap$ge[2];
  return parentNeedsParens(child, parent, parentId) || needsParens != null && !!needsParens(child, parent, parentId);
}
function endsBeforeLessThanAmbiguously(node, operator) {
  let current = node;
  while (true) {
    let next;
    switch (current.type) {
      case "JSXElement":
      case "JSXFragment":
        return operator === "<";
      case "TSAsExpression":
      case "TSSatisfiesExpression":
        return true;
      case "BinaryExpression":
      case "LogicalExpression":
        next = current.right;
        break;
      case "UnaryExpression":
      case "AwaitExpression":
        next = current.argument;
        break;
    }
    if (next == null || printsParens(next, current)) return false;
    current = next;
  }
}
function parentNeedsParens(node, parent, parentId) {
  switch (parentId) {
    case 10:
      if (parent.left === node && parent.operator.charCodeAt(0) === 60) {
        return endsBeforeLessThanAmbiguously(node, parent.operator);
      }
      break;
    case 112:
      if (parent.callee === node) {
        return newCalleeNeedsParens(node);
      }
      break;
    case 222:
      if (parent.tag === node) {
        return isWrappedOptionalChain(node);
      }
      break;
    case 17:
      if (parent.callee === node) {
        return isWrappedOptionalChain(node);
      }
      break;
    case 108:
      if (parent.object === node) {
        return isWrappedOptionalChain(node);
      }
      break;
    case 42:
      return !isDecoratorMemberExpression(node) && !(node.type === "CallExpression" && isDecoratorMemberExpression(node.callee)) && node.type !== "ParenthesizedExpression";
  }
  return false;
}
function isDecoratorMemberExpression(node) {
  switch (node.type) {
    case "Identifier":
      return true;
    case "MemberExpression":
      return !node.computed && node.property.type === "Identifier" && isDecoratorMemberExpression(node.object);
    default:
      return false;
  }
}
function isLastChild(parent, child) {
  const visitorKeys = VISITOR_KEYS[parent.type];
  for (let i = visitorKeys.length - 1; i >= 0; i--) {
    const val = parent[visitorKeys[i]];
    if (val === child) {
      return true;
    } else if (Array.isArray(val)) {
      let j = val.length - 1;
      while (j >= 0 && val[j] === null) j--;
      return j >= 0 && val[j] === child;
    } else if (val) {
      return false;
    }
  }
  return false;
}

//# sourceMappingURL=index.js.map
