import logger from './logger';
import { ValidationError } from './errors';

/**
 * Logs the error message to the console.
 *
 * @param {Error} error - The error object containing the error message.
 * @returns {void}
 */

export function handleError(error: Error): void {
    if (error instanceof ValidationError) {
        logger.warn(`Validation error: ${error.message}`);
    } else {
        logger.error(`An error occurred: ${error.message}`);
    }
}
