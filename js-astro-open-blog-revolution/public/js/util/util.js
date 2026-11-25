/*
sanitizeString replaces unwanted characters in string with ''
turns to lowercase
*/

export function sanitizeString(s) {
    const sanitizeString = s.trim().replace(/[^a-zA-Z\w\s]/gi, "").replaceAll(" ", "-").toLowerCase();
    const sanitizeStringNoStartDash = sanitizeString[0] === '-' ? sanitizeString.slice(1) : sanitizeString;
    const sanitizeStringNoStartOrEndDash = sanitizeStringNoStartDash[sanitizeStringNoStartDash.length-1] === '-' ? sanitizeStringNoStartDash.slice(0, sanitizeStringNoStartDash.length-1) : sanitizeStringNoStartDash;

    return sanitizeStringNoStartOrEndDash;
}