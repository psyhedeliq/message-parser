import { parseMessage } from '../../utils/messageParser';

describe('parseMessage', () => {
    it('should correctly parse a valid message', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|Common Cold\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Smith',
                firstName: 'John',
                middleName: 'A',
            },
            dateOfBirth: '1980-01-01',
            primaryCondition: 'Common Cold',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle missing middle name', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Doe^Jane||F|19900202|\n` +
            `DET|1|I|^^MainDepartment^102^Room 2|Flu\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Doe',
                firstName: 'Jane',
            },
            dateOfBirth: '1990-02-02',
            primaryCondition: 'Flu',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle incorrect date format', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|1980-01-01|\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|Common Cold\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Smith',
                firstName: 'John',
                middleName: 'A',
            },
            dateOfBirth: 'Invalid date format',
            primaryCondition: 'Common Cold',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle missing fields; middle name and primary condition', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Smith^John|||M|19800101|\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Smith',
                firstName: 'John',
            },
            dateOfBirth: '1980-01-01',
            primaryCondition: '',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle extra fields', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|ExtraField\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|Common Cold|ExtraField\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Smith',
                firstName: 'John',
                middleName: 'A',
            },
            dateOfBirth: '1980-01-01',
            primaryCondition: 'Common Cold',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle invalid segment types', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `XYZ|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|Common Cold\n`;

        const expectedOutput = {
            fullName: {
                lastName: '',
                firstName: '',
            },
            dateOfBirth: '',
            primaryCondition: 'Common Cold',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle an empty message string', () => {
        const message = '';

        const expectedOutput = {
            fullName: {
                lastName: '',
                firstName: '',
            },
            dateOfBirth: '',
            primaryCondition: '',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle multiple messages in a single input string', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|Common Cold\n\n` +
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112234\n` +
            `EVT|TYPE|20230502112234\n` +
            `PRS|1|9876543211^^^Location^ID||Doe^Jane||F|19900202|\n` +
            `DET|1|I|^^MainDepartment^102^Room 2|Flu\n`;

        const expectedOutput1 = {
            fullName: {
                lastName: 'Smith',
                firstName: 'John',
                middleName: 'A',
            },
            dateOfBirth: '1980-01-01',
            primaryCondition: 'Common Cold',
        };

        const expectedOutput2 = {
            fullName: {
                lastName: 'Doe',
                firstName: 'Jane',
            },
            dateOfBirth: '1990-02-02',
            primaryCondition: 'Flu',
        };

        const messages = message.split('\n\n');
        const result1 = parseMessage(messages[0]);
        const result2 = parseMessage(messages[1]);

        expect(result1).toEqual(expectedOutput1);
        expect(result2).toEqual(expectedOutput2);
    });

    it('should handle segment without trailing pipe', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101\n` + // No trailing pipe
            `DET|1|I|^^MainDepartment^101^Room 1|Common Cold\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Smith',
                firstName: 'John',
                middleName: 'A',
            },
            dateOfBirth: '1980-01-01',
            primaryCondition: 'Common Cold',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle field without trailing pipe', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Doe^Jane||F|19900202\n` + // No trailing pipe
            `DET|1|I|^^MainDepartment^102^Room 2|Flu\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Doe',
                firstName: 'Jane',
            },
            dateOfBirth: '1990-02-02',
            primaryCondition: 'Flu',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle component without trailing pipe', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|Common Cold\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Smith',
                firstName: 'John',
                middleName: 'A',
            },
            dateOfBirth: '1980-01-01',
            primaryCondition: 'Common Cold',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle name without trailing pipe if middle name is missing', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Doe^Jane||F|19900202\n` + // No trailing pipe after Jane
            `DET|1|I|^^MainDepartment^102^Room 2|Flu\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Doe',
                firstName: 'Jane',
            },
            dateOfBirth: '1990-02-02',
            primaryCondition: 'Flu',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle name with trailing pipe if middle name is missing', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Doe^Jane^|F|19900202|\n` + // Trailing pipe after Jane
            `DET|1|I|^^MainDepartment^102^Room 2|Flu\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Doe',
                firstName: 'Jane',
            },
            dateOfBirth: '1990-02-02',
            primaryCondition: 'Flu',
        };

        const result = parseMessage(message);
        expect(result).toEqual(expectedOutput);
    });
});
