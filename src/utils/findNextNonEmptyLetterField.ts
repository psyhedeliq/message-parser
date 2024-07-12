/**
 * Finds the next non-empty field in the array that contains only letters and carets.
 *
 * @param {string[]} fields - The array of fields to search through.
 * @param {number} startIndex - The index to start searching from.
 * @returns {string} - The first non-empty field containing only letters and carets, or an empty string if none is found.
 */

export function findNextNonEmptyLetterField(
    fields: string[],
    startIndex: number
): string {
    // Regular expression to match a string that contains only letters and at least one caret
    const letterAndCaretRegex = /^(?=.*\^)[A-Za-z^]+$/;
    for (let i = startIndex; i < fields.length; i++) {
        if (
            fields[i] &&
            fields[i].length > 0 &&
            letterAndCaretRegex.test(fields[i])
        ) {
            return fields[i];
        }
    }
    return '';
}
