import { formatDate, isValidDate } from './formatDate';
import { findNextNonEmptyLetterField } from './findNextNonEmptyLetterField';
import { findNextNonEmptyNumberField } from './findNextNonEmptyNumberField';
import { ValidationError } from './errors';
import logger from './logger';

// Interface for the parsed patient data
interface PatientData {
    fullName: {
        lastName: string;
        firstName: string;
        middleName?: string;
    };
    dateOfBirth: string;
    primaryCondition: string;
}

// Parse message function
export function parseMessage(message: string): PatientData {
    const segments = message.split('\n');

    let fullName: { lastName: string; firstName: string; middleName?: string } =
        { lastName: '', firstName: '' };
    let dateOfBirth = '';
    let primaryCondition = '';

    segments.forEach((segment) => {
        // Split each segment into fields
        const fields = segment.split('|');

        switch (fields[0]) {
            case 'PRS':
                ({ fullName, dateOfBirth } = parsePRS(fields));
                break;

            case 'DET':
                primaryCondition = parseDET(fields);
                break;
            // Handle other segment types as needed (e.g., MSG, EVT)
            default:
                logger.warn(`Unsupported segment type: ${fields[0]}`);
                break;
        }
    });

    return {
        fullName,
        dateOfBirth,
        primaryCondition,
    };
}

/**
 * Parses the PRS segment fields to extract the patient's full name and date of birth.
 *
 * @param {string[]} fields - The fields of the PRS segment.
 * @returns {Object} - An object containing the patient's full name and date of birth.
 * @returns {Object} fullName - The patient's full name.
 * @returns {string} fullName.lastName - The patient's last name.
 * @returns {string} fullName.firstName - The patient's first name.
 * @returns {string} [fullName.middleName] - The patient's middle name (optional).
 * @returns {string} dateOfBirth - The patient's date of birth in a formatted string.
 * @throws {ValidationError} - If the name field is missing or the date format is invalid in the PRS segment.
 */

function parsePRS(fields: string[]): {
    fullName: { lastName: string; firstName: string; middleName?: string };
    dateOfBirth: string;
} {
    // Extract patient name from PRS segment
    const nameField = findNextNonEmptyLetterField(fields, 1);
    if (!nameField || nameField.trim() === '') {
        throw new ValidationError('Name field is missing in PRS segment');
    }

    const nameComponents = nameField.split('^');
    if (
        nameComponents.length < 2 ||
        !nameComponents[0].trim() ||
        !nameComponents[1].trim()
    ) {
        throw new ValidationError('Invalid name format in PRS segment');
    }

    const fullName = {
        lastName: nameComponents[0] || '',
        firstName: nameComponents[1] || '',
        middleName: nameComponents[2] || undefined,
    };

    // Extract patient date of birth from PRS segment
    const dobField = findNextNonEmptyNumberField(fields, 1);
    if (!dobField || !isValidDate(dobField)) {
        throw new ValidationError('Invalid date format in PRS segment');
    }

    const dateOfBirth = formatDate(dobField);

    return { fullName, dateOfBirth };
}

/**
 * Parses the DET segment fields to extract the primary condition.
 *
 * @param {string[]} fields - The fields of the DET segment.
 * @returns {string} - The primary condition extracted from the DET segment.
 * @throws {ValidationError} - If the primary condition is missing in the DET segment.
 */

function parseDET(fields: string[]): string {
    // Extract primary condition from DET segment
    const primaryCondition = fields[4];
    if (!primaryCondition) {
        throw new ValidationError(
            'Primary condition is missing in DET segment'
        );
    }
    return primaryCondition;
}
