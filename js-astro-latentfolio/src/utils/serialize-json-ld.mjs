/**
 * Serialize data for an HTML script element without letting string values end
 * the element. JSON escaping alone does not escape HTML's </script delimiter.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function serializeJsonLd(value) {
  const json = JSON.stringify(value);
  if (json === undefined) {
    throw new TypeError('JSON-LD must be a JSON-serializable value.');
  }

  const escapes = {
    '<': '\\u003c',
    '>': '\\u003e',
    '&': '\\u0026',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029',
  };

  return json.replace(/[<>&\u2028\u2029]/g, (character) => escapes[character]);
}
