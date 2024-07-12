import { Request, Response } from 'express';
import { parseMessage } from '../../utils/messageParser';

/**
 * Controller to handle parsing of patient messages.
 *
 * This function extracts a message from the request body, processes it using the parseMessage function,
 * and returns the extracted patient data as the response. In case of an error during processing, it returns
 * a 500 status code with an error message.
 *
 * @param {Request} req - The Express request object, containing the message in the body.
 * @param {Response} res - The Express response object, used to send the response back to the client.
 * @returns {void}
 */

export const parseMessageController = (req: Request, res: Response): void => {
    try {
        const message = req.body.message;
        const patientData = parseMessage(message);

        // Mock database interaction
        console.log('Mock database save:', patientData);

        res.status(200).json(patientData);
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while processing the message.',
        });
    }
};
