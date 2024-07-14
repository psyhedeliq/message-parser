import { formatDate, isValidDate } from './formatDate';
import { findNextNonEmptyLetterField } from './findNextNonEmptyLetterField';
import { findNextNonEmptyNumberField } from './findNextNonEmptyNumberField';
import { ValidationError } from './errors';

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
                // Extract patient name and date of birth from PRS segment
                const nameField = findNextNonEmptyLetterField(fields, 1);
                if (!nameField || nameField.trim() === '') {
                    throw new ValidationError(
                        'Name field is missing in PRS segment'
                    );
                }

                const nameComponents = nameField.split('^');

                fullName = {
                    lastName: nameComponents[0] || '',
                    firstName: nameComponents[1] || '',
                    middleName: nameComponents[2] || undefined,
                };

                const dobField = findNextNonEmptyNumberField(fields, 1);
                if (!dobField || !isValidDate(dobField)) {
                    throw new ValidationError(
                        'Invalid date format in PRS segment'
                    );
                } else {
                    dateOfBirth = formatDate(dobField);
                }
                break;

            case 'DET':
                // Extract primary condition from DET segment
                primaryCondition = fields[4];
                if (!primaryCondition) {
                    throw new ValidationError(
                        'Primary condition is missing in DET segment'
                    );
                }
                break;
            // Handle other segment types as needed (e.g., MSG, EVT)
        }
    });

    return {
        fullName,
        dateOfBirth,
        primaryCondition,
    };
}
