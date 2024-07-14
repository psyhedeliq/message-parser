/**
 * Custom error class for handling validation errors.
 *
 * This class extends the built-in Error class and adds a custom name property.
 * It is used to represent validation errors that occur during the processing of data.
 *
 * @class ValidationError
 * @extends {Error}
 * @param {string} message - The error message describing the validation error.
 */

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}
