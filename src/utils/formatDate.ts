import { parse, format } from 'date-fns';

/**
 * Formats a date string from 'YYYYMMDD' to 'YYYY-MM-DD'.
 *
 * @param {string} date - The date string in 'YYYYMMDD' format.
 * @returns {string} - The formatted date string in 'YYYY-MM-DD' format, or 'Invalid date format' if the input is not valid.
 */

export function formatDate(date: string): string {
    const parsedDate = parse(date, 'yyyyMMdd', new Date());
    if (isNaN(parsedDate.getTime()) || !isValidDate(date)) {
        return 'Invalid date format';
    }
    return format(parsedDate, 'yyyy-MM-dd');
}

export function isValidDate(date: string): boolean {
    // Add logic to validate the date format
    const regex = /^\d{8}$/;
    return regex.test(date);
}
