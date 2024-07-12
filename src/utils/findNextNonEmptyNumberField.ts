/**
 * Finds the next non-empty field in the array that contains exactly eight digits.
 *
 * @param {string[]} fields - The array of fields to search through.
 * @param {number} startIndex - The index to start searching from.
 * @returns {string} - The first non-empty field containing exactly eight digits, or an empty string if none is found.
 */

export function findNextNonEmptyNumberField(
    fields: string[],
    startIndex: number
): string {
    // Regular expression to match a string that contains exactly eight digits
    const exactEightDigitsRegex = /^\d{8}$/;
    for (let i = startIndex; i < fields.length; i++) {
        if (
            fields[i] &&
            fields[i].length > 0 &&
            exactEightDigitsRegex.test(fields[i])
        ) {
            return fields[i];
        }
    }
    return '';
}
