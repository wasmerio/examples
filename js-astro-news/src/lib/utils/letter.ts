/**
 * Capitalizes the first letter of a string
 * @param val - The string to capitalize
 * @returns The string with its first letter capitalized
 */
export const capitalizeFirstLetter = (val: string): string => {
    if (!val || typeof val !== 'string' || val.length === 0) {
        return val;
    }

    // Convert to string only once and cache the result
    const str = String(val);
    return str.charAt(0).toUpperCase() + str.slice(1);
};