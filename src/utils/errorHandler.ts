import logger from './logger';

/**
 * Logs the error message to the console.
 *
 * @param {Error} error - The error object containing the error message.
 * @returns {void}
 */

export function handleError(error: Error): void {
    logger.error(`An error occurred: ${error.message}`);
}
