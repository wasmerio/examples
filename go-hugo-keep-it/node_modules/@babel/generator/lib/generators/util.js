"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isJSXAttributeRaw = isJSXAttributeRaw;
exports.jsxAttributeString = jsxAttributeString;
const jsxEntityRE = /&(?:#x[\da-f]+|#\d+|[a-z\d]+);/iy;
function isJSXAttributeRaw(raw, value) {
  let j = 0;
  for (let i = 1; i < raw.length - 1;) {
    if (raw.charCodeAt(i) === 38) {
      jsxEntityRE.lastIndex = i;
      if (jsxEntityRE.test(raw)) {
        if (j >= value.length) return false;
        j += value.codePointAt(j) > 0xffff ? 2 : 1;
        i = jsxEntityRE.lastIndex;
        continue;
      }
    }
    if (raw.charCodeAt(i) !== value.charCodeAt(j)) return false;
    i++;
    j++;
  }
  return j === value.length;
}
function jsxAttributeString(value, quotes) {
  value = value.replace(/&(?=#|[a-z\d]+;)/gi, "&amp;");
  const [quote, other] = quotes === "single" ? ["'", '"'] : ['"', "'"];
  if (value.includes(quote)) {
    if (!value.includes(other)) return other + value + other;
    value = value.replace(quote === '"' ? /"/g : /'/g, quote === '"' ? "&quot;" : "&apos;");
  }
  return quote + value + quote;
}

//# sourceMappingURL=util.js.map
