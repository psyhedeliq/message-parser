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

    it('should throw an error when date of birth is invalid', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|1980-01-01|\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|Common Cold\n`;

        expect(() => parseMessage(message)).toThrow(
            'Invalid date format in PRS segment'
        );
    });

    it('should throw an error when primary condition is missing', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Smith^John|||M|19800101|\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|\n`;

        expect(() => parseMessage(message)).toThrow(
            'Primary condition is missing in DET segment'
        );
    });

    it('should throw an error when name field is missing in PRS segment', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID|||\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|Condition\n`;

        expect(() => parseMessage(message)).toThrow(
            'Name field is missing in PRS segment'
        );
    });

    it('should handle when middle name is missing', () => {
        const message =
            `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n` +
            `EVT|TYPE|20230502112233\n` +
            `PRS|1|9876543210^^^Location^ID||Smith^John|||M|19800101|\n` +
            `DET|1|I|^^MainDepartment^101^Room 1|Common Cold\n`;

        const expectedOutput = {
            fullName: {
                lastName: 'Smith',
                firstName: 'John',
            },
            dateOfBirth: '1980-01-01',
            primaryCondition: 'Common Cold',
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
