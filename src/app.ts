import { existsSync, readFileSync } from 'fs';
import { parseMessage } from './utils/messageParser';
import { handleError } from './utils/errorHandler';
import logger from './utils/logger';
import { join } from 'path';

function main() {
    try {
        const filePath = join(__dirname, 'message.txt');
        if (!existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        // Read the message from a file (for testing purposes)
        const messages = readFileSync(filePath, 'utf-8').split('\n\n');
        messages.forEach((message, index) => {
            const patientData = parseMessage(message);
            console.log(
                `Message ${index + 1}:\n`,
                JSON.stringify(patientData, null, 2)
            );
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            handleError(error);
        } else {
            logger.error('An unknown error occurred');
        }
    }
}

main();
